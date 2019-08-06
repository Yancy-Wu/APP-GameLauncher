import MetaInfo from '../modules/meta';
import { downloadClient, downloadMeta } from '../modules/download';
import { Progress } from '../types';
import { unzipClient, checkExe } from '../modules/utils';
import { getNewestClientVersion } from '../modules/version';
import * as Interface from './interface';

type Action = 'Connecting' | 'Indexing' | 'Downloading' | 'Verifying' | 'Installing' | 'Done';

interface InstallInfo extends Interface.SummaryInfo {
    version: string,
    needDownload: number,
}

export default class Install extends Interface.Pipeline {

    private version!: string;
    private meta!: MetaInfo;

    public logic(action: Action): void {
        switch (action) {
            case 'Connecting':
                this.connecting(() => this.logic('Indexing'));
                break;
            case 'Indexing':
                this.indexing(() => this.logic('Downloading'));
                break;
            case 'Downloading':
                this.downloadingDisplay(downloadClient(this.meta), () => this.logic('Verifying'));
                break;
            case 'Verifying':
                this.verifyingDisplay(checkExe(this.meta), () => this.logic('Installing'));
                break;
            case 'Installing':
                this.installingDisplay(unzipClient(this.meta), () => this.logic('Done'));
                break;
            case 'Done':
                this.done();
        }
    }

    public connecting(done: () => void) {
        const REPLY: Interface.BaseInfo = {
            type: 'info',
            what: 'Connecting',
            msg: '连接中, 请等待...'
        }
        this.send(REPLY);
        getNewestClientVersion(version => {
            this.version = version;
            done();
        });
    }

    public indexing(done: () => void) {
        const REPLY: Interface.BaseInfo = {
            type: 'info',
            what: 'Indexing',
            msg: '获取元数据中，请等待...'
        }
        this.send(REPLY);
        downloadMeta(this.version, meta => {
            const info: InstallInfo = {
                type: 'abstract',
                version: this.version,
                needDownload: meta.exeSizeBytes,
            }
            this.send(info);
            done();
        });
    }

    private downloadingDisplay(progress: Progress, done: () => void) {
        this.progressDisplay('Downloading', '正在下载数据中...', 0.8, progress, done);
    }

    private verifyingDisplay(progress: Progress, done: () => void) {
        this.progressDisplay('Verifying', '正在校验数据中...', 0.8, progress, done);
    }

    private installingDisplay(progress: Progress, done: () => void) {
        this.progressDisplay('Installing', '正在安装客户端中...', 0.8, progress, done);
    }
}