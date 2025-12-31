
import fs from "node:fs";
import frontMatter from "front-matter";
import path from "path";
import {CodeOk, emptySelectResult, PLSelectResult} from "@pnnh/atom";
import {decodeBase64String, encodeBase64String} from "@pnnh/atom";
import {resolvePath} from "@pnnh/atom";
import {uuidV7} from "@pnnh/atom";
import {PSNotebookModel} from "@/services/common/notebook";

export class SystemNotebookService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = resolvePath(systemDomain)
    }

    async selectNotebooks(libraryUrn: string): Promise<PLSelectResult<PSNotebookModel>> {
        const basePath = this.systemDomain
        const notebooks: PSNotebookModel[] = []
        const libraryFileName = decodeBase64String(libraryUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName))) {
            return emptySelectResult()
        }
        const files = fs.readdirSync(path.join(basePath, libraryFileName))
        for (const file of files) {
            const stat = fs.statSync(path.join(basePath, libraryFileName, file))
            if (stat.isDirectory() && file.endsWith('.notebook')) {
                const notebookName = path.basename(file, path.extname(file))
                const notebookUniqueName = uuidV7()//encodeMD5Format(file)
                const model: PSNotebookModel = {
                    image: "",  profile: "",
                    create_time: "", update_time: "",
                    uid: notebookUniqueName,
                    name: notebookName,
                    description: '',
                    owner: ''
                }
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
                notebooks.push(model)
            }
        }
        return {
            code: CodeOk, message:'',
            data: {
                range: notebooks,
                count: notebooks.length,
                page: 1,
                size: notebooks.length
            }
        }
    }
}
