import React, {useState} from 'react'
import {PLSelectData, stringToBase58} from "@pnnh/atom";
import {css} from "@emotion/css";
import {PSNoteModel} from "@/services/common/note";
import {useSearchParams} from "react-router";

const containerStyles = {
    notesGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    `
}

export function NotesPage() {
    const [selectData, setSelectData] = useState<PLSelectData<PSNoteModel>>()
    const [searchParams, setSearchParams] = useSearchParams();
    const book = searchParams.get("book")
    if (!book) {
        throw new Error("No book found")
    }
    window.serverAPI.selectNotes(book, '').then(selectResult => {
        if (!selectResult || selectResult.code !== 200) {
            throw new Error("host notebook")
        }
        setSelectData(selectResult.data);
    })
    if (!selectData) {
        return <div>Loading...</div>;
    }

    return <>
        <div className={containerStyles.notesGrid}>
            {
                selectData.range.map((model, i) => {
                    return <NoteItemCard key={i} model={model}/>
                })
            }
        </div>
    </>
}

const cardStyles = {
    cardItem: css`
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #fafafa;
        transition: box-shadow 0.3s ease;
    `
}

function NoteItemCard({model}: { model: PSNoteModel }) {
    const uid = stringToBase58(model.uid, 'base58')
    return <div className={cardStyles.cardItem}>
        <div>
            <a href={`/editor?note=${uid}`}>{model.title}</a>
        </div>
    </div>
}
