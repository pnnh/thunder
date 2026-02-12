import React, {useState} from 'react'
import {css} from "@emotion/css";
import {PSNoteModel} from "@/services/common/note";

const pageStyles = {
    notesContainer: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `
}

export function NoteEditorPage() {
    const [model, setModel] = useState<PSNoteModel>()
    window.serverAPI.getNote('').then(data => {
        setModel(data)
    })

    if (!model) {
        return <div>Loading...</div>
    }

    return <>
        <div className={pageStyles.notesContainer}>
            <div>{model.title}</div>
            <div>
                {model.body}
            </div>
        </div>
    </>
}


