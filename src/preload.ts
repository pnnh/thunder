import {contextBridge, ipcRenderer} from 'electron'
import {PSArticleModel} from "@/atom/common/models/article";

contextBridge.exposeInMainWorld('serverAPI', {
    getAppConfig: () => ipcRenderer.invoke('getAppConfig'),
    storeArticle: (article: PSArticleModel) => ipcRenderer.invoke('storeArticle', article),
    selectNotebooks: () => ipcRenderer.invoke('selectNotebooks'),
    selectLibraries: () => ipcRenderer.invoke('selectLibraries'),
    selectNotes: () => ipcRenderer.invoke('selectNotes'),
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
