'use client'

import React from 'react'
import {useAtom} from "jotai";
import {css} from '@emotion/css';
import {PSNoteModel} from "@/services/common/article";
import {storeArticleToDatabase} from "@/services/client/personal/notes";
import {noteAtom} from "@/pages/notebook/notebook";
import {ArticleContainer} from "@/pages/notebook/partials/note";

export function ArticleEditorArea() {
    const [selectedArticle, setSelectedArticle] = useAtom(noteAtom)
    if (!selectedArticle || !selectedArticle.current || !selectedArticle.current.body) {
        return <div>Loading</div>
    }
    const article = selectedArticle.current

    const changeArticle = (article: PSNoteModel) => {
        setSelectedArticle({
            current: article
        })
        storeArticleToDatabase(article).then(() => {
            console.log('ArticleStored', article.uid)
        })
    }

    return <div className={editorAreaStyle}>
        <div className={titleColStyle}>
            <input value={selectedArticle.current.title} onChange={(event) => {
                changeArticle({
                        ...selectedArticle.current!,
                        title: event.target.value
                    }
                )
            }}/>
        </div>
        <div className={editColStyle}>
            <textarea className={editTextStyle} value={article.body} onChange={(event) => {
                changeArticle({
                    ...selectedArticle.current!,
                    body: event.target.value
                })
            }}></textarea>
        </div>
        <div className={previewColStyle}>
            <ArticleContainer tocList={[]} header={article.header} body={article.body} assetsUrl={'xxx'}/>
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
