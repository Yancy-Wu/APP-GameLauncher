import os from 'os';
import path from 'path';
import fs from 'fs';
import { download } from '../base/download';

let version2MetaInfo: { [key: string]: any };

export default interface MetaInfo {
    clientSizeBytes: number,
    patchSizeBytes: number,
    patchMd5: string,
    patchFileUrl: string,
    exeSizeBytes: number,
    exeFileUrl: string,
    exeMd5: string,
    md5ListFileUrl: string
    version: string,
    exePath: string
}

export function downloadMeta(version: string, callback: (meta: MetaInfo) => void) {
    const saved = version2MetaInfo[version];
    if (saved) callback(saved);
    const remotePath = version + '/meta.json ';
    const localPath = path.join(os.tmpdir(), version + '.meta.json');
    download(remotePath, localPath, () => {
        let meta = JSON.parse(fs.readFileSync(localPath).toString());
        callback(meta);
        version2MetaInfo[version] = meta;
    });
}