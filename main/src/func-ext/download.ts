import child_process from 'child_process';
import path from 'path';
import caller from './caller';
import CONFIG from '../config';
import EXCEPTIONS from '../exceptions';
import { app } from 'electron';

export default function (url: string, savedPath: string, callback?: () => void) {
    return caller(child_process.spawn('python', [
        path.join(app.getAppPath(), CONFIG.downloaderBinPath),
        '-i', CONFIG.ftpProperty.host,
        '-r', url,
        '-l', savedPath]),
        EXCEPTIONS.downloadException, callback);
}
