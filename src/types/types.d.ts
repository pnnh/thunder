import {IAppConfig} from "@/services/common/config";
import {PSArticleModel} from "@/atom/common/models/article";

export {} // 该行不能去掉，否则会提示类型不存在

declare global {
    interface Window {
        serverAPI: {
            getAppConfig: () => Promise<IAppConfig>
            storeArticle: (article: PSArticleModel) => Promise<void>
        }
    }
}
