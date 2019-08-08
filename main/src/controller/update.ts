import MetaInfo from '../base/meta';
import Pipeline from './pipeline';
import EXCEPTIONS from '../exceptions/define';
import { downloadMeta, PatchDownloader } from '../modules/download';
import { PatchChecker } from '../modules/utils';
import { getToUpdateVersions } from '../modules/version';
import { clearMeta, clearPatch } from '../modules/clear';
import { PatchClient } from '../modules/patch';
import * as Msg from './msg';

interface UpdateInfo extends Msg.BaseMsg {
    type: 'abstract',
    versions: string[],
    needDownload: number,
}

type Action = 'Connecting' | 'Indexing' | 'Updating';
type SubAction = 'Downloading' | 'Verifying' | 'Patching';
export default class Update extends Pipeline {

    private versions!: string[];
    private meta!: MetaInfo[];

    private async connecting(): Promise<string | undefined> {
        return await this.retryTask(async () => {
            this.sendInfo('连接中, 请等待...');
            this.versions = await getToUpdateVersions();
        }, [EXCEPTIONS.connectFailed]);
    }

    private async indexing(): Promise<string | undefined> {
        return await this.retryTask(async () => {
            this.sendInfo('获取元数据中，请等待...');
            this.meta = [...new Array(this.versions.length)];
            let info: UpdateInfo = {
                type: 'abstract',
                versions: this.versions,
                needDownload: 0,
            }
            this.versions.forEach(async (version, i) => {
                const meta = await downloadMeta(version);
                info.needDownload += meta.patchSizeBytes;
                this.meta[i] = meta;
            });
        }, [EXCEPTIONS.connectFailed]);
    }

    private async updating(): Promise<void> {
        const size = this.meta.map(v => v.patchSizeBytes).reduce((p, c) => p + c, 0);
        this.meta.forEach(async meta => {
            const weight = meta.patchSizeBytes / size;
            await this.loop(this.subLogic.bind(this, meta, weight));
        });
    }

    private async downloading(meta: MetaInfo, weight: number): Promise<string | undefined> {
        let downloader = new PatchDownloader(meta);
        downloader.onInfo = this.sendProgress.bind(this, '正在下载Patch中...', weight * 0.8);
        return await this.retryTask(downloader, [EXCEPTIONS.connectFailed]);
    }

    private async verifying(meta: MetaInfo, weight: number): Promise<string | undefined> {
        let checker = new PatchChecker(meta);
        checker.onInfo = this.sendProgress.bind(this, '正在校验Patch中...', weight * 0.05)
        return await this.retryTask(checker, []);
    }

    private async patching(meta: MetaInfo, weight: number): Promise<string | undefined> {
        let patcher = new PatchClient(meta);
        patcher.onInfo = this.sendProgress.bind(this, 'Patch客户端中...', weight * 0.15)
        return await this.retryTask(patcher, []);
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
                return [true, 'Updating'];
            case 'Updating':
                await this.updating();
                this.sendDone();
                return [false, ''];
        }
    }

    private async subLogic(meta: MetaInfo, weight: number, action: SubAction): Promise<[boolean, string]> {
        switch (action) {
            case undefined:
                return [true, 'Downloading'];
            case 'Downloading':
                const downloadError = await this.downloading(meta, weight);
                if (downloadError) {
                    this.sendError(downloadError);
                    this.pause();
                    return [true, 'Downloading'];
                }
                return [true, 'Verifying'];
            case 'Verifying':
                const checkerError = await this.verifying(meta, weight);
                if (checkerError === EXCEPTIONS.md5CheckFailed) {
                    this.sendError(checkerError);
                    this.pause();
                    await clearPatch(meta);
                    return [true, 'Downloading'];
                }
                if (checkerError) {
                    this.sendError(checkerError);
                    this.pause();
                    return [true, 'Verifying'];
                }
                return [true, 'Patching'];
            case 'Patching':
                const patchError = await this.patching(meta, weight);
                if (patchError) {
                    this.pause();
                    return [true, 'Patching'];
                }
                return [false, ''];
        }
    }
}