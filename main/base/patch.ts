import child_process from 'child_process';

const ERROR_UNKNOW = 1;
const ERROR_FILE_EXIST = 2;
const ERROR_NODISK = 3;
const ERROR_NOMEM = 4;

export function patch(dir: string, patchFilePath: string, callback: () => void): void {
    let patcher = child_process.spawn('python', [
        '-m', 'patch', '--patch',
        '-r', dir,
        '-f', patchFilePath], { cwd: '../server/' });
    patcher.on('close', (code: any) => {
        switch (code) {
            case 0: callback();
            default: throw new Error('PatchFailed');
        }
    });
}
