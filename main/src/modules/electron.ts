import { dialog, app } from 'electron';
import mainWindow from '../base/global';

export function openDirDialog(callback: (path: string | undefined) => void) {
    dialog.showOpenDialog(mainWindow, {
        defaultPath: app.getAppPath(),
        properties: ['openDirectory']
    }, (path: string[] | undefined) => callback(path ? path[0] : undefined));
}
