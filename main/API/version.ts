import ftp from 'ftp';
import path from 'path';
import fs from 'fs';
import * as ConfigAPI from './config';
import CONFIG from '../config';

function getFtpDirNames(callback: (dirNames: string[]) => void){
    let ftpClient = new ftp();
    ftpClient.on('ready', () => {
        ftpClient.list('/', (err: any, list : any[]) => {
            if (err) throw err;
            callback(list.map(v => v.name));
        });
    });
    ftpClient.connect(CONFIG.ftpProperty);
}

export function getCurrentVersion(callback: (version: string | undefined) => void) {
    const gamePath = ConfigAPI.get(ConfigAPI.SCHEMA.gamePath);
    let data: string | undefined = undefined;
    try{data = fs.readFileSync(gamePath + path.sep + 'version.txt').toString();}
    catch(err){data = undefined};
    callback(data);
}

export function getToUpdateVersions(callback: (versions: string[]) => void) {
    getCurrentVersion(version => {
        getFtpDirNames(dirNames => {
            dirNames.sort();
            callback(dirNames.slice(dirNames.indexOf(version!)));
        })
    })
}

export function getNewestClientVersion(callback: (version: string) => void) {
    getFtpDirNames(dirNames => {
        dirNames.sort();
        callback(dirNames[dirNames.length - 1]);
    })
}