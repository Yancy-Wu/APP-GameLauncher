import * as ConfigAPI from './config';
import {child_process, path} from './global';

//const ERROR_PARAM = 2
//const PATCH_ERROR = 3
//const PATCH_FILE_ERROR = 4

export function patch(patchFilePath: string, callback: () => void): void {
    let patcher = child_process.spawn('python', [
        '-m', 'patch', '--patch',
        '-r', ConfigAPI.get(ConfigAPI.SCHEMA.gamePath),
        '-f', patchFilePath], { cwd: '../server/' });
    patcher.on('close', (code: any) => {
        switch (code) {
            case 0: callback();
            default: throw new Error('PatchFailed');
        }
    });
}

export function unzip(filePath: string, callback: () => void): void {
    let unzipper = child_process.spawn('../external/7z', [
        'x', '-y', filePath,
        '-o' + path.dirname(filePath)]);
    unzipper.on('close', (code: any) => {
        switch (code) {
            case 0: callback();
            default: throw new Error('UnzipFailed');
        }
    });
}