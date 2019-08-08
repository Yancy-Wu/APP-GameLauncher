import os from 'os';
import fs from 'fs';
import EXCEPTIONS from '../exceptions/define';
import MetaInfo from '../base/meta';

export async function clearMeta() {
    return new Promise(resolve => {
        let handled = 0;
        const tmpDir = os.tmpdir();
        fs.readdir(tmpDir, (err, files) => {
            if (err) throw new Error(EXCEPTIONS.unknow);
            files.forEach(name => {
                const res = name.match(/.*\.meta\.json$/g)
                if (res) fs.unlink(name, err => {
                    if (err) throw new Error(EXCEPTIONS.unknow);
                    handled++;
                    if (handled === files.length) resolve();
                });
            });
        })
    });
}

export async function clearClient(){}

export async function clearPatch(meta: MetaInfo){}