import React from "react";
import DOMPurify from 'isomorphic-dompurify';
import Prism from 'prismjs';
import {markedHighlight} from 'marked-highlight';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-cmake'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import {Marked} from "marked"
import {transTodo} from "@/services/locales/normal";

const marked = new Marked(
    markedHighlight({
        emptyLangClass: '',
        langPrefix: 'language-',
        highlight(code, lang, info) {
            const grammar = Prism.languages[lang];
            if (grammar) {
                return Prism.highlight(code, grammar, lang);
            }
            // Fallback for unsupported languages
            return Prism.highlight(code, Prism.languages.plaintext, 'plaintext');
        }
    })
);

export function BuildBodyHtml({header, body}: {
    header: string,
    body: unknown,
}) {
    if (!body) return <></>
    if (header === 'markdown' && typeof body === 'string') {
        const parsedHtml = marked.parse(body) as string
        const cleanHtml = DOMPurify.sanitize(parsedHtml, {USE_PROFILES: {html: true}});
        return <div dangerouslySetInnerHTML={{__html: cleanHtml}}></div>
    }
    return <div className={'stele-viewer'}>
        {transTodo('无效格式')}
    </div>
}
