import fs from 'fs';
import MetaInfo from './meta';
import downloader from '../func-ext/download';
import CONFIG from '../config';
import { Progress } from '../types';
import * as Path from './filepath';

export function downloadMd5File(meta: MetaInfo): Progress {
    const remotePath = meta.version + '/' + meta.md5ListFileUrl;
    const localPath = Path.md5SavedPath(meta);
    return downloader(remotePath, localPath);
}

export function downloadClient(meta: MetaInfo): Progress {
    const remotePath = meta.version + '/' + meta.exeFileUrl;
    const localPath = Path.clientSavedPath(meta);
    return downloader(remotePath, localPath);
}

export function downloadPatch(meta: MetaInfo): Progress {
    const remotePath = meta.version + '/' + meta.patchFileUrl;
    const localPath = Path.patchSavedPath(meta);
    return downloader(remotePath, localPath);
}

let version2MetaInfo = new Map();
export function downloadMeta(version: string, callback: (meta: MetaInfo) => void) {
    const saved = version2MetaInfo.get(version);
    if (saved) callback(saved);
    const remotePath = version + '/' + CONFIG.remoteMetaPath;
    const localPath = Path.metaSavedPath(version);
    downloader(remotePath, localPath, () => {
        let meta = JSON.parse(fs.readFileSync(localPath).toString());
        callback(meta);
        version2MetaInfo.set(version, meta);
    });
}