import {PSNoteModel} from "@/services/common/note";
import fs from "node:fs";
import path from "path";
import {CodeOk, decodeBase58String, emptySelectResult, PLSelectResult, uuidV7} from "@pnnh/atom";
import {fillNoteMetadata} from "@/services/host/system/note";
import {resolvePath} from "@pnnh/atom/nodejs";

export class HostDomain {
    static instance(): HostDomain {
        return new HostDomain();
    }

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

    async hostSelectNotes(bookUrn: string): Promise<PLSelectResult<PSNoteModel>> {

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

    hostStoreNote(note: PSNoteModel): Promise<void> {
        console.debug('hostStoreNote', note)
        return Promise.resolve()
    }
}

