import React from 'react'
import {isSupportedLanguage} from "@pnnh/atom";

import {css} from "@emotion/css";
import {RootLayout} from "@/pages/layout/layout";
import {MarkdownComponent} from "./markdown";
import {useParams} from "react-router";
import {defaultLanguage, getTargetLang} from "@/services/locales/language";
import {NotFoundPage} from "@/pages/status/notFound";


export function MarkdownEditorPage() {
    let {lang} = useParams();
    if (!lang) {
        lang = getTargetLang(navigator.language, defaultLanguage)
    } else if (!isSupportedLanguage(lang)) {
        return <NotFoundPage/>
    }
    return <RootLayout>
        <div className={pageStyles.markdownPage}>
            <h1 className={pageStyles.productTitle}>markdown</h1>
            <MarkdownComponent lang={lang}/>
        </div>
    </RootLayout>
}

const pageStyles = {
    markdownPage: css`
        width: 960px;
        margin: 0 auto;
    `,
    productTitle: css`
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    `,
    commentsClient: css`
        margin-top: 2rem;
    `
}
