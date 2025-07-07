import {IAppConfig} from "@/services/common/config";
import {PSArticleModel} from "@/atom/common/models/article";
import {PLSelectResult} from "@/atom/common/models/protocol";
import {PSNotebookModel} from "@/atom/common/models/personal/notebook";

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
