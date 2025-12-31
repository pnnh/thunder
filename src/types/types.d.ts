import {IAppConfig} from "@/services/common/config";
import {PSArticleModel} from "@/services/common/article";
import {PLSelectResult} from "@/services/common/protocol";
import {PSNotebookModel} from "@/services/common/notebook";

declare global {
    interface Window {
        serverAPI: {
            getAppConfig: () => Promise<IAppConfig>
            storeArticle: (article: PSArticleModel) => Promise<void>
            selectNotebooks: (string, string) => Promise<PLSelectResult<PSNotebookModel>>
            selectLibraries: () => Promise<PLSelectResult<PSLibraryModel>>
            selectNotes: (string, string, string) => Promise<PLSelectResult<PSArticleModel>>
            openExternal: (url: string) => Promise<void>
        }
    }
}
