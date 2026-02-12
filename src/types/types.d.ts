import {IAppConfig} from "@/services/common/config";
import {PSNoteModel} from "@/services/common/article";
import {PLSelectResult} from "@/services/common/protocol";
import {PSNotebookModel} from "@/services/common/notebook";

declare global {
    interface Window {
        serverAPI: {
            getAppConfig: () => Promise<IAppConfig>
            storeArticle: (article: PSNoteModel) => Promise<void>
            selectNotebooks: (string, string) => Promise<PLSelectResult<PSNotebookModel>>
            selectLibraries: () => Promise<PLSelectResult<PSLibraryModel>>
            selectNotes: (notebookUrn: string, queryString: string) => Promise<PLSelectResult<PSNoteModel>>
            getNote: (string) => Promise<PSNoteModel>
            openExternal: (url: string) => Promise<void>
            openFolder: () => Promise<string>
        }
    }
}
