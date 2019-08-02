import path from 'path';
import fs from 'fs';
import { getDirs } from '../base/ftp';
import CONFIG from '../config';
import * as Store from '../base/store';

export function getCurrentVersion(): string | undefined {
    const gamePath = Store.get(CONFIG.schema.gamePath);
    let data: string | undefined = undefined;
    try { data = fs.readFileSync(gamePath + path.sep + 'version.txt').toString(); }
    catch (err) { data = undefined };
    return data;
}

export function getToUpdateVersions(callback: (versions: string[]) => void) {
    const version = getCurrentVersion();
    getDirs(dirNames => {
        dirNames.sort();
        callback(dirNames.slice(dirNames.indexOf(version!)));
    })
}

export function getNewestClientVersion(callback: (version: string) => void) {
    getDirs(dirNames => {
        dirNames.sort();
        callback(dirNames[dirNames.length - 1]);
    })
}