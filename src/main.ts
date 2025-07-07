import {app, BrowserWindow, ipcMain, Menu, MenuItem} from 'electron';
import path from 'path';
import {serverGetAppConfig} from "@/services/server/config";
import {IpcHandler} from "@/services/server/handler";
import cron from "node-cron";
import {runSync} from "@/services/server/worker/sync";
import {initDatabase} from "@/services/server/worker/migration";

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 860,
        alwaysOnTop: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools({
            mode: 'bottom'
        });

        const menu = new Menu();
        menu.append(new MenuItem({
            label: 'Refresh',
            accelerator: 'CmdOrCtrl+R',
            click: () => mainWindow.reload()
        }));
        Menu.setApplicationMenu(menu);
    }
};

const ipcHandler = new IpcHandler()
app.on('ready', () => {
    ipcMain.handle('getAppConfig', serverGetAppConfig)
    ipcMain.handle('storeArticle', ipcHandler.serverStoreArticle)
    ipcMain.handle('selectNotebooks', ipcHandler.serverSelectNotebooks)
    ipcMain.handle('selectLibraries', ipcHandler.serverSelectLibraries)
    ipcMain.handle('selectNotes', ipcHandler.serverSelectNotes)
    ipcMain.handle('openExternal', ipcHandler.openExternalUrl);

    createWindow()
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// 每分钟执行一次文件系统到本地数据库的同步
if (!app.isPackaged) {
    initDatabase().then(() => {
        console.log("Database initialized successfully.");
        return runSync();
    }).then(() => {
        console.log("Initial sync completed successfully.");
    });

}
cron.schedule("* * * * *", async () => {
    console.log("running a task every minute");
    await runSync();
});
