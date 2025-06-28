import {serverSigninDomain} from "@/services/server/domain";
import {PSArticleModel} from "@/atom/common/models/article";

export async function serverStoreArticle(event: Electron.Event, article: PSArticleModel) {
    console.log('serverStoreArticle', article)
    const domain = await serverSigninDomain()
    await domain.serverStoreArticle(article)
    return 'serverStoreArticle'
}