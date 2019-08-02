import { openDirDialog } from '../controller/electron';
import { ipcMain } from 'electron';

ipcMain.on('ui.openDirDialog', (event: Electron.Event) => {
    openDirDialog(path => {
        event.sender.send('ui.openDirDialog.reply', {
            type: 'info',
            path: path
        });
    })
})