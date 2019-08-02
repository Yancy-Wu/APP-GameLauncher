import ErrorInfo from './error';

let ipcRender = (window as any).require('electron');

export interface UpdateInfo {
    type: 'info',
    what: 'Overall' | 'None' | 'Indexing' | 'Connecting' | 'Downloading' | 'Verifying' | 'Patching' | 'Done',
    msg: string,
    version: string
}

export interface OverallInfo extends UpdateInfo{
    what: 'Overall',
    newestVersion : string,
    version : '0.00'
}

export interface IndexInfo extends UpdateInfo{
    what: 'Indexing',
    version: string
}

export interface UpdateDownloadInfo extends UpdateInfo{
    downloadedBytes: number
}

type Info = UpdateInfo | IndexInfo | UpdateDownloadInfo | ErrorInfo;
export function update(onInfo: (info: Info) => void) {
    ipcRender.send('update');
    ipcRender.on('update-reply', (_: any, args: any) => {
        onInfo(args);
    })
}