import { getCurrentVersion } from '../controller/version';
import { ipcMain, Event, app } from 'electron';
import CONFIG from '../config';
import * as Store from '../base/store';

ipcMain.on('info.getAppPath', (event: Event) => {
    event.returnValue = app.getAppPath();
})

ipcMain.on('info.getCurrentVersion', (event: Event) => {
    event.returnValue = getCurrentVersion();
})

ipcMain.on('info.getInstallPath', (event: Event) => {
    event.returnValue = Store.get(CONFIG.schema.gamePath);
})

ipcMain.on('info.setInstallPath', (event: Event, path: string) => {
    event.returnValue = Store.set(CONFIG.schema.installPath, path);
})

ipcMain.on('info.getGamePath', (event: Event) => {
    event.returnValue = Store.get(CONFIG.schema.gamePath);
})

ipcMain.on('info.setGamePath', (event: Event, path: string) => {
    event.returnValue = Store.set(CONFIG.schema.gamePath, path);
})