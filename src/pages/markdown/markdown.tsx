import * as React from 'react';
import Button from '@mui/material/Button';
import {css} from "@emotion/css";
import {transKey} from "@/services/locales/normal";
import {marked} from "marked";
import DOMPurify from 'dompurify';

export function MarkdownComponent({lang}: { lang: string }) {
    const [source, setSource] = React.useState('');
    const [output, setOutput] = React.useState('');


    const encodeMarkdown = () => {
        if (!source) {
            return;
        }
        const outHtml = markdownStringToHtml(source);
        setOutput(outHtml);
    }
    return <div className={markdownStyles.markdownComponent}>
        <h1>markdown</h1>
        <textarea className={markdownStyles.sourceText} placeholder={
            transKey(lang, "tools.markdown.inputPlaceholder")
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={markdownStyles.toolButtons}>
            <Button variant="contained" size={'small'} onClick={encodeMarkdown}>
                {transKey(lang, "tools.markdown.preview")}
            </Button>
        </div>
        <textarea className={markdownStyles.targetText} placeholder={
            transKey(lang, "tools.markdown.previewResult")
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}

export function markdownStringToHtml(markText: string) {
    const rawHtml = marked.parse(markText) as string;
    // use DOMPurify to sanitize the HTML to prevent XSS attacks
    return DOMPurify.sanitize(rawHtml);
}

const markdownStyles = {
    markdownComponent: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 16px;
        scrollbar-width: thin;
        overflow-y: auto;
        overflow-x: hidden;
        margin-bottom: 2rem;
    `,
    sourceText: css`
        width: 100%;
        height: 160px;
        padding: 8px;
        flex-shrink: 0;
        background: #FFFFFF;
        border: 1px solid #d3d3d3;
        border-radius: 8px;
    `,
    toolButtons: css`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 16px;
        flex-shrink: 0;
    `,
    targetText: css`
        width: 100%;
        height: 160px;
        padding: 8px;
        flex-shrink: 0;
        background: #FFFFFF;
        border: 1px solid #d3d3d3;
        border-radius: 8px;
    `,
    commentsClient: css`
        width: 548px;
    `
}
