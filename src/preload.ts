import {contextBridge, ipcRenderer} from 'electron'
import {PSArticleModel} from "@/services/common/article";

contextBridge.exposeInMainWorld('serverAPI', {
    getAppConfig: () => ipcRenderer.invoke('getAppConfig'),
    storeArticle: (article: PSArticleModel) => ipcRenderer.invoke('storeArticle', article),
    selectNotebooks: () => ipcRenderer.invoke('selectNotebooks'),
    selectLibraries: () => ipcRenderer.invoke('selectLibraries'),
    selectNotes: () => ipcRenderer.invoke('selectNotes'),
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
