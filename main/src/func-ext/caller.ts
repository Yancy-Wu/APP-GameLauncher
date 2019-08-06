import { ChildProcess } from 'child_process';
import { Progress } from '../types';

export default function (child: ChildProcess, exceptions: any,
    callback?: () => void, dataFilter?: (data: any) => string): Progress {
    let info: Progress = {
        progress: 0,
        done: false
    }
    child.stdout.on('data', (progress: any) => {
        progress = progress.toString();
        if (dataFilter) progress = dataFilter(progress);
        info.progress = progress;
    });
    child.on('close', (code: number) => {
        const exception = exceptions[code];
        if (exception) throw new Error(exception);
        else {
            info.done = true;
            if(callback) callback();
        }
    });
    return info;
}