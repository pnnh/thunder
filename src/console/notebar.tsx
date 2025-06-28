import {useEffect, useState} from 'react'
import {libraryAtom, noteAtom, notebookAtom} from './providers/notebook'
import React from 'react'
import './notebar.scss'
import {PLSelectResult} from "@/atom/common/models/protocol";
import {PSArticleModel} from "@/atom/common/models/article";
import {useAtom, useAtomValue} from "jotai";
import {clientSigninDomain} from "@/services/client/domain";

export function ConsoleNotebar() {
    const [notesResult, setNotesResult] = useState<PLSelectResult<PSArticleModel>>()
    const libraryState = useAtomValue(libraryAtom)
    const notebookState = useAtomValue(notebookAtom)
    useEffect(() => {
        if (!libraryState || !libraryState.current || !libraryState.current.urn || !notebookState ||
            !notebookState.current || !notebookState.current.urn) {
            return
        }
        const currentUrn = notebookState.current.urn
        clientSigninDomain().then(async (domain) => {
            const selectResult = await domain.selectNotes(currentUrn, currentUrn, '')
            setNotesResult(selectResult)
        })
        .then(selectResult => {
        })
    }, [notebookState])

    if (!notesResult || !notesResult.data.range || notesResult.data.range.length <= 0) {
        return <div>Empty</div>
    }
    return <div className={'noteList'}>
        {
            notesResult.data.range.map(item => {
                return <NoteCard key={item.uid} item={item}/>
            })
        }
    </div>
}

function NoteCard({item}: { item: PSArticleModel }) {
    const [note, setNote] = useAtom(noteAtom)

    return <div className={'noteCard'} onClick={() => {
        setNote({
            current: item
        })
    }}>
        <div className={'noteSelf'}>
            <div className={'noteName'}>
                {item.title}</div>
        </div>
    </div>
}
