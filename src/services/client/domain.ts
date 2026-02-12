import {PLSelectResult} from "@pnnh/atom";
import {PSLibraryModel} from "@/services/common/library";
import {PSNotebookModel} from "@/services/common/notebook";
import {PSNoteModel} from "@/services/common/note";

export interface IClientDomain {
    selectLibraries(): Promise<PLSelectResult<PSLibraryModel>>

    selectNotebooks(libraryUrn: string, queryString: string): Promise<PLSelectResult<PSNotebookModel>>

    selectNotes(notebookUrn: string, queryString: string): Promise<PLSelectResult<PSNoteModel>>
}

class ClientDomain implements IClientDomain {
    async selectNotes(notebookUrn: string, queryString: string): Promise<PLSelectResult<PSNoteModel>> {
        return await window.serverAPI.selectNotes(notebookUrn, queryString)
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
