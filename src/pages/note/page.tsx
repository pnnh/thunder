import React, {useEffect, useState} from 'react'
import {encodeBase58String, PLSelectData} from "@pnnh/atom";
import {PSNoteFileModel} from "@/services/common/note";
import {RootLayout} from "@/pages/layout/layout";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {css} from "@emotion/css";

export function NotePage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [selectData, setSelectData] = useState<PLSelectData<PSNoteFileModel>>()
    const [loading, setLoading] = useState(true)

    const loc = searchParams.get('loc')

    useEffect(() => {
        if (!loc) return
        setLoading(true)
        window.serverAPI.selectNotes(loc).then(selectResult => {
            if (!selectResult || selectResult.code !== 200) {
                console.error('Failed to load directory listing')
                return
            }
            setSelectData(selectResult.data)
        }).catch(err => {
            console.error('Error loading notes:', err)
        }).finally(() => {
            setLoading(false)
        })
    }, [loc])

    if (!loc) {
        return <RootLayout><div className={msgStyle}>请先选择目录</div></RootLayout>
    }
    if (loading) {
        return <RootLayout><div className={msgStyle}>加载中...</div></RootLayout>
    }
    if (!selectData) {
        return <RootLayout><div className={msgStyle}>加载失败</div></RootLayout>
    }

    return <RootLayout>
        <div className={containerStyle}>
            {selectData.range.length === 0 && (
                <div className={msgStyle}>该目录下没有子目录或 Markdown 文件</div>
            )}
            {selectData.range.map((model, i) => {
                const encodedPath = encodeBase58String(model.path)
                return (
                    <div key={i} className={itemStyle}>
                        {model.is_dir ? (
                            <span
                                className={dirTitleStyle}
                                onClick={() => navigate(`/note?loc=${encodedPath}`)}
                            >
                                📁 {model.title}
                            </span>
                        ) : (
                            <>
                                <Link className={fileTitleStyle} to={`/note/view?path=${encodedPath}`}>
                                    📄 {model.title}
                                </Link>
                                <Link className={editLinkStyle} to={`/note/editor?path=${encodedPath}`}>
                                    编辑
                                </Link>
                            </>
                        )}
                    </div>
                )
            })}
        </div>
    </RootLayout>
}

const containerStyle = css`
    padding: 1rem 2rem;
    width: 100%;
    box-sizing: border-box;
`

const msgStyle = css`
    padding: 2rem;
    color: #666;
`

const itemStyle = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0.5rem;
    border-bottom: 1px solid #f0f0f0;
    &:hover {
        background: #fafafa;
    }
`

const dirTitleStyle = css`
    cursor: pointer;
    color: #333;
    font-size: 1rem;
    font-weight: 500;
    flex: 1;
    &:hover {
        color: #1976d2;
    }
`

const fileTitleStyle = css`
    flex: 1;
    color: #333;
    font-size: 1rem;
    text-decoration: none;
    &:hover {
        color: #1976d2;
        text-decoration: underline;
    }
`

const editLinkStyle = css`
    margin-left: 1rem;
    font-size: 0.875rem;
    color: #1976d2;
    text-decoration: none;
    padding: 0.2rem 0.6rem;
    border: 1px solid #1976d2;
    border-radius: 4px;
    flex-shrink: 0;
    &:hover {
        background: #1976d2;
        color: #fff;
    }
`
