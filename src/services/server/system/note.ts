import ignore from 'ignore'
import {
    CodeNotFound,
    CodeOk,
    createPaginationByPage,
    decodeBase64String,
    emptySelectResult,
    encodeBase64String,
    getMimeType,
    isValidUUID,
    PLGetResult,
    PLSelectResult,
    uuidV7,
} from "@pnnh/atom";
import {bulkInsertOrUpdateNotes} from "@/services/server/system/database";
import {openMainDatabase} from "@/services/server/database/database";
import {NewNoteModel, PSNoteFileModel, PSNoteMetadataModel, PSNoteModel,} from "@/services/common/note";
import fs from "node:fs";
import frontMatter from "front-matter";
import path from "path";
import {resolvePath} from "@pnnh/atom/nodejs";

const assetsIgnore = ignore().add(['.*', 'node_modules', 'dist', 'build', 'out', 'target', 'logs', 'logs/*', 'logs/**/*'])

export async function fillNoteMetadata(noteDirectoryFullPath: string, model: PSNoteModel) {
    let contentFile = path.join(noteDirectoryFullPath, 'index.md')
    let contentText: string | undefined
    if (fs.existsSync(contentFile)) {
        contentText = fs.readFileSync(contentFile, 'utf-8')
    } else {
        contentFile = path.join(noteDirectoryFullPath, 'README.md')
        if (fs.existsSync(contentFile)) {
            contentText = fs.readFileSync(contentFile, 'utf-8')
        }
    }
    if (!contentFile || !contentText) {
        return
    }
    const statIndex = fs.statSync(contentFile)
    model.create_time = statIndex.birthtime.toISOString()
    model.update_time = statIndex.mtime.toISOString()
    const matter = frontMatter(contentText)
    model.body = matter.body
    const metadata = matter.attributes as PSNoteMetadataModel

    const noteUid = metadata.uid
    if (noteUid) {
        if (isValidUUID(noteUid)) {
            model.uid = noteUid
        } else {
            throw new Error('urn格式错误')
        }
    }
    if (metadata.description) {
        model.description = metadata.description
    }
    if (metadata.image) {
        model.cover = metadata.image
    }
    if (metadata.title) {
        model.title = metadata.title
    }
}

