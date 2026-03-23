import {HostDomain} from './domain'
import {dialog, shell} from 'electron';
import {PSNoteModel} from "@/services/common/note";

export class IpcHandler {

    async hostStoreNote(event: Electron.Event, note: PSNoteModel) {
        console.log('hostStoreNote', note)
        const domain = HostDomain.instance()
        await domain.hostStoreNote(note)
        return 'hostStoreNote'
    }

    async hostGetNote(event: Electron.Event) {
        const domain = HostDomain.instance()
        return await domain.getNote()
    }

    async hostSelectNotes(event: Electron.Event, dirUrn: string) {
        console.log('hostSelectNotes', dirUrn)
        const domain = HostDomain.instance()
        return await domain.hostSelectNotes(dirUrn)
    }

    async hostReadNote(event: Electron.Event, notePath: string): Promise<string> {
        console.log('hostReadNote', notePath)
        const domain = HostDomain.instance()
        return await domain.hostReadNote(notePath)
    }

    async hostSaveNote(event: Electron.Event, notePath: string, content: string): Promise<void> {
        console.log('hostSaveNote', notePath)
        const domain = HostDomain.instance()
        await domain.hostSaveNote(notePath, content)
    }

    async openExternalUrl(event: Electron.Event, url: string) {
        console.log('openExternalUrl', url)
        return await shell.openExternal(url)
    }

    async openFolder(): Promise<string | null> {
        try {
            const result = await dialog.showOpenDialog({
                title: '选择文件夹',
                defaultPath: '/Users/yourname/Documents',
                properties: ['openDirectory']
            });

            if (!result.canceled && result.filePaths.length > 0) {
                const folderPath = result.filePaths[0];
                console.log('选中的文件夹路径：', folderPath);
                return folderPath;
            } else {
                console.log('用户取消了选择');
                return null;
            }
        } catch (err) {
            console.error('打开文件夹出错：', err);
            return null;
        }
    }
}
