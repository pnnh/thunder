import {PSLibraryModel} from "@/atom/common/models/personal/library";
import {CodeOk, PLSelectResult} from "@/atom/common/models/protocol";
import {PSNotebookModel} from "@/atom/common/models/personal/notebook";
import {PSArticleModel} from "@/atom/common/models/article";


export interface IClientDomain {
    selectLibraries(): Promise<PLSelectResult<PSLibraryModel>>
    selectNotebooks(libraryUrn: string, queryString: string): Promise<PLSelectResult<PSNotebookModel>>
    selectNotes(libraryUrn: string, notebookUrn: string, queryString: string): Promise<PLSelectResult<PSArticleModel>>
}

class ClientDomain implements IClientDomain {
    selectNotes(libraryUrn: string, notebookUrn: string, queryString: string): Promise<PLSelectResult<PSArticleModel>> {
        throw new Error("Method not implemented.");
    }
    selectNotebooks(libraryUrn: string, queryString: string): Promise<PLSelectResult<PSNotebookModel>> {
        throw new Error("Method not implemented.");
    }
    async selectLibraries(): Promise<PLSelectResult<PSLibraryModel>> {
        //return await window.serverAPI.selectLibraries()
        const result: PLSelectResult<PSLibraryModel> = {
            code: CodeOk,
            message: 'success',
            data: {
                count: 0,
                range: [],
                page: 0,
                size: 0
            },
        }
        return result;

    }
}

export async function clientSigninDomain(): Promise<IClientDomain> {
    // const appConfig = await window.serverAPI.getAppConfig()
    return new ClientDomain()
}
