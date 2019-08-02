import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import * as ConfigAPI from './store';

export function md5CheckFile(filePath: string, md5: string, callback: (res: boolean) => void): void {
    console.log(filePath);
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

export function md5CheckClient(md5FileListPath: string, callback: (res: boolean) => void): void {
    let stream = fs.createReadStream(md5FileListPath);
    let base = ConfigAPI.get(ConfigAPI.SCHEMA.gamePath);
    stream.on('line', (line : string) => {
        let [rpath, md5] = line.split('\t');
        md5CheckFile(path.join(base,rpath),md5, res => {
            if(!res){
                callback(false);
                stream.destroy();
            }
        });
    });
    stream.on('end', () => {
        callback(true);
    });
}