import child_process from 'child_process';
import path from 'path';
import caller from './caller';
import CONFIG from '../config';
import EXCEPTIONS from '../exceptions/define';
import { app } from 'electron';
import { Progress } from '../types';

export default async function patch(dir: string, patchFilePath: string, progress: Progress) {
    await caller(child_process.spawn('python', [
        '-m', 'patch', '--patch',
        '-s', dir,
        '-f', patchFilePath],
        { cwd: path.join(app.getAppPath(), CONFIG.patchBinCwd) }),
        EXCEPTIONS.patchException, progress);
}
