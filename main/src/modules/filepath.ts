import path from 'path';
import os from 'os';
import MetaInfo from '../base/meta';
import CONFIG from '../base/config';
import * as Store from '../func-int/store';

export function md5SavedPath(meta: MetaInfo) {
    return path.join(Store.get(CONFIG.schema.gamePath), 'md5', meta.version);
}

export function clientSavedPath(meta: MetaInfo) {
    return path.join(Store.get(CONFIG.schema.installPath), meta.version + '.zip');
}

export function patchSavedPath(meta: MetaInfo) {
    return path.join(Store.get(CONFIG.schema.gamePath), 'patch', meta.version);
}

export function metaSavedPath(version: string) {
    return path.join(os.tmpdir(), version + '.meta.json');
}