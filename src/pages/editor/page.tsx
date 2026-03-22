import {isSupportedLanguage} from "@pnnh/atom";
import {useParams} from "react-router";
import {defaultLanguage, getTargetLang} from "@/services/locales/language";
import {NotFoundPage} from "@/pages/status/notFound";
import React from "react";
import {RootLayout} from "@/pages/layout/layout";
import {css} from "@emotion/css";
import {EditorComponent} from "@/pages/editor/editor";

const pageStyles = {
    editorPage: css`
        width: 960px;
        margin: 0 auto;
    `
}

export function EditorPage() {
    let {lang} = useParams();
    if (!lang) {
        lang = getTargetLang(navigator.language, defaultLanguage)
    } else if (!isSupportedLanguage(lang)) {
        return <NotFoundPage/>
    }
    return <RootLayout>
        <div className={pageStyles.editorPage}>
            <EditorComponent lang={lang}/>
        </div>
    </RootLayout>
}
