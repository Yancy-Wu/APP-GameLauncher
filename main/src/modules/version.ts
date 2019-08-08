import path from 'path';
import fs from 'fs';
import CONFIG from '../base/config';
import listFtpDirs from '../func-int/ftp';
import * as Store from '../func-int/store';

export function getCurrentVersion(): string | undefined {
    const gamePath = Store.get(CONFIG.schema.gamePath);
    let data: string | undefined = undefined;
    try { data = fs.readFileSync(gamePath + path.sep + 'version.txt').toString(); }
    catch (err) { data = undefined };
    return data;
}

export async function getToUpdateVersions() {
    const version = getCurrentVersion();
    let dirNames = await listFtpDirs(CONFIG.remoteDataPath);
    dirNames.sort();
    return dirNames.slice(dirNames.indexOf(version!) + 1);
}

export async function getNewestClientVersion() {
    let dirNames = await listFtpDirs(CONFIG.remoteDataPath);
    dirNames.sort();
    return dirNames[dirNames.length - 1];
}