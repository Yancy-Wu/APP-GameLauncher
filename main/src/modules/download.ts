import fs from 'fs';
import MetaInfo from '../base/meta';
import Downloader from '../func-ext/download';
import CONFIG from '../base/config';
import * as Path from './filepath';

export class Md5FileDownloader extends Downloader {
    constructor(meta: MetaInfo) {
        const remotePath = CONFIG.remoteDataPath + meta.version + '/' + meta.md5ListFileUrl;
        const localPath = Path.md5SavedPath(meta);
        super(remotePath, localPath);
    }
}

export class ClientDownloader extends Downloader {
    constructor(meta: MetaInfo) {
        const remotePath = CONFIG.remoteDataPath + meta.version + '/' + meta.exeFileUrl;
        const localPath = Path.clientSavedPath(meta);
        super(remotePath, localPath);
    }
}

export class PatchDownloader extends Downloader {
    constructor(meta: MetaInfo) {
        const remotePath = CONFIG.remoteDataPath + meta.version + '/' + meta.patchFileUrl;
        const localPath = Path.patchSavedPath(meta);
        super(remotePath, localPath);
    }
}

export async function downloadMeta(version: string) {
    const remotePath = CONFIG.remoteDataPath + version + '/' + CONFIG.remoteMetaPath;
    const localPath = Path.metaSavedPath(version);
    await new Downloader(remotePath, localPath).run();
    let meta = JSON.parse(fs.readFileSync(localPath).toString());
    return meta;
}