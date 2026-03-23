import {contextBridge, ipcRenderer} from 'electron'
import {PSNoteModel} from "@/services/common/note";

contextBridge.exposeInMainWorld('serverAPI', {
    getAppConfig: () => ipcRenderer.invoke('getAppConfig'),
    storeNote: (note: PSNoteModel) => ipcRenderer.invoke('storeNote', note),
    selectNotes: () => ipcRenderer.invoke('selectNotes'),
    getNote: () => ipcRenderer.invoke('getNote'),
    openExternal: (url: string) => ipcRenderer.invoke('openExternal', url),
    openFolder: () => ipcRenderer.invoke('openFolder'),
})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type] ?? 'unknown')
    }
})
