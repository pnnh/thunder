import {serverSigninDomain} from "@/services/server/domain";
import {PSArticleModel} from "@/photon/common/models/article";
import {shell} from 'electron';

export class IpcHandler {

    async serverStoreArticle(event: Electron.Event, article: PSArticleModel) {
        console.log('serverStoreArticle', article)
        const domain = await serverSigninDomain()
        await domain.serverStoreArticle(article)
        return 'serverStoreArticle'
    }

    async serverSelectNotebooks(event: Electron.Event) {
        console.log('serverSelectNotebooks')
        const domain = await serverSigninDomain()
        return await domain.serverSelectNotebooks()
    }

    async serverSelectLibraries(event: Electron.Event) {
        console.log('serverSelectLibraries')
        const domain = await serverSigninDomain()
        return await domain.serverSelectLibraries()
    }

    async serverSelectNotes(event: Electron.Event) {
        console.log('serverSelectNotes')
        const domain = await serverSigninDomain()
        return await domain.serverSelectNotes()
    }

    async openExternalUrl(event: Electron.Event, url: string) {
        console.log('openExternalUrl', url)
        return await shell.openExternal(url)
    }
}
