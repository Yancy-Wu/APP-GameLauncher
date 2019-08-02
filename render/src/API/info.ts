let ipcRender = (window as any).require('electron');

export function getAppPath(): string {
    return ipcRender.sendSync('info.getAppPath');
}

export function getCurrentVersion(): string {
    return ipcRender.sendSync('info.getCurrentVersion');
}

export function getInstallPath(): string {
    return ipcRender.sendSync('info.getInstallPath');
}

export function setInstallPath(path: string | undefined) {
    ipcRender.sendSync('info.setInstallPath', path);
}

export function getGamePath(): string {
    return ipcRender.sendSync('info.getGamePath');
}

export function setGamePath(path: string | undefined) {
    ipcRender.sendSync('info.setGamePath', path);
}