import fs from 'fs';
import MetaInfo from './meta';
import downloader from '../func-ext/download';
import CONFIG from '../config';
import { Progress } from '../types';
import * as Path from './filepath';

export async function downloadMd5File(meta: MetaInfo, progress: Progress) {
    const remotePath = meta.version + '/' + meta.md5ListFileUrl;
    const localPath = Path.md5SavedPath(meta);
    await downloader(remotePath, localPath, progress);
}

export async function downloadClient(meta: MetaInfo, progress: Progress) {
    const remotePath = meta.version + '/' + meta.exeFileUrl;
    const localPath = Path.clientSavedPath(meta);
    await downloader(remotePath, localPath, progress);
}

export async function downloadPatch(meta: MetaInfo, progress: Progress) {
    const remotePath = meta.version + '/' + meta.patchFileUrl;
    const localPath = Path.patchSavedPath(meta);
    await downloader(remotePath, localPath, progress);
}

let version2MetaInfo = new Map();
export async function downloadMeta(version: string) {
    const saved = version2MetaInfo.get(version);
    if (saved) return saved;
    const remotePath = version + '/' + CONFIG.remoteMetaPath;
    const localPath = Path.metaSavedPath(version);
    await downloader(remotePath, localPath, {progress: 0, done: false});
    let meta = JSON.parse(fs.readFileSync(localPath).toString());
    version2MetaInfo.set(version, meta);
    return meta;
}