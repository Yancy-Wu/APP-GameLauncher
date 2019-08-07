import ftp from 'ftp';
import CONFIG from '../config';
import EXCEPTIONS from '../exceptions/define';

export function getDirs(): Promise<string[]>{
    return new Promise(resolve => {
        let ftpClient = new ftp();
        ftpClient.on('ready', () => {
            ftpClient.list('/', (_, list: any[]) => {
                ftpClient.end();
                resolve(list.map(v => v.name));
            });
        });
        ftpClient.on('error', () => {
            ftpClient.destroy();
            throw new Error(EXCEPTIONS.connectFailed);
        });
        ftpClient.connect(CONFIG.ftpProperty);
    });
}