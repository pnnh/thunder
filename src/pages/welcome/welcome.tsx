import * as React from "react";
import {css} from "@emotion/css";

import Button from "@mui/material/Button";
import {stringToBase58} from "@pnnh/atom";
import {RootLayout} from "@/pages/layout/layout";
import {Link} from "react-router-dom";

const styleWelcome = css`
    width: 640px;
    margin: 0 auto;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const styleTips = css`
    margin-top: 1rem;
    font-size: 1rem;
    color: #666;
`

const styleActions = css`
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
`


export function OpenToolbar() {
    return <div>
        <Button onClick={() => {
            window.serverAPI.openFolder().then((dir: string) => {
                console.log('打开的目录是', dir)
                if (!dir) {
                    return
                }
                const dirParam = stringToBase58(dir, 'base58')
                const targetUrl = `/host/storage/files?dir=${dirParam}`
                window.location.href = targetUrl
            })
        }}>打开本地目录</Button>
    </div>
}

export function WelcomePage() {
    return <RootLayout>
        <div className={styleWelcome}>
            <h1>欢迎使用</h1>
            <OpenToolbar/>
            <Link to="/note">笔记本页面</Link>
        </div>
    </RootLayout>
}

