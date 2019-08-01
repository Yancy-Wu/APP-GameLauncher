import os from 'os';
import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import electron from 'electron';
import ClientMetaInfo from './meta';
import CONFIG from '../config';
import * as ConfigAPI from './config';

export type DownloadInfo = {
    savedPath: string,
    downloadedBytes: number,
    done: boolean,
};

const ERROR_LOCAL_FILE_EXIST = 2
//const ERROR_CONNECT_FAILED = 4

function download(url: string, savedPath: string, onDone?: () => void): DownloadInfo {
    let info: DownloadInfo = {
        savedPath: savedPath,
        downloadedBytes: 0,
        done: false
    }
    let downloader = child_process.spawn('python', [
        path.join(electron.app.getAppPath(), '../server/ftp-download/main.py'),
        '-i', CONFIG.ftpProperty.host,
        '-r', url,
        '-l', savedPath]);
    downloader.stdout.on('data', (data:any) => {
        data = data.toString();
        data = JSON.parse(data);
        info.downloadedBytes = data['downloadedBytes'];
        info.done = data['done'] === 1;
    });
    downloader.on('close', (code:any) => {
        switch(code){
            case 0: if (onDone) onDone();break;
            case ERROR_LOCAL_FILE_EXIST: 
                info.done = true;
                if (onDone) onDone();break;
            default: throw new Error('DownloadFailed');
        }
    });
    return info;
}

export function downloadMd5File(meta: ClientMetaInfo): DownloadInfo {
    const remotePath = meta.version + '/' + meta.md5ListFileUrl;
    const localPath = path.join(ConfigAPI.get(ConfigAPI.SCHEMA.gamePath), 'md5', meta.version);
    return download(remotePath, localPath);
}

export function downloadClient(meta: ClientMetaInfo): DownloadInfo {
    const remotePath = meta.version + '/' + meta.exeFileUrl;
    const localPath = path.join(ConfigAPI.get(ConfigAPI.SCHEMA.installPath), meta.version + '.zip');
    return download(remotePath, localPath);
}

export function downloadPatch(meta: ClientMetaInfo): DownloadInfo {
    const remotePath = meta.version + '/' + meta.patchFileUrl;
    const localPath = path.join(ConfigAPI.get(ConfigAPI.SCHEMA.gamePath), 'patch', meta.version);
    return download(remotePath, localPath);
}

export function downloadMeta(version: string, callback: (meta: ClientMetaInfo) => void): void {
    const remotePath = version + '/meta.json ';
    const localPath = path.join(os.tmpdir(), version + '.meta.json');
    download(remotePath, localPath, () => {
        callback(JSON.parse(fs.readFileSync(localPath).toString()));
    });
}
