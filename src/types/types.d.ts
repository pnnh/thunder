import {IAppConfig} from "@/services/common/config";
import {PSNoteModel, PSNoteFileModel} from "@/services/common/note";
import {PLSelectResult} from "@pnnh/atom";

declare global {
    interface Window {
        serverAPI: {
            getAppConfig: () => Promise<IAppConfig>
            storeNote: (note: PSNoteModel) => Promise<void>
            selectNotes: (dirPath: string) => Promise<PLSelectResult<PSNoteFileModel>>
            getNote: () => Promise<PSNoteModel>
            readNote: (notePath: string) => Promise<string>
            saveNote: (notePath: string, content: string) => Promise<void>
            openExternal: (url: string) => Promise<void>
            openFolder: () => Promise<string>
        }
    }
}
