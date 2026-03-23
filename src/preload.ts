import {contextBridge, ipcRenderer} from 'electron'
import {PSNoteModel} from "@/services/common/note";

contextBridge.exposeInMainWorld('serverAPI', {
    getAppConfig: () => ipcRenderer.invoke('getAppConfig'),
    storeNote: (note: PSNoteModel) => ipcRenderer.invoke('storeNote', note),
    selectNotes: (dirPath: string) => ipcRenderer.invoke('selectNotes', dirPath),
    getNote: () => ipcRenderer.invoke('getNote'),
    readNote: (notePath: string) => ipcRenderer.invoke('readNote', notePath),
    saveNote: (notePath: string, content: string) => ipcRenderer.invoke('saveNote', notePath, content),
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
