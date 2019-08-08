import child_process from 'child_process';
import path from 'path';
import Caller from './caller';
import CONFIG from '../base/config';
import { EXIT_CODE_TO_EXCEPTION } from '../exceptions/define';
import { Progress } from '../base/task';
import { app } from 'electron';

export default class Downloader extends Caller {
    private url: string;
    private savedPath: string;
    public onInfo?: (info: Progress) => void;
    protected exceptions = EXIT_CODE_TO_EXCEPTION.downloadException;
    constructor(url: string, savedPath: string) {
        super();
        this.url = url;
        this.savedPath = savedPath;
    }
    protected createChild = () => child_process.spawn('python', [
        path.join(app.getAppPath(), CONFIG.downloaderBinPath),
        '-i', CONFIG.ftpProperty.host,
        '-r', this.url,
        '-l', this.savedPath]);
}
