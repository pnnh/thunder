

import {CodeOk, PLSelectResult} from "@pnnh/atom";
import {selectNotebooksFromDatabase} from "@/services/server/database/notebook";
import {PSArticleModel} from "@/services/common/article";
import {PSLibraryModel} from "@/services/common/library";
import {PSNotebookModel} from "@/services/common/notebook";

class ServerDomain {
    serverSelectNotes(): Promise<PLSelectResult<PSArticleModel>> {
        const rangeList: PSArticleModel[] = [
            {
                title: "xxxzcxzsa",
                header: "dfd",
                body: "fsdfds",
                create_time: "",
                update_time: "",
                creator: "",
                keywords: "fdsfds",
                description: "",
                cover: "",
                discover: 0,
                owner: "",
                channel: "",
                partition: "",
                path: "",
                uid: "",
                lang: '',
                channel_name: '',
                name: '',
                url: '',
                repo_url: '',
                full_repo_url: '',
                full_repo_path: '',
                coverUrl:''
            }
        ]
        const result: PLSelectResult<PSArticleModel> = {
            code: CodeOk,
            message: 'success',
            data: {
                count: rangeList.length,
                range: rangeList,
                page: 1,
                size: rangeList.length
            }
        }
        return Promise.resolve(result)
    }
    serverSelectLibraries(): Promise<PLSelectResult<PSLibraryModel>> {
        const lib1:PSLibraryModel = {
            uid: 'default',
            name: '默认库',
            description: '这是一个默认的个人库',
            create_time: "",
            update_time: "",
            owner: "",
            file_path: '',
            title: '',
            creator: '',
            header: '',
            image: '',
            lang: '',
            match: '',
            profile: ''
        }

        if (process.platform === 'win32') {
            console.log('当前操作系统是 Windows');
            lib1.file_path = 'E:\\Workspace\\blog'
        } else {
            console.log('当前操作系统是其他平台');
            lib1.file_path = '/home/user/workspace/blog'
        }
        const rangeList: PSLibraryModel[] = [lib1]
        const result: PLSelectResult<PSLibraryModel> = {
            code: CodeOk,
            message: 'success',
            data: {
                count: rangeList.length,
                range: rangeList,
                page: 1,
                size: rangeList.length
            }
        }
        return Promise.resolve(result)
    }
    async serverSelectNotebooks(): Promise<PLSelectResult<PSNotebookModel>> {
        return await selectNotebooksFromDatabase(1, 999)
        // const rangeList: PSNotebookModel[] = [
        //     {
        //         uid: 'default',
        //         name: '默认笔记本',
        //         description: '这是一个默认的笔记本',
        //         title: "xxxx3432423",
        //         create_time: "",
        //         update_time: "",
        //         image: "",
        //         profile: "",
        //         owner: "",
        //     }
        // ]
        // const result: PLSelectResult<PSNotebookModel> = {
        //     code: CodeOk,
        //     message: 'success',
        //     data: {
        //         count: rangeList.length,
        //         range: rangeList,
        //         page: 1,
        //         size: rangeList.length
        //     }
        // }
        // return Promise.resolve(result)
    }
    serverStoreArticle(article: PSArticleModel): Promise<void> {
        //throw new Error("Method not implemented.");
        console.debug('serverStoreArticle', article)
        return Promise.resolve()
    }
}

export async function serverSigninDomain(): Promise<ServerDomain> {
    // const domain = await trySigninDomain(serverConfig.WORKER_URL)

    return new ServerDomain()
}
