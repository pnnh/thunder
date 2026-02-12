import {openDatabase} from "@/services/client/database";
import {PSNoteModel} from "@/services/common/note";


interface DatabaseArticleItem {
    article: PSNoteModel;
    timestamp: number;
}

export async function storeArticleToDatabase(article: PSNoteModel) {
    const db = await openDatabase('articles', 1);
    const tx = db.transaction('keyVal', 'readwrite');
    const store = tx.objectStore('keyVal');

    const dbKey = 'article-' + article.uid;
    const nowValue = await store.get(dbKey) as DatabaseArticleItem;
    const nowDate = new Date();

    const newValue: DatabaseArticleItem = {
        article: article,
        timestamp: nowDate.getTime(),
    };
    await store.put(newValue, dbKey);
    await tx.done;
    if (nowValue) {
        if (nowValue.timestamp <= nowDate.getTime() - 1000) {
            // 每一秒向服务端同步一次文章状态
            await window.serverAPI.storeArticle(article)
        }
    }
}
