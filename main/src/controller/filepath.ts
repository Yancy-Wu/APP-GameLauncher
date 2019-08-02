import path from 'path';
import MetaInfo from './meta';
import CONFIG from '../config';
import * as Store from '../base/store';

export function md5SavedPath(meta: MetaInfo) {
    return path.join(Store.get(CONFIG.schema.gamePath), 'md5', meta.version);
}

export function clientSavedPath(meta: MetaInfo) {
    return path.join(Store.get(CONFIG.schema.installPath), meta.version + '.zip');
}

export function patchSavedPath(meta: MetaInfo) {
    return path.join(Store.get(CONFIG.schema.gamePath), 'patch', meta.version);
}