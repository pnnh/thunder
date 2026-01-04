import {serverSigninDomain} from "@/services/server/domain";
import {shell} from 'electron';
import {PSArticleModel} from "@/services/common/article";

import {dialog} from 'electron';

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


    async openFolder(): Promise<string | null> {
        try {
            const result = await dialog.showOpenDialog({
                title: '选择文件夹', // 可选：自定义标题
                defaultPath: '/Users/yourname/Documents', // 可选：默认路径
                properties: ['openDirectory'] // 关键：允许选择文件夹
                // 如果需要多选：properties: ['openDirectory', 'multiSelections']
            });

            if (!result.canceled && result.filePaths.length > 0) {
                const folderPath = result.filePaths[0]; // 获取完整路径
                console.log('选中的文件夹路径：', folderPath);
                return folderPath; // 返回路径
            } else {
                console.log('用户取消了选择');
                return null;
            }
        } catch (err) {
            console.error('打开文件夹出错：', err);
            return null;
        }
    }
}
