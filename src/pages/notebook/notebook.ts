import {atom} from "jotai";
import {PSNotebookModel} from "@/services/common/notebook";
import {PSNoteModel} from "@/services/common/note";

const noteAtom = atom<{
    current: PSNoteModel | undefined,
}>({
    current: undefined,
})

const notebookAtom = atom<{
    models: PSNotebookModel[],
    current: PSNotebookModel | undefined,
}>({
    models: [],
    current: undefined,
})

export {noteAtom, notebookAtom}
