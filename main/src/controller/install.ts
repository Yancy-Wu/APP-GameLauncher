import MetaInfo from '../base/meta';
import Pipeline from './pipeline';
import EXCEPTIONS from '../exceptions/define';
import { ClientDownloader, downloadMeta } from '../modules/download';
import { ClientUnzipper, ExeChecker } from '../modules/utils';
import { getNewestClientVersion } from '../modules/version';
import { clearClient, clearMeta } from '../modules/clear';
import * as Msg from './msg';

type Action = 'Connecting' | 'Indexing' | 'Downloading' | 'Verifying' | 'Installing';

interface InstallInfo extends Msg.BaseMsg {
    type: 'abstract',
    version: string,
    needDownload: number,
}

export default class Install extends Pipeline {

    private version!: string;
    private meta!: MetaInfo;

    private async connecting(): Promise<string | undefined> {
        return await this.retryTask(async () => {
            this.sendInfo('连接中, 请等待...');
            this.version = await getNewestClientVersion();
        }, [EXCEPTIONS.connectFailed]);
    }

    private async indexing(): Promise<string | undefined> {
        return await this.retryTask(async () => {
            this.sendInfo('获取元数据中，请等待...');
            this.meta = await downloadMeta(this.version);
            const info: InstallInfo = {
                type: 'abstract',
                version: this.version,
                needDownload: this.meta.exeSizeBytes,
            }
            this.send(info);
        }, [EXCEPTIONS.connectFailed]);
    }

    private async downloading(): Promise<string | undefined> {
        let downloader = new ClientDownloader(this.meta);
        downloader.onInfo = this.sendProgress.bind(this, '正在下载数据中...', 0.8);
        return await this.retryTask(downloader, [EXCEPTIONS.connectFailed]);
    }

    private async verifying(): Promise<string | undefined> {
        let checker = new ExeChecker(this.meta);
        checker.onInfo = this.sendProgress.bind(this, '正在校验数据中...', 0.05);
        return await this.retryTask(checker, []);
    }

    private async installing(): Promise<string | undefined> {
        let clientUnzipper = new ClientUnzipper(this.meta);
        clientUnzipper.onInfo = this.sendProgress.bind(this, '正在安装客户端中...', 0.15);
        return await this.retryTask(clientUnzipper, []);
    }

    public logic = async (action: Action | undefined): Promise<[boolean, string]> => {
        switch (action) {
            case undefined:
                return [true, 'Connecting'];
            case 'Connecting':
                const connectError = await this.connecting();
                if (connectError) {
                    this.sendError(connectError);
                    this.pause();
                    return [true, 'Connecting'];
                }
                return [true, 'Indexing'];
            case 'Indexing':
                const indexError = await this.indexing();
                if (indexError) {
                    this.sendError(indexError);
                    this.pause();
                    await clearMeta();
                    return [true, 'Indexing'];
                }
                return [true, 'Downloading'];
            case 'Downloading':
                const downloadError = await this.downloading();
                if (downloadError) {
                    this.sendError(downloadError);
                    this.pause();
                    return [true, 'Downloading'];
                }
                return [true, 'Verifying'];
            case 'Verifying':
                const checkerError = await this.verifying();
                if (checkerError === EXCEPTIONS.md5CheckFailed) {
                    this.sendError(checkerError);
                    this.pause();
                    await clearClient();
                    return [true, 'Downloading'];
                }
                if (checkerError) {
                    this.sendError(checkerError);
                    this.pause();
                    return [true, 'Verifying'];
                }
                return [true, 'Installing'];
            case 'Installing':
                const unzipError = await this.installing();
                if (unzipError) {
                    this.sendError(unzipError);
                    this.pause();
                    return [true, 'Installing'];
                }
                this.sendDone();
                return [false, ''];
        }
    }
}