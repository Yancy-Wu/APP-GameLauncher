import MetaInfo from '../base/meta';
import * as Path from './filepath';
import Md5Check from '../func-int/md5';
import Unzipper from '../func-ext/unzip';

export class ExeChecker extends Md5Check{
    constructor(meta: MetaInfo){
        super(Path.clientSavedPath(meta), meta.exeMd5);
    }
}

export class PatchChecker extends Md5Check{
    constructor(meta: MetaInfo){
        super(Path.patchSavedPath(meta), meta.patchMd5);
    }
}

export class ClientUnzipper extends Unzipper{
    constructor(meta: MetaInfo){
        super(Path.clientSavedPath(meta));
    }
}

/*
export function checkClient(meta: MetaInfo, onInfo?: (info: Progress) => void): Promise<void> {
    return new Promise(resolve => {
        let stream = fs.createReadStream(Path.md5SavedPath(meta));
        let base = Store.get(CONFIG.schema.gamePath);
        stream.on('line', async (line: string) => {
            let [rpath, md5] = line.split('\t');
            await md5Check(path.join(base, rpath), md5, onInfo);
        });
        stream.on('end', () => resolve());
        stream.on('error', () => { throw new Error(EXCEPTIONS.unknow) });
    });
}
*/