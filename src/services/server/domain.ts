import {PSLibraryModel} from "@/services/common/library";
import {PSNoteModel} from "@/services/common/note";
import fs from "node:fs";
import path from "path";
import {CodeOk, decodeBase58String, emptySelectResult, PLSelectResult, uuidV7} from "@pnnh/atom";
import {fillNoteMetadata} from "@/services/server/system/note";
import {resolvePath} from "@pnnh/atom/nodejs";

class ServerDomain {

    getNote(): Promise<PSNoteModel> {
        const result = {
            title: "第一个笔记",
            header: "dfd",
            body: "fsdfds",
            create_time: "",
            update_time: "",
            creator: "",
            keywords: "fdsfds",
            description: "",
            cover: "",
            discover: 0,
            owner: "",
            channel: "",
            partition: "",
            path: "",
            uid: "",
            lang: '',
            channel_name: '',
            name: '',
            url: '',
            repo_url: '',
            full_repo_url: '',
            full_repo_path: '',
            coverUrl: ''
        }
        return Promise.resolve(result)
    }

    async serverSelectNotes(bookUrn: string): Promise<PLSelectResult<PSNoteModel>> {

        const notes: PSNoteModel[] = []
        const deBookUrn = decodeBase58String(bookUrn)
        if (!deBookUrn.startsWith("file://")) {
            throw new Error('仅支持文件系统目录')
        }
        const fullBookPath = resolvePath(deBookUrn)
        if (!fs.existsSync(fullBookPath)) {
            return emptySelectResult()
        }
        const files = fs.readdirSync(fullBookPath)
        for (const file of files) {
            const stat = fs.statSync(path.join(fullBookPath, file))
            if (stat.isDirectory() && file.endsWith('.note')) {
                const noteName = path.basename(file, path.extname(file))
                const noteUniqueName = uuidV7() //encodeMD5Format(file)
                let noteDirectoryFullPath = path.join(fullBookPath, file)
                const model: PSNoteModel = {
                    creator: "",
                    body: "",
                    channel: "",
                    cover: "",
                    discover: 0,
                    header: "markdown",
                    keywords: "",
                    partition: "",
                    path: `${deBookUrn}/${file}`,
                    title: noteName,
                    create_time: "", update_time: "",
                    uid: noteUniqueName,
                    description: '',
                    owner: '',
                    lang: '',
                    channel_name: '',
                    name: '',
                    url: '',
                    repo_url: '',
                    full_repo_url: '',
                    full_repo_path: '',
                    coverUrl: ''
                }
                await fillNoteMetadata(noteDirectoryFullPath, model)
                notes.push(model)
            }
        }
        return {
            code: CodeOk,
            message: '',
            data: {
                range: notes,
                count: notes.length,
                page: 1,
                size: notes.length
            }
        }

        // const rangeList: PSNoteModel[] = [
        //     {
        //         title: "第一个笔记",
        //         header: "dfd",
        //         body: "fsdfds",
        //         create_time: "",
        //         update_time: "",
        //         creator: "",
        //         keywords: "fdsfds",
        //         description: "",
        //         cover: "",
        //         discover: 0,
        //         owner: "",
        //         channel: "",
        //         partition: "",
        //         path: "",
        //         uid: "",
        //         lang: '',
        //         channel_name: '',
        //         name: '',
        //         url: '',
        //         repo_url: '',
        //         full_repo_url: '',
        //         full_repo_path: '',
        //         coverUrl: ''
        //     },
        //     {
        //         title: "第二个笔记",
        //         header: "dfd",
        //         body: "fsdfds",
        //         create_time: "",
        //         update_time: "",
        //         creator: "",
        //         keywords: "fdsfds",
        //         description: "",
        //         cover: "",
        //         discover: 0,
        //         owner: "",
        //         channel: "",
        //         partition: "",
        //         path: "",
        //         uid: "",
        //         lang: '',
        //         channel_name: '',
        //         name: '',
        //         url: '',
        //         repo_url: '',
        //         full_repo_url: '',
        //         full_repo_path: '',
        //         coverUrl: ''
        //     }
        // ]
        // const result: PLSelectResult<PSNoteModel> = {
        //     code: CodeOk,
        //     message: 'success',
        //     data: {
        //         count: rangeList.length,
        //         range: rangeList,
        //         page: 1,
        //         size: rangeList.length
        //     }
        // }
        // return Promise.resolve(result)
    }

    serverSelectLibraries(): Promise<PLSelectResult<PSLibraryModel>> {
        const lib1: PSLibraryModel = {
            uid: 'default',
            name: '默认库',
            description: '这是一个默认的个人库',
            create_time: "",
            update_time: "",
            owner: "",
            file_path: '',
            title: '',
            creator: '',
            header: '',
            image: '',
            lang: '',
            match: '',
            profile: ''
        }

        if (process.platform === 'win32') {
            console.log('当前操作系统是 Windows');
            lib1.file_path = 'E:\\Workspace\\blog'
        } else {
            console.log('当前操作系统是其他平台');
            lib1.file_path = '/home/user/workspace/blog'
        }
        const rangeList: PSLibraryModel[] = [lib1]
        const result: PLSelectResult<PSLibraryModel> = {
            code: CodeOk,
            message: 'success',
            data: {
                count: rangeList.length,
                range: rangeList,
                page: 1,
                size: rangeList.length
            }
        }
        return Promise.resolve(result)
    }

    serverStoreNote(note: PSNoteModel): Promise<void> {
        console.debug('serverStoreNote', note)
        return Promise.resolve()
    }
}

export async function serverSigninDomain(): Promise<ServerDomain> {
    // const domain = await trySigninDomain(serverConfig.WORKER_URL)

    return new ServerDomain()
}
