
import {Database} from "sqlite";
import {encodeBase64String} from "@pnnh/atom";
import {openMainDatabase} from "@/services/server/database/database";
import {PSArticleModel} from "@/services/common/article";

export async function bulkInsertOrUpdateArticles(articles: PSArticleModel[]) {
    const db = await openMainDatabase()
    await db.exec('BEGIN TRANSACTION;')
    const stmt = await db.prepare(`INSERT 
            INTO notes (uid, title, header, body, create_time, update_time, creator, keywords, description, 
                cover, owner, channel, partition, path)
            VALUES ($uid, $title, $header, $body, $create_time, $update_time, $creator, $keywords, $description, 
                $cover, $owner, $channel, $partition, $path)
            ON CONFLICT(uid) DO UPDATE SET
                title = excluded.title,
                header = excluded.header,
                body = excluded.body,
                create_time = excluded.create_time,
                update_time = excluded.update_time,
                creator = excluded.creator,
                keywords = excluded.keywords,
                description = excluded.description,
                cover = excluded.cover,
                owner = excluded.owner,
                channel = excluded.channel,
                partition = excluded.partition,
                path = excluded.path
            WHERE notes.uid = excluded.uid;`)
    for (const article of articles) {
        const channelUrn = article.channel as string
        if (!article.uid || !article.title || !article.body) {
            console.log("article invalid", article.title)
            continue
        }
        await stmt.run({
            $uid: article.uid,
            $title: article.title,
            $header: article.header,
            $body: article.body,
            $create_time: article.create_time,
            $update_time: article.update_time,
            $creator: article.creator,
            $keywords: article.keywords,
            $description: article.description,
            $cover: article.cover,
            $owner: article.owner,
            $channel: channelUrn,
            $partition: article.partition,
        });
        await bulkInsertOrUpdateTags(db, channelUrn, article.uid, article.keywords)
    }
    await stmt.finalize()
    await db.exec('COMMIT;')
}


export async function bulkInsertOrUpdateTags(db: Database, channelUrn: string, articleUrn: string, tags: string) {
    const stmt = await db.prepare(`INSERT 
            INTO tags (uid, name, description, article, create_time, update_time, channel)
            VALUES ($uid, $name, $description, $article, $create_time, $update_time, $channel)
            ON CONFLICT(uid) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                article = excluded.article,
                update_time = excluded.update_time,
                channel = excluded.channel
            WHERE tags.uid = excluded.uid;`)
    const now = new Date().toISOString()
    const tagList = tags.trim().split(',')
    for (let tag of tagList) {
        tag = tag.trim()
        if (!tag) {
            continue
        }
        await stmt.run({
            $uid: encodeBase64String(tag),
            $name: tag,
            $description: '',
            $article: articleUrn,
            $create_time: now,
            $update_time: now,
            $channel: channelUrn
        });
    }
    await stmt.finalize()
}

