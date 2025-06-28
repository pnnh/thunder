import React from 'react'
import {useEffect, useState} from 'react'
import {libraryAtom, notebookAtom} from "@/console/providers/notebook";
import './notebook.scss'
import {PSNotebookModel} from "@/atom/common/models/personal/notebook";
import {useAtom, useAtomValue} from "jotai";
import {clientSigninDomain} from "@/services/client/domain";

export function NotebookList() {
    const libraryState = useAtomValue(libraryAtom)
    const [notebookState, setNotebookState] = useAtom(notebookAtom)
    useEffect(() => {
        if (!libraryState.current || !libraryState.current.urn) {
            return
        }
        const urn = libraryState.current.urn
        clientSigninDomain().then(async domain => {
            const selectResult = await domain.selectNotebooks(urn,'')
            setNotebookState({
                models: selectResult.data.range,
                current: selectResult.data.range[0]
            })
        })
    }, [libraryState])

    if (!notebookState || !notebookState.models || notebookState.models.length <= 0) {
        return <div>Empty</div>
    }
    return <div className={'notebookContainer'}>
        <div className={'notebookList'}>
            {
                notebookState.models.map(item => {
                    return <NotebookCard key={item.urn} item={item}/>
                })
            }
        </div>
        <div className={'newNotebook'}>新增笔记本</div>
    </div>
}

function NotebookCard({item}: { item: PSNotebookModel }) {
    const [notebookState, setNotebookState] = useAtom(notebookAtom)
    return <div>
        <div className={'directorySelf'} onClick={() => {
            setNotebookState({
                models: notebookState.models,
                current: item
            })
        }}>
            <div className={'directoryName'}>
                {item.title}</div>
        </div>
    </div>
}
