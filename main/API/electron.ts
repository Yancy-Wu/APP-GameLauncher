import electron from 'electron';

const mainWindow: electron.BrowserWindow = (window as any).mainWindow

export function openDirDialog(callback: (path: string | undefined) => void) {
    electron.dialog.showOpenDialog(mainWindow, {
        defaultPath: electron.app.getAppPath(),
        properties: ['openDirectory']
    }, (path: string[]) => callback(path ? path[0] : undefined));
}

export function getAppPath(): string {
    return electron.app.getAppPath();
}
