
import {PSArticleModel} from "@/atom/common/models/article";


export interface IServerDomain {
    serverStoreArticle(article: PSArticleModel):Promise<void>
}

class ServerDomain implements IServerDomain {
    serverStoreArticle(article: PSArticleModel): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export async function serverSigninDomain(): Promise<IServerDomain> {
    // const domain = await trySigninDomain(serverConfig.WORKER_URL)

    return new ServerDomain()
}
