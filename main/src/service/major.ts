import { ipcMain, Event } from 'electron';
import Install from '../controller/install';
import Update from '../controller/update';

let installTask: Install;
let updateTask: Update;

ipcMain.on('install', (event: Event) => {
    installTask = new Install(event.sender, 'install')
    installTask.run();
});

ipcMain.on('install.pause', () => {
    if(installTask) installTask.pause();
});

ipcMain.on('install.resume', () => {
    if(installTask) installTask.resume();
});

ipcMain.on('install.cancel', () => {
    if(installTask) installTask.cancel();
});

ipcMain.on('update', (event: Event) => {
    new Update(event.sender, 'update');
    updateTask.run();
});

ipcMain.on('update.pause', () => {
    if(updateTask) updateTask.pause();
});

ipcMain.on('update.resume', () => {
    if(updateTask) updateTask.resume();
});

ipcMain.on('update.cancel', () => {
    if(updateTask) updateTask.cancel();
});