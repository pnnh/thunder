import {openDatabase} from "@/services/client/database";
import {PSNoteModel} from "@/services/common/note";


interface DatabaseNoteItem {
    note: PSNoteModel;
    timestamp: number;
}

export async function storeNoteToDatabase(note: PSNoteModel) {
    const db = await openDatabase('notes', 1);
    const tx = db.transaction('keyVal', 'readwrite');
    const store = tx.objectStore('keyVal');

    const dbKey = 'note-' + note.uid;
    const nowValue = await store.get(dbKey) as DatabaseNoteItem;
    const nowDate = new Date();

    const newValue: DatabaseNoteItem = {
        note: note,
        timestamp: nowDate.getTime(),
    };
    await store.put(newValue, dbKey);
    await tx.done;
    if (nowValue) {
        if (nowValue.timestamp <= nowDate.getTime() - 1000) {
            // 每一秒向服务端同步一次文章状态
            await window.serverAPI.storeNote(note)
        }
    }
}
