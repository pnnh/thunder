
import fs from "node:fs";
import frontMatter from "front-matter";
import path from "path";
import {CodeOk, PLSelectResult} from "@/atom/common/models/protocol";
import {PSLibraryModel} from "@/photon/common/models/personal/library";
import {resolvePath} from "@/atom/server/filesystem/path";
import {uuidV7} from "@/atom/common/utils/uuid";

export class SystemLibraryService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = resolvePath(systemDomain)
    }

    async selectLibraries(): Promise<PLSelectResult<PSLibraryModel>> {
        const basePath = this.systemDomain
        const librarys: PSLibraryModel[] = []
        const files = fs.readdirSync(basePath)
        for (const file of files) {
            const stat = fs.statSync(path.join(basePath, file))
            if (stat.isDirectory() && file.endsWith('.notelibrary')) {
                const libraryName = path.basename(file, path.extname(file))
                const uniqueName = uuidV7()//encodeMD5Format(file)
                const model: PSLibraryModel = {
                    create_time: "", update_time: "",
                    uid: uniqueName,
                    name: libraryName,
                    description: '',
                    owner: '',
                    file_path: ""
                }
                const metadataFile = path.join(basePath, file, 'metadata.md')
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
                librarys.push(model)
            }
        }
        return {
            code: CodeOk,
            message: '',
            data: {
                range: librarys,
                count: librarys.length,
                page: 1,
                size: librarys.length
            }
        }
    }
}
