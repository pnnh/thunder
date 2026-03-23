import React, {useEffect, useState} from 'react'
import {css} from "@emotion/css";
import {RootLayout} from "@/pages/layout/layout";
import {useSearchParams} from "react-router-dom";
import Button from "@mui/material/Button";
import {BuildBodyHtml} from "@/pages/note/viewer/body";


export function MarkdownEditorPage() {
    const [searchParams] = useSearchParams()
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [savedTip, setSavedTip] = useState('')

    const encodedPath = searchParams.get('path')

    useEffect(() => {
        if (!encodedPath) return
        setLoading(true)
        window.serverAPI.readNote(encodedPath).then(text => {
            setContent(text)
        }).catch(err => {
            console.error('Failed to read note', err)
        }).finally(() => {
            setLoading(false)
        })
    }, [encodedPath])

    const handleSave = async () => {
        if (!encodedPath) return
        setSaving(true)
        setSavedTip('')
        try {
            await window.serverAPI.saveNote(encodedPath, content)
            setSavedTip('已保存')
            setTimeout(() => setSavedTip(''), 2000)
        } catch (err) {
            console.error('Failed to save note', err)
            setSavedTip('保存失败')
        } finally {
            setSaving(false)
        }
    }

    if (!encodedPath) {
        return <RootLayout><div className={msgStyle}>未指定文件路径</div></RootLayout>
    }
    if (loading) {
        return <RootLayout><div className={msgStyle}>加载中...</div></RootLayout>
    }

    return <RootLayout>
        <div className={editorPageStyle}>
            <div className={toolbarStyle}>
                <Button variant="contained" size="small" onClick={handleSave} disabled={saving}>
                    {saving ? '保存中...' : '保存'}
                </Button>
                {savedTip && <span className={tipStyle}>{savedTip}</span>}
            </div>
            <div className={editorAreaStyle}>
                <div className={editColStyle}>
                    <textarea
                        className={editTextStyle}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        spellCheck={false}
                    />
                </div>
                <div className={previewColStyle}>
                    <BuildBodyHtml header="markdown" body={content}/>
                </div>
            </div>
        </div>
    </RootLayout>
}

const msgStyle = css`
    padding: 2rem;
    color: #666;
`

const editorPageStyle = css`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
`

const toolbarStyle = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #e3e3e3;
    flex-shrink: 0;
`

const tipStyle = css`
    font-size: 0.875rem;
    color: #52c41a;
`

const editorAreaStyle = css`
    display: flex;
    flex-direction: row;
    flex: 1;
    overflow: hidden;
`

const editColStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e3e3e3;
    overflow: hidden;
`

const editTextStyle = css`
    flex: 1;
    border: 0;
    box-shadow: none;
    resize: none;
    outline: none;
    padding: 1rem;
    width: calc(100% - 2rem);
    height: 100%;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    scrollbar-width: thin;
    overflow-y: auto;
    box-sizing: border-box;
`

const previewColStyle = css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1rem 1.5rem;
    box-sizing: border-box;
    scrollbar-width: thin;
    line-height: 1.8;
`

