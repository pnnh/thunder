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
    async selectNotes(libraryUrn: string, notebookUrn: string, queryString: string): Promise<PLSelectResult<PSArticleModel>> {
        return await window.serverAPI.selectNotes(libraryUrn, notebookUrn, queryString)
    }
    async selectNotebooks(libraryUrn: string, queryString: string): Promise<PLSelectResult<PSNotebookModel>> {
        return await window.serverAPI.selectNotebooks(libraryUrn, queryString)
    }
    async selectLibraries(): Promise<PLSelectResult<PSLibraryModel>> {
        return await window.serverAPI.selectLibraries()
    }
}

export async function clientSigninDomain(): Promise<IClientDomain> {
    // const appConfig = await window.serverAPI.getAppConfig()
    return new ClientDomain()
}
