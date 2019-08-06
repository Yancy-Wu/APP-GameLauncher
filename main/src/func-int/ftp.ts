import ftp from 'ftp';
import CONFIG from '../config';
import EXCEPTIONS from '../exceptions';

export function getDirs(callback: (dirNames: string[]) => void) {
    let ftpClient = new ftp();
    ftpClient.on('ready', () => {
        ftpClient.list('/', (_, list: any[]) => {
            ftpClient.end();
            callback(list.map(v => v.name));
        });
    });
    ftpClient.on('error', () => {
        ftpClient.destroy();
        throw new Error(EXCEPTIONS.connectFailed);
    });
    ftpClient.connect(CONFIG.ftpProperty);
}