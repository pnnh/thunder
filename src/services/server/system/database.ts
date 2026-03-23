import {Database} from "sqlite";
import {encodeBase64String} from "@pnnh/atom";
import {openMainDatabase} from "@/services/server/database/database";
import {PSNoteModel} from "@/services/common/note";

export async function bulkInsertOrUpdateNotes(notes: PSNoteModel[]) {
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
    for (const note of notes) {
        const channelUrn = note.channel as string
        if (!note.uid || !note.title || !note.body) {
            console.log("note invalid", note.title)
            continue
        }
        await stmt.run({
            $uid: note.uid,
            $title: note.title,
            $header: note.header,
            $body: note.body,
            $create_time: note.create_time,
            $update_time: note.update_time,
            $creator: note.creator,
            $keywords: note.keywords,
            $description: note.description,
            $cover: note.cover,
            $owner: note.owner,
            $channel: channelUrn,
            $partition: note.partition,
        });
        await bulkInsertOrUpdateTags(db, channelUrn, note.uid, note.keywords)
    }
    await stmt.finalize()
    await db.exec('COMMIT;')
}


export async function bulkInsertOrUpdateTags(db: Database, channelUrn: string, noteUrn: string, tags: string) {
    const stmt = await db.prepare(`INSERT 
            INTO tags (uid, name, description, note, create_time, update_time, channel)
            VALUES ($uid, $name, $description, $note, $create_time, $update_time, $channel)
            ON CONFLICT(uid) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                note = excluded.note,
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
            $note: noteUrn,
            $create_time: now,
            $update_time: now,
            $channel: channelUrn
        });
    }
    await stmt.finalize()
}

