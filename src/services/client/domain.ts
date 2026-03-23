import {PLSelectResult} from "@pnnh/atom";
import {PSLibraryModel} from "@/services/common/library";
import {PSNoteModel} from "@/services/common/note";

export interface IClientDomain {
    selectLibraries(): Promise<PLSelectResult<PSLibraryModel>>

    selectNotes(libraryUrn: string, queryString: string): Promise<PLSelectResult<PSNoteModel>>

    selectNotes(noteUrn: string, queryString: string): Promise<PLSelectResult<PSNoteModel>>
}

class ClientDomain implements IClientDomain {
    async selectNotes(noteUrn: string, queryString: string): Promise<PLSelectResult<PSNoteModel>> {
        return await window.serverAPI.selectNotes(noteUrn, queryString)
    }

    async selectNotes(libraryUrn: string, queryString: string): Promise<PLSelectResult<PSNoteModel>> {
        return await window.serverAPI.selectNotes(libraryUrn, queryString)
    }

    async selectLibraries(): Promise<PLSelectResult<PSLibraryModel>> {
        return await window.serverAPI.selectLibraries()
    }
}

export async function clientSigninDomain(): Promise<IClientDomain> {
    // const appConfig = await window.serverAPI.getAppConfig()
    return new ClientDomain()
}
