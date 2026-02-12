import fs from "node:fs";
import path from "path";
import {decodeBase64String} from "@pnnh/atom";
import {resolvePath} from "@pnnh/atom/nodejs";
import {PSNoteModel} from "@/services/common/note";

export class SystemNoteService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = resolvePath(systemDomain)
    }

    async updateNote(libraryUrn: string, notebookUrn: string, noteUrn: string,
                     article: PSNoteModel): Promise<void> {
        console.log('执行笔记文件保存操作', article)
        const basePath = this.systemDomain
        const libraryFileName = decodeBase64String(libraryUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName))) {
            return
        }
        const notebookFileName = decodeBase64String(notebookUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName, notebookFileName))) {
            return
        }
        const noteFileName = decodeBase64String(noteUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName, notebookFileName, noteFileName))) {
            return
        }

    }
}
