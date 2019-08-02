import os from 'os';
import path from 'path';
import fs from 'fs';
import ClientMetaInfo from './meta';
import {DownloadInfo, download} from '../base/download';
import * as ConfigAPI from './store';

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
