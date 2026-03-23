'use client'

import React, {useEffect, useState} from 'react'
import {css} from '@emotion/css';
import {BuildBodyHtml} from "./body";
import {useSearchParams} from "react-router-dom";
import {RootLayout} from "@/pages/layout/layout";

export function ViewPage() {
    const [searchParams] = useSearchParams()
    const [content, setContent] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    const encodedPath = searchParams.get('path')

    useEffect(() => {
        if (!encodedPath) return
        setLoading(true)
        setError('')
        window.serverAPI.readNote(encodedPath).then(text => {
            setContent(text)
        }).catch(err => {
            console.error('Failed to read note', err)
            setError('文件加载失败')
        }).finally(() => {
            setLoading(false)
        })
    }, [encodedPath])

    if (!encodedPath) {
        return <RootLayout><div className={msgStyle}>未指定文件路径</div></RootLayout>
    }
    if (loading) {
        return <RootLayout><div className={msgStyle}>加载中...</div></RootLayout>
    }
    if (error) {
        return <RootLayout><div className={msgStyle}>{error}</div></RootLayout>
    }

    return <RootLayout>
        <div className={viewerAreaStyle}>
            <div className={previewStyle}>
                <BuildBodyHtml header="markdown" body={content}/>
            </div>
        </div>
    </RootLayout>
}

const msgStyle = css`
    padding: 2rem;
    color: #666;
`

const viewerAreaStyle = css`
    height: 100%;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
`

const previewStyle = css`
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1.5rem 2rem;
    box-sizing: border-box;
    scrollbar-width: thin;
    line-height: 1.8;
`
