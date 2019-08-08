import child_process from 'child_process';
import path from 'path';
import Caller from './caller';
import CONFIG from '../base/config';
import {EXIT_CODE_TO_EXCEPTION} from '../exceptions/define';
import { Progress } from '../base/task';
import { app } from 'electron';

export default class Patcher extends Caller {
    private dir: string;
    private patchFilePath: string;
    public onInfo?: (info: Progress) => void;
    protected exceptions = EXIT_CODE_TO_EXCEPTION.patchException;
    constructor(dir: string, patchFilePath: string) {
        super();
        this.dir = dir;
        this.patchFilePath = patchFilePath;
    }
    protected createChild = () => child_process.spawn('python', [
        '-m', 'patch', '--patch',
        '-s', this.dir,
        '-f', this.patchFilePath],
        { cwd: path.join(app.getAppPath(), CONFIG.patchBinCwd) })
}
