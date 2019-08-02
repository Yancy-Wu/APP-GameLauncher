import crypto from 'crypto';
import fs from 'fs';

const ERROR_UNKNOW = 1;
const ERROR_PERMISSION_DENY = 2;

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