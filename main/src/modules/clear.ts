import os from 'os';
import fs from 'fs';
import EXCEPTIONS from '../exceptions';

export function clearMeta(callback: () => void) {
    let handled = 0;
    const tmpDir = os.tmpdir();
    fs.readdir(tmpDir, (err, files) => {
        if (err) throw new Error(EXCEPTIONS.unknow);
        files.forEach(name => {
            const res = name.match(/.*\.meta\.json$/g)
            if (res) fs.unlink(name, err => {
                if (err) throw new Error(EXCEPTIONS.unknow);
                handled++;
                if (handled === files.length) callback();
            });
        });
    })
}