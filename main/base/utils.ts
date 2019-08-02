import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const ERROR_UNKNOW = 1;
const ERROR_PERMISSION_DENY = 2;
const ERROR_NODISK = 3;
const ERROR_NOMEM = 4;

export function unzip(filePath: string, callback: () => void): void {
    let unzipper = child_process.spawn('../external/7z', [
        'x', '-y', filePath,
        '-o' + path.dirname(filePath)]);
    unzipper.on('close', (code: any) => {
        switch (code) {
            case 0: callback();
            default: throw new Error('UnzipFailed');
        }
    });
}

export function md5Check(filePath: string, md5: string, callback: (res: boolean) => void): void {
    let md5sum = crypto.createHash('md5');
    let stream = fs.createReadStream(filePath);
    stream.on('data', (chunk: any) => {
        md5sum.update(chunk);
    });
    stream.on('end', () => {
        let str = md5sum.digest('hex').toUpperCase();
        callback(str == md5.toUpperCase());
    });
}