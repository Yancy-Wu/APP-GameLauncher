import {mainWindow, electron} from './global';

export function openDirDialog(callback: (path: string | undefined) => void){
    electron.remote.dialog.showOpenDialog(mainWindow, {
        defaultPath: electron.remote.app.getAppPath(),
        properties: ['openDirectory']
    },(path: string[]) => callback(path ? path[0] : undefined));
}

export function getAppPath(): string{
    return electron.remote.app.getAppPath();
}
