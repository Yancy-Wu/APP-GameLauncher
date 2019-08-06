import child_process from 'child_process';
import path from 'path';
import caller from './caller';
import CONFIG from '../config';
import EXCEPTIONS from '../exceptions';
import { app } from 'electron';

export default function (dir: string, patchFilePath: string, callback?: () => void) {
    return caller(child_process.spawn('python', [
        '-m', 'patch', '--patch',
        '-s', dir,
        '-f', patchFilePath],
        { cwd: path.join(app.getAppPath(), CONFIG.patchBinCwd) }),
        EXCEPTIONS.patchException, callback);
}
