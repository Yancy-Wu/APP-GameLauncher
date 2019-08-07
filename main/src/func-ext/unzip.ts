import child_process from 'child_process';
import path from 'path';
import caller from './caller';
import CONFIG from '../config';
import EXCEPTIONS from '../exceptions/define';
import { Progress } from '../types';

export default async function unzip(filePath: string, progress: Progress) {
    await caller(child_process.spawn(CONFIG.unzipBinPath, [
        'x', '-y', '-t7z', filePath,
        '-o' + path.dirname(filePath)]), EXCEPTIONS.unzipException, progress,
        (data: string) => {
            const str = data.toString();
            const progress = str.match(/[0-9]*\%$/g);
            return progress ? progress[0] : '';
        })
}