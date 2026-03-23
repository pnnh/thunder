'use client'

import React from 'react'
import {useAtom} from "jotai";
import {css} from '@emotion/css';
import {storeNoteToDatabase} from "@/services/client/notes";
import {noteAtom} from "@/pages/note/note";
import {PSNoteModel} from "@/services/common/note";
import {BuildBodyHtml} from "./body";

export function ViewPage() {
    const [selectedNote, setSelectedNote] = useAtom(noteAtom)
    if (!selectedNote || !selectedNote.current || !selectedNote.current.body) {
        return <div>Loading</div>
    }
    const note = selectedNote.current

    const changeNote = (note: PSNoteModel) => {
        setSelectedNote({
            current: note
        })
        storeNoteToDatabase(note).then(() => {
            console.log('NoteStored', note.uid)
        })
    }

    return <div className={editorAreaStyle}>
        <div className={titleColStyle}>
            <input value={selectedNote.current.title} onChange={(event) => {
                changeNote({
                        ...selectedNote.current!,
                        title: event.target.value
                    }
                )
            }}/>
        </div>
        <div className={editColStyle}>
            <textarea className={editTextStyle} value={note.body} onChange={(event) => {
                changeNote({
                    ...selectedNote.current!,
                    body: event.target.value
                })
            }}></textarea>
        </div>
        <div className={previewColStyle}>
            <BuildBodyHtml header={note.header} body={note.body}/>
        </div>
    </div>
}

const editorAreaStyle = css`
    height: 100%;
`;

const titleColStyle = css`
    height: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: solid 1px #e3e3e3;

    input {
        margin-left: 1rem;
        width: 98%;
        outline: none;
        border: 0;
        font-size: 1.5rem;
        font-weight: 400;
    }
`;

const editColStyle = css`
    height: calc(60% - 3rem);
    border-left: solid 1px #e3e3e3;
`;

const editTextStyle = css`
    border: 0;
    box-shadow: none;
    resize: none;
    outline: none !important;
    overflow-x: hidden;
    padding: 1rem;
    width: calc(100% - 2rem);
    height: calc(100% - 2rem);
    scrollbar-width: thin;
    overflow-y: auto;
    border-bottom: solid 1px #e3e3e3;
`;

const previewColStyle = css`
    height: 40%;
    overflow-y: scroll;
    overflow-x: hidden;
    box-sizing: border-box;
    scrollbar-width: thin;
    padding: 1rem;
`;
