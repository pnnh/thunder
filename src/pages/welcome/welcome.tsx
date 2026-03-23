import * as React from "react";
import {css} from "@emotion/css";

import Button from "@mui/material/Button";
import {encodeBase58String} from "@pnnh/atom";
import {RootLayout} from "@/pages/layout/layout";
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate()
    return <div>
        <Button onClick={() => {
            window.serverAPI.openFolder().then((dir: string) => {
                console.log('打开的目录是', dir)
                if (!dir) {
                    return
                }
                // Encode the directory as a file:// URI before base58-encoding
                const fileUri = 'file://' + dir
                const dirParam = encodeBase58String(fileUri)
                navigate(`/note?loc=${dirParam}`)
            })
        }}>打开本地目录</Button>
    </div>
}

export function WelcomePage() {
    return <RootLayout>
        <div className={styleWelcome}>
            <h1>欢迎使用</h1>
            <OpenToolbar/>
        </div>
    </RootLayout>
}

