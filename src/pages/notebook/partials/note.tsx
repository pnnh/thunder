import React from "react";
import {TocItem} from "@pnnh/atom";
import {BuildBodyHtml} from "@/pages/notebook/partials/body";

export function ArticleContainer({tocList, header, body, assetsUrl}: {
    tocList: Array<TocItem>, header: string, body: unknown,
    assetsUrl: string
}) {
    return (
        <BuildBodyHtml tocList={tocList} header={header} body={body}
                       assetsUrl={assetsUrl} libUrl={''}/>
    )
}