export class SystemNoteService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = resolvePath(systemDomain)
    }

    async syncNotesInChannel(channelUrn: string, channelFullPath: string) {
        const notes: PSNoteModel[] = []
        const files = fs.readdirSync(channelFullPath)
        for (const file of files) {

            const fullPath = path.join(channelFullPath, file)
            const stat = fs.statSync(fullPath)
            const extName = path.extname(file)
            if ((stat.isDirectory() && extName === '.note')) {
                const model = await this.#parseNoteInfo(channelUrn, fullPath)
                if (model) {
                    notes.push(model)
                }
            }
        }
        await bulkInsertOrUpdateNotes(notes)
        return notes
    }

    async selectNotesFromDatabase(page: number, size: number, sort: string, keyword: string,
                                  filter: string, channel: string): Promise<PLSelectResult<PSNoteModel>> {

        const db = await openMainDatabase();
        const {limit, offset} = createPaginationByPage(page, size);

        let selectSql = `SELECT * FROM notes WHERE 1 = 1 `;
        let selectParams: any = {}

        if (keyword) {
            selectSql += ` AND (title LIKE '%' || :keyword || '%' OR description LIKE '%' || :keyword || '%' OR body LIKE '%' || :keyword || '%') `;
            selectParams[":keyword"] = keyword;
        }
        if (channel) {
            selectSql += ` AND channel = :channel `;
            selectParams[":channel"] = channel;
        }
        if (filter) {
            if (filter === 'year') {
                selectSql += ` AND strftime('%Y', update_time) = strftime('%Y', 'now') `;
            } else if (filter === 'month') {
                selectSql += ` AND strftime('%Y-%m', update_time) = strftime('%Y-%m', 'now') `;
            }
        }

        const count = await db.get<{ total: number }>(
            `SELECT COUNT(*) AS total FROM (${selectSql}) as temp`, selectParams
        );
        if (!count) {
            throw new Error("查询count失败");
        }
        selectSql += ` ORDER BY ${sort === 'latest' ? 'update_time' : 'discover'} DESC LIMIT :limit OFFSET :offset`;
        selectParams[":limit"] = limit;
        selectParams[":offset"] = offset;
        const result = await db.all<PSNoteModel[]>(
            selectSql, selectParams,
        );
        return {
            code: CodeOk,
            message: '',
            data: {
                range: result,
                count: count.total,
                page: page,
                size: result.length
            }
        }
    }

    async getNote(channelUrn: string, noteUrn: string) {
        const channelPath = decodeBase64String(channelUrn)
        const notePath = decodeBase64String(noteUrn)
        let fullPath = path.join(this.systemDomain, channelPath, notePath)

        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) {
            return await this.#parseNoteInfo(channelPath, fullPath)
        }
        fullPath = path.join(this.systemDomain, channelPath, `${noteUrn}.md`)
        if (fs.existsSync(fullPath)) {
            return await this.#parseNoteInfo(channelPath, fullPath)
        }
        return undefined
    }

    async findNoteFromDatabase(uid: string): Promise<PLGetResult<PSNoteModel | undefined>> {
        const db = await openMainDatabase()
        const result = await db.all<PSNoteModel[]>(
            `select * from notes where uid = :uid limit 1`, {
                ':uid': uid,
            })
        if (!result || result.length === 0) {
            return {
                code: CodeNotFound,
                message: '',
                data: undefined
            }
        }
        return {
            code: CodeOk,
            message: '',
            data: result.length > 0 ? result[0] : undefined
        }
    }

    async selectFiles(channelUrn: string, noteUrn: string, parentUrn: string): Promise<PLSelectResult<PSNoteFileModel>> {

        const files = this.#scanFiles(channelUrn, noteUrn, parentUrn)
        return {
            code: CodeOk,
            message: '',
            data: {
                range: files,
                count: files.length,
                page: 1,
                size: files.length
            }
        }
    }

    readAssets(channelUrn: string, noteUrn: string, assetsUrn: string) {
        const channelPath = decodeBase64String(channelUrn)
        const notePath = decodeBase64String(noteUrn)
        const assetsPath = decodeBase64String(assetsUrn)
        const fullPath = path.join(this.systemDomain, channelPath, notePath, assetsPath)

        const stat = fs.statSync(fullPath)
        if (stat && stat.isFile() && stat.size < 4096000) {
            const mimeType = getMimeType(assetsPath)
            return {
                mime: mimeType,
                buffer: fs.readFileSync(fullPath)
            }
        }
        return undefined
    }

    async selectNotes(libraryUrn: string): Promise<PLSelectResult<PSNoteModel>> {
        const basePath = this.systemDomain
        const notes: PSNoteModel[] = []
        const libraryFileName = decodeBase64String(libraryUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName))) {
            return emptySelectResult()
        }
        const files = fs.readdirSync(path.join(basePath, libraryFileName))
        for (const file of files) {
            const stat = fs.statSync(path.join(basePath, libraryFileName, file))
            if (stat.isDirectory() && file.endsWith('.note')) {
                const noteName = path.basename(file, path.extname(file))
                const noteUniqueName = uuidV7()//encodeMD5Format(file)

                const model = NewNoteModel()
                model.uid = noteUniqueName
                model.name = noteName
                const metadataFile = basePath + '/' + file + '/metadata.md'
                if (fs.existsSync(metadataFile)) {
                    const metadataText = fs.readFileSync(metadataFile, 'utf-8')
                    const metadata = frontMatter(metadataText).attributes as
                        { image: string, description: string, title: string }
                    if (metadata) {
                        if (metadata.description) {
                            model.description = metadata.description
                        }
                        if (metadata.title) {
                            model.name = metadata.title
                        }
                    }
                }
                notes.push(model)
            }
        }
        return {
            code: CodeOk, message: '',
            data: {
                range: notes,
                count: notes.length,
                page: 1,
                size: notes.length
            }
        }
    }

    async #parseNoteInfo(channelUrn: string, noteFullPath: string): Promise<PSNoteModel | undefined> {
        const extName = path.extname(noteFullPath)
        const noteName = path.basename(noteFullPath, extName)

        const model: PSNoteModel = {
            uid: '', discover: 0,
            create_time: "", creator: "",
            update_time: "",
            description: '',
            title: noteName,
            header: 'markdown',
            body: '',
            keywords: '',
            cover: '',
            owner: '',
            channel: channelUrn,
            partition: '',
            path: '',
            coverUrl: '', lang: '', channel_name: '', name: '',
            url: '', repo_url: '', full_repo_url: '', full_repo_path: ''
        }

        await fillNoteMetadata(noteFullPath, model)

        if (!model.uid || !model.title) {
            return undefined
        }
        return model
    }

    #scanFiles(channelUrn: string, noteUrn: string, parentUrn: string): PSNoteFileModel[] {
        const channelPath = decodeBase64String(channelUrn)
        const notePath = decodeBase64String(noteUrn)
        const parentPath = parentUrn ? decodeBase64String(parentUrn) : ''

        const parentFullPath = path.join(this.systemDomain, channelPath, notePath, parentPath)
        if (!fs.existsSync(parentFullPath)) {
            return []
        }
        const files = fs.readdirSync(parentFullPath)
        const resultFiles = files
            .filter(file => !assetsIgnore.ignores(file))
            .map(file => {
                const assetFullPath = path.join(parentFullPath, file)
                const stat = fs.statSync(assetFullPath)
                const assetRelativePath = path.join(parentPath, file)
                const assetUrn = encodeBase64String(assetRelativePath)
                const modelPath = path.join(parentPath, file)
                return {
                    name: file,
                    path: modelPath,
                    uid: assetUrn,
                    type: stat.isDirectory() ? 'directory' : 'file',
                    title: file,
                    is_dir: stat.isDirectory(),
                    is_text: false,
                    is_image: false,
                    storage_path: modelPath,
                    full_repo_path: ''
                } as PSNoteFileModel
            })
        return resultFiles
    }
}
