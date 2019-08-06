import ErrorInfo from './error';

let ipcRender = (window as any).require('electron').ipcRenderer;

export interface InstallInfo {
    type: 'info',
    what: 'Indexing' | 'Connecting' | 'Downloading' | 'Verifying' | 'Installing' | 'Done',
    msg: string,
}

export interface IndexInfo extends InstallInfo{
    version: string
}

export interface InstallDownloadInfo extends InstallInfo {
    downloadedBytes: number
}

type Info = InstallInfo | IndexInfo | InstallDownloadInfo | ErrorInfo;

export function install(onInfo: (info: Info) => void) {
    ipcRender.send('install');
    ipcRender.on('install.reply', (_: any, args: any) => {
        onInfo(args);
    })
}