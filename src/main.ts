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

    // 开发时加载远程地址
    if (process.env.REMOTE_URL) {
        const uri = new URL(process.env.REMOTE_URL);
        uri.searchParams.append("todoHostKey", "electron-dev");
        const strUri = uri.toString();
        mainWindow.loadURL(strUri);
    } else if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools({
            mode: 'bottom'
        });

        const mainMenu = new Menu();
        mainMenu.append(new MenuItem({
            label: 'Refresh',
            accelerator: 'CmdOrCtrl+R',
            click: () => mainWindow.reload()
        }));
        // 创建“编辑”子菜单实例
        const editSubmenu = new Menu();

        // 添加“剪切”项
        editSubmenu.append(new MenuItem({ role: 'cut' }));  // Cmd/Ctrl + X

        // 添加分隔符
        editSubmenu.append(new MenuItem({ type: 'separator' }));

        // 添加“复制”项（关键：启用 DevTools 控制台复制到系统剪贴板）
        editSubmenu.append(new MenuItem({ role: 'copy' }));  // Cmd/Ctrl + C

        // 添加“粘贴”项
        editSubmenu.append(new MenuItem({ role: 'paste' }));  // Cmd/Ctrl + V

        // 可选：添加更多项，如全选
        editSubmenu.append(new MenuItem({ role: 'selectAll' }));

        // 创建“编辑”菜单项，并挂载子菜单
        const editMenuItem = new MenuItem({
            label: '编辑',  // 或 'Edit'，根据系统语言调整
            submenu: editSubmenu
        });

        // 将“编辑”项添加到主菜单
        mainMenu.append(editMenuItem);

        const fileSubmenu = new Menu();
        fileSubmenu.append(new MenuItem({ role: 'quit' }));
        mainMenu.append(new MenuItem({ label: '文件', submenu: fileSubmenu }));

        Menu.setApplicationMenu(mainMenu);
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
// if (!app.isPackaged) {
//     initDatabase().then(() => {
//         console.log("Database initialized successfully.");
//         return runSync();
//     }).then(() => {
//         console.log("Initial sync completed successfully.");
//     });
//
// }
// cron.schedule("* * * * *", async () => {
//     console.log("running a task every minute");
//     await runSync();
// });
