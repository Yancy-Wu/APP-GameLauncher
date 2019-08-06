import crypto from 'crypto';
import fs from 'fs';
import EXCEPTIONS from '../exceptions';
import { Progress } from '../types';

export default function (filePath: string, md5: string, callback?: () => void): Progress {
    let info: Progress = {
        progress: 0,
        done: false
    }
    const size = fs.statSync(filePath).size;
    let md5sum = crypto.createHash('md5');
    let stream = fs.createReadStream(filePath);
    stream.on('data', (chunk: any) => {
        info.progress = (stream.bytesRead / size) * 100;
        md5sum.update(chunk);
    });
    stream.on('end', () => {
        const str = md5sum.digest('hex').toUpperCase();
        stream.close();
        if (str !== md5.toUpperCase()) throw new Error(EXCEPTIONS.md5CheckFailed);
        info.done = true;
        if (callback) callback();
    });
    stream.on('error', () => {
        stream.close();
        throw new Error(EXCEPTIONS.unknow);
    })
    return info;
}