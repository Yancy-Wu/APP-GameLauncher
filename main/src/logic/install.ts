import MetaInfo from '../modules/meta';
import { downloadClient, downloadMeta } from '../modules/download';
import { Progress } from '../types';
import { unzipClient, checkExe } from '../modules/utils';
import { getNewestClientVersion } from '../modules/version';
import * as Interface from './interface';

type Action = 'Connecting' | 'Indexing' | 'Downloading' | 'Verifying' | 'Installing';

interface InstallInfo extends Interface.SummaryInfo {
    version: string,
    needDownload: number,
}

export default class Install extends Interface.Pipeline {

    private version!: string;
    private meta!: MetaInfo;

    public async logic(action: Action | undefined): Promise<[boolean, string]> {
        switch (action) {
            case undefined:
                return [true, 'Connecting'];
            case 'Connecting':
                await this.connecting();
                return [true, 'Indexing'];
            case 'Indexing':
                await this.indexing();
                return [true, 'Downloading'];
            case 'Downloading':
                let downloadProgress: Progress = {done: false, progress: 0}
                downloadClient(this.meta, downloadProgress);
                await this.progressDisplay('Downloading', '正在下载数据中...', 0.8, downloadProgress);
                return [true, 'Verifying'];
            case 'Verifying':
                let verifyProgress: Progress = {done: false, progress: 0}
                checkExe(this.meta, verifyProgress);
                await this.progressDisplay('Verifying', '正在校验数据中...', 0.8, verifyProgress);
                return [true, 'Installing'];
            case 'Installing':
                let unzipProgress: Progress = {done: false, progress: 0}
                unzipClient(this.meta, unzipProgress);
                await this.progressDisplay('Installing', '正在安装客户端中...', 0.8, unzipProgress);
                return [false, 'Done'];
        }
    }

    public async connecting() {
        const REPLY: Interface.BaseInfo = {
            type: 'info',
            what: 'Connecting',
            msg: '连接中, 请等待...'
        }
        this.send(REPLY);
        this.version = await getNewestClientVersion();
    }

    public async indexing() {
        const REPLY: Interface.BaseInfo = {
            type: 'info',
            what: 'Indexing',
            msg: '获取元数据中，请等待...'
        }
        this.send(REPLY);
        this.meta = await downloadMeta(this.version);
        const info: InstallInfo = {
            type: 'abstract',
            version: this.version,
            needDownload: this.meta.exeSizeBytes,
        }
        this.send(info);
    }
}