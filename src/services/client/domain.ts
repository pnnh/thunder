import {PLSelectResult} from "@pnnh/atom";
import {PSNoteModel} from "@/services/common/note";

export interface IClientDomain {
    selectNotes(noteUrn: string, queryString: string): Promise<PLSelectResult<PSNoteModel>>
}

class ClientDomain implements IClientDomain {
    async selectNotes(noteUrn: string, queryString: string): Promise<PLSelectResult<PSNoteModel>> {
        return await window.serverAPI.selectNotes(noteUrn, queryString)
    }
}

export async function clientSigninDomain(): Promise<IClientDomain> {
    // const appConfig = await window.serverAPI.getAppConfig()
    return new ClientDomain()
}
