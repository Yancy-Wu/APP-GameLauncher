import ftp from 'ftp';
import CONFIG from '../base/config';
import EXCEPTIONS from '../exceptions/define';

export default async function listFtpDirs(dir: string): Promise<string[]> {
    return new Promise(resolve => {
        let ftpClient = new ftp();
        ftpClient.on('ready', () => {
            ftpClient.list(dir, (_, list: any[]) => {
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