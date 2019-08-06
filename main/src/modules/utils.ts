import path from 'path';
import fs from 'fs';
import CONFIG from '../config';
import MetaInfo from './meta';
import md5Check from '../func-int/md5';
import unzip from '../func-ext/unzip';
import EXCEPTIONS from '../exceptions';
import * as Path from './filepath';
import * as Store from '../func-int/store';

export function checkExe(meta: MetaInfo, callback?: () => void) {
    return md5Check(Path.clientSavedPath(meta), meta.exeMd5, callback);
}

export function checkPatch(meta: MetaInfo, callback?: () => void) {
    return md5Check(Path.patchSavedPath(meta), meta.patchMd5, callback);
}

export function unzipClient(meta: MetaInfo, callback?: () => void) {
    return unzip(Path.clientSavedPath(meta), callback);
}

export function checkClient(meta: MetaInfo, callback?: () => void) {
    let stream = fs.createReadStream(Path.md5SavedPath(meta));
    let base = Store.get(CONFIG.schema.gamePath);
    stream.on('line', (line: string) => {
        let [rpath, md5] = line.split('\t');
        md5Check(path.join(base, rpath), md5);
    });
    stream.on('end', () => callback());
    stream.on('error', () => { throw new Error(EXCEPTIONS.unknow) });
}