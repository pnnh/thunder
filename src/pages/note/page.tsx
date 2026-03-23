import React, {useState} from 'react'
import {encodeBase58String, PLSelectData} from "@pnnh/atom";
import {PSNoteModel} from "@/services/common/note";
import {RootLayout} from "@/pages/layout/layout";
import {Link} from "react-router-dom";

export function NotePage() {
    const [selectData, setSelectData] = useState<PLSelectData<PSNoteModel>>()
    window.serverAPI.selectNotes('aa', 'bb').then(selectResult => {
        if (!selectResult || selectResult.code !== 200) {
            throw new Error("host note")
        }
        setSelectData(selectResult.data);
    })
    if (!selectData) {
        return <div>Loading</div>
    }

    return <RootLayout>
        <div className={'notesContainer'}>
            {
                selectData.range.map((model, i) => {
                    const urn = encodeBase58String(model.path)
                    return <div key={i}>
                        <Link to={`/notes?book=${urn}`}>{model.uid}-{model.name}</Link>

                    </div>
                })
            }
        </div>
    </RootLayout>
}


