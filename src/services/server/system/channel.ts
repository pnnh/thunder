import fs from "fs";
import path from "path";
import {decodeBase64String, encodeBase64String} from "@pnnh/atom";
import {getMimeType} from "@pnnh/atom";
import {isValidUUID, uuidV4} from "@pnnh/atom";
import {resolvePath} from "@pnnh/atom";
import frontMatter from "front-matter";
import {SystemArticleService} from "@/services/server/system/article";
import {openMainDatabase} from "@/services/server/database/database";
import {PSChannelMetadataModel, PSChannelModel} from "@/services/common/channel";

export class SystemChannelService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = resolvePath(systemDomain)
    }

    async #parseChannelInfo(channelFullPath: string): Promise<PSChannelModel | undefined> {
        const stat = fs.statSync(channelFullPath)
        const extName = path.extname(channelFullPath)
        if (!stat.isDirectory() || (extName !== '.chan' && extName !== '.channel')) {
            return undefined
        }
        const model: PSChannelModel = {
            create_time: "", creator: "", profile: "", update_time: "",
            image: '',
            name: path.basename(channelFullPath, extName),
            description: '',
            uid: '',
            lang: '',
            match: '',
            owner: '',
            title:''
        }

        // 从metadata.md中解析元数据
        const indexFile = path.join(channelFullPath, 'metadata.md')
        let contentText: string | undefined
        if (fs.existsSync(indexFile)) {
            contentText = fs.readFileSync(indexFile, 'utf-8')
        } else {
            const readmeFile = path.join(channelFullPath, 'README.md')
            if (fs.existsSync(readmeFile)) {
                contentText = fs.readFileSync(readmeFile, 'utf-8')
            }
        }
        if (!contentText) {
            return undefined
        }
        const matter = frontMatter(contentText)
        const metadata = matter.attributes as PSChannelMetadataModel
        if (metadata) {
            const noteUid = metadata.uid
            if (noteUid) {
                if (isValidUUID(noteUid)) {
                    model.uid = noteUid
                } else {
                    throw new Error('uid格式错误')
                }
            }
            if (metadata.description) {
                model.description = metadata.description
            }
            if (metadata.image) {
                model.image = metadata.image
            }
            if (metadata.name) {
                model.name = metadata.name
            }
        }


        return model
    }

    async #scanChannels() {
        const basePath = this.systemDomain
        const channels: PSChannelModel[] = []
        const files = fs.readdirSync(basePath)
        const articleService = new SystemArticleService(this.systemDomain)
        for (const file of files) {
            const fullPath = path.join(basePath, file)
            const model = await this.#parseChannelInfo(fullPath)
            if (model && model.uid && model.name) {
                channels.push(model)
                await articleService.syncArticlesInChannel(model.uid, fullPath)
            }
        }
        return channels
    }

    async runSync() {
        const channels = await this.#scanChannels()
        await this.#bulkInsertOrUpdateArticles(channels)
    }

    async #bulkInsertOrUpdateArticles(channelModels: PSChannelModel[]) {
        const db = await openMainDatabase()
        await db.exec('BEGIN TRANSACTION;')
        const stmt = await db.prepare(`INSERT 
            INTO notebooks (uid, name, description, image)
            VALUES ($uid, $name, $description, $image)
            ON CONFLICT(uid) DO UPDATE SET
                name = excluded.name, 
                description = excluded.description, 
                image = excluded.image
            WHERE notebooks.uid = excluded.uid;`)
        for (const model of channelModels) {
            if (!model.uid) {
                console.log("channel invalid", model.name)
                continue
            }
            await stmt.run({
                $uid: model.uid,
                $name: model.name,
                $description: model.description,
                $image: model.image,
            });
        }
        await stmt.finalize()
        await db.exec('COMMIT;')
    }


    async readAssets(channelUrn: string, fileUrn: string) {
        const channelPath = decodeBase64String(channelUrn)
        const assetsPath = decodeBase64String(fileUrn)
        const fullPath = path.join(this.systemDomain, channelPath, assetsPath)

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
}
