import {atom} from "jotai";
import {PSNoteModel} from "@/services/common/note";

const noteAtom = atom<{
    current: PSNoteModel | undefined,
}>({
    current: undefined,
})

export {noteAtom}
