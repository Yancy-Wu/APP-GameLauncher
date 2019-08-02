import child_process from 'child_process';
import path from 'path';
import { app } from 'electron';
import CONFIG from '../config';

const ERROR_UNKNOW = 1
const ERROR_LOCAL_FILE_EXIST = 2
const ERROR_CONNECT_FAILED = 3

export type DownloadInfo = {
    downloadedBytes: number,
    done: boolean,
};

export function download(url: string, savedPath: string, onDone?: () => void): DownloadInfo {
    let info: DownloadInfo = {
        downloadedBytes: 0,
        done: false
    }
    let downloader = child_process.spawn('python', [
        path.join(app.getAppPath(), '../server/ftp-download/main.py'),
        '-i', CONFIG.ftpProperty.host,
        '-r', url,
        '-l', savedPath]);
    downloader.stdout.on('data', (data: any) => {
        data = data.toString();
        data = JSON.parse(data);
        info.downloadedBytes = data['downloadedBytes'];
        info.done = data['done'] === 1;
    });
    downloader.on('close', (code: any) => {
        switch (code) {
            case 0: if (onDone) onDone(); break;
            case ERROR_LOCAL_FILE_EXIST:
                info.done = true;
                if (onDone) onDone(); break;
            default: throw new Error('DownloadFailed');
        }
    });
    return info;
}
