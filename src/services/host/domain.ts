import {PSNoteFileModel, PSNoteModel} from "@/services/common/note";
import fs from "node:fs";
import path from "path";
import {CodeOk, decodeBase58String, emptySelectResult, PLSelectResult} from "@pnnh/atom";
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

    async hostSelectNotes(dirUrn: string): Promise<PLSelectResult<PSNoteFileModel>> {
        const files: PSNoteFileModel[] = []
        const decodedUri = decodeBase58String(dirUrn)
        if (!decodedUri.startsWith("file://")) {
            throw new Error('仅支持文件系统目录')
        }
        const fullDirPath = resolvePath(decodedUri)
        if (!fs.existsSync(fullDirPath)) {
            return emptySelectResult()
        }
        const entries = fs.readdirSync(fullDirPath)
        for (const entry of entries) {
            // skip hidden files/dirs
            if (entry.startsWith('.')) continue
            const fullEntryPath = path.join(fullDirPath, entry)
            const stat = fs.statSync(fullEntryPath)
            const entryUri = 'file://' + fullEntryPath

            if (stat.isDirectory()) {
                files.push({
                    title: entry,
                    path: entryUri,
                    is_dir: true,
                    is_text: false,
                    is_image: false,
                    storage_path: fullEntryPath,
                    full_repo_path: fullEntryPath,
                })
            } else if (entry.endsWith('.md') || entry.endsWith('.markdown')) {
                const title = path.basename(entry, path.extname(entry))
                files.push({
                    title,
                    path: entryUri,
                    is_dir: false,
                    is_text: true,
                    is_image: false,
                    storage_path: fullEntryPath,
                    full_repo_path: fullEntryPath,
                })
            }
        }
        return {
            code: CodeOk,
            message: '',
            data: {
                range: files,
                count: files.length,
                page: 1,
                size: files.length,
            },
        }
    }

    async hostReadNote(notePath: string): Promise<string> {
        const decodedUri = decodeBase58String(notePath)
        const fullPath = resolvePath(decodedUri)
        return fs.readFileSync(fullPath, 'utf-8')
    }

    async hostSaveNote(notePath: string, content: string): Promise<void> {
        const decodedUri = decodeBase58String(notePath)
        const fullPath = resolvePath(decodedUri)
        fs.writeFileSync(fullPath, content, 'utf-8')
    }

    hostStoreNote(note: PSNoteModel): Promise<void> {
        console.debug('hostStoreNote', note)
        return Promise.resolve()
    }
}

