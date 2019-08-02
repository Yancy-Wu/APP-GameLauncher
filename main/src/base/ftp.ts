import ftp from 'ftp';
import CONFIG from '../config';

const ERROR_UNKNOW = 1
const ERROR_CONNECT_FAILED = 2

export function getDirs(callback: (dirNames: string[]) => void) {
    let ftpClient = new ftp();
    ftpClient.on('ready', () => {
        ftpClient.list('/', (err: any, list: any[]) => {
            if (err) throw err;
            callback(list.map(v => v.name));
        });
    });
    ftpClient.connect(CONFIG.ftpProperty);
}