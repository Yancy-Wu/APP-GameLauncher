import child_process from 'child_process';
import path from 'path';
import caller from './caller';
import CONFIG from '../config';
import EXCEPTIONS from '../exceptions/define';
import { Progress } from '../types';
import { app } from 'electron';

export default async function download(url: string, savedPath: string, progress: Progress) {
    await caller(child_process.spawn('python', [
        path.join(app.getAppPath(), CONFIG.downloaderBinPath),
        '-i', CONFIG.ftpProperty.host,
        '-r', url,
        '-l', savedPath]),
        EXCEPTIONS.downloadException, progress);
}
