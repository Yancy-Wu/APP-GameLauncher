import { openDirDialog } from '../modules/electron';
import { ipcMain } from 'electron';

ipcMain.on('ui.openDirDialog', (event: Electron.Event) => {
    openDirDialog(path => {
        event.sender.send('ui.openDirDialog.reply', path);
    })
})