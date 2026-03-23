import {IAppConfig} from "@/services/common/config";
import {PSNoteModel} from "@/services/common/note";
import {PLSelectResult} from "@/services/common/protocol";

declare global {
    interface Window {
        serverAPI: {
            getAppConfig: () => Promise<IAppConfig>
            storeNote: (note: PSNoteModel) => Promise<void>
            selectNotes: (string, string) => Promise<PLSelectResult<PSNoteModel>>
            getNote: (string) => Promise<PSNoteModel>
            openExternal: (url: string) => Promise<void>
            openFolder: () => Promise<string>
        }
    }
}
