import path from 'path';
import fs from 'fs';
import CONFIG from '../config';
import MetaInfo from './meta';
import * as Path from './filepath';
import * as Store from '../base/store';
import * as Utils from '../base/utils';

export function checkPatch(meta: MetaInfo, callback: (res: boolean) => void): void {
    Utils.md5Check(Path.patchSavedPath(meta), meta.patchMd5, callback);
}

export function unzipClient(meta: MetaInfo, callback: () => void) {
    Utils.unzip(Path.clientSavedPath(meta), callback);
}

export function checkClient(meta: MetaInfo, callback: (res: boolean) => void): void {
    let stream = fs.createReadStream(Path.md5SavedPath(meta));
    let base = Store.get(CONFIG.schema.gamePath);
    stream.on('line', (line: string) => {
        let [rpath, md5] = line.split('\t');
        Utils.md5Check(path.join(base, rpath), md5, res => {
            if (!res) {
                callback(false);
                stream.destroy();
            }
        });
    });
    stream.on('end', () => {
        callback(true);
    });
}