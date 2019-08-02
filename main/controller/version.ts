import ftp from 'ftp';
import path from 'path';
import fs from 'fs';
import * as ConfigAPI from './store';
import CONFIG from '../config';

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