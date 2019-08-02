import MetaInfo from './meta';
import * as Path from './filepath';
import { DownloadInfo, download } from '../base/download';

export function downloadMd5File(meta: MetaInfo): DownloadInfo {
    const remotePath = meta.version + '/' + meta.md5ListFileUrl;
    const localPath = Path.md5SavedPath(meta);
    return download(remotePath, localPath);
}

export function downloadClient(meta: MetaInfo): DownloadInfo {
    const remotePath = meta.version + '/' + meta.exeFileUrl;
    const localPath = Path.clientSavedPath(meta);
    return download(remotePath, localPath);
}

export function downloadPatch(meta: MetaInfo): DownloadInfo {
    const remotePath = meta.version + '/' + meta.patchFileUrl;
    const localPath = Path.patchSavedPath(meta);
    return download(remotePath, localPath);
}
