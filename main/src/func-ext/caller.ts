import { ChildProcess } from 'child_process';
import { Progress } from '../types';

export default function (child: ChildProcess, exceptions: any, progress: Progress,
    dataFilter?: (data: any) => string): Promise<void> {
    return new Promise(resolve => {
        child.stdout.on('data', (info: any) => {
            info = info.toString();
            if (dataFilter) info = dataFilter(info);
            progress.progress = info;
        });
        child.on('close', (code: number) => {
            const exception = exceptions[code];
            if (exception) throw new Error(exception);
            else {
                progress.done = true;
                resolve();
            }
        });
    });
}