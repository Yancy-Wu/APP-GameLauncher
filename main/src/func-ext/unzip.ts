import child_process from 'child_process';
import path from 'path';
import Caller from './caller';
import CONFIG from '../base/config';
import {EXIT_CODE_TO_EXCEPTION} from '../exceptions/define';
import { Progress } from '../base/task';

export default class Unzipper extends Caller {
    private filePath: string;
    public onInfo?: (info: Progress) => void;
    protected exceptions = EXIT_CODE_TO_EXCEPTION.unzipException;
    constructor(filePath: string) {
        super();
        this.filePath = filePath;
    }
    protected createChild = () => child_process.spawn(CONFIG.unzipBinPath, [
        'x', '-y', '-t7z', this.filePath,
        '-o' + path.dirname(this.filePath)])
    protected dataFilter = (data: any) => {
        const str = data.toString();
        const progress = str.match(/[0-9]*\%$/g);
        return progress ? { progress: progress[0] } : { progress: 0 };
    }
}
