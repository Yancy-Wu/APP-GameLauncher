import path from 'path';
import fs from 'fs';
import CONFIG from '../config';
import MetaInfo from './meta';
import md5Check from '../func-int/md5';
import unzip from '../func-ext/unzip';
import EXCEPTIONS from '../exceptions/define';
import { Progress } from '../types';
import * as Path from './filepath';
import * as Store from '../func-int/store';

export async function checkExe(meta: MetaInfo, progress: Progress) {
    await md5Check(Path.clientSavedPath(meta), meta.exeMd5, progress);
}

export async function checkPatch(meta: MetaInfo, progress: Progress) {
    await md5Check(Path.patchSavedPath(meta), meta.patchMd5, progress);
}

export async function unzipClient(meta: MetaInfo, progress: Progress) {
    await unzip(Path.clientSavedPath(meta), progress);
}

export function checkClient(meta: MetaInfo, progress: Progress): Promise<void> {
    return new Promise(resolve => {
        let stream = fs.createReadStream(Path.md5SavedPath(meta));
        let base = Store.get(CONFIG.schema.gamePath);
        stream.on('line', async (line: string) => {
            let [rpath, md5] = line.split('\t');
            await md5Check(path.join(base, rpath), md5, progress);
        });
        stream.on('end', () => resolve());
        stream.on('error', () => { throw new Error(EXCEPTIONS.unknow) });
    });
}