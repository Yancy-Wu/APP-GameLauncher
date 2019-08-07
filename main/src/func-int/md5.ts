import crypto from 'crypto';
import fs from 'fs';
import EXCEPTIONS from '../exceptions/define';
import { Progress } from '../types';

export default function (filePath: string, md5: string, progress: Progress): Promise<void> {
    return new Promise(resolve => {
        const size = fs.statSync(filePath).size;
        let md5sum = crypto.createHash('md5');
        let stream = fs.createReadStream(filePath);
        stream.on('data', (chunk: any) => {
            progress.progress = (stream.bytesRead / size) * 100;
            md5sum.update(chunk);
        });
        stream.on('end', () => {
            const str = md5sum.digest('hex').toUpperCase();
            stream.close();
            if (str !== md5.toUpperCase()) throw new Error(EXCEPTIONS.md5CheckFailed);
            progress.done = true;
            resolve();
        });
        stream.on('error', () => {
            stream.close();
            throw new Error(EXCEPTIONS.unknow);
        })
    });
}