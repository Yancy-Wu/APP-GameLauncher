import MetaInfo from '../modules/meta';
import { downloadMeta, downloadPatch } from '../modules/download';
import { Progress } from '../types';
import { checkPatch } from '../modules/utils';
import { getToUpdateVersions } from '../modules/version';
import { patchClient } from '../modules/patch';
import * as Interface from './interface';

interface UpdateInfo extends Interface.SummaryInfo {
    versions: string[],
    needDownload: number,
}

type Action = 'Connecting' | 'Indexing' | 'Updating' | 'Done';
type SubAction = 'Downloading' | 'Verifying' | 'Patching';
export default class Update extends Interface.Pipeline {

    private versions!: string[];
    private meta!: MetaInfo[];

    public logic(action: Action) {
        switch (action) {
            case 'Connecting':
                this.connecting(() => this.logic('Indexing'));
                break;
            case 'Indexing':
                this.indexing(() => this.logic('Updating'));
                break;
            case 'Updating':
                const size = this.meta.map(v => v.patchSizeBytes).reduce((p, c) => p + c, 0);
                const doUpdate = (index: number, done: () => void) => {
                    if (index === this.versions.length) done();
                    const curMeta = this.meta[index];
                    this.subLogic('Downloading', curMeta, curMeta.patchSizeBytes / size, () => {
                        doUpdate(index + 1, done);
                    });
                }
                doUpdate(0, () => this.logic('Done'));
                break;
            case 'Done':
                this.done();
        }
    }

    private subLogic(action: SubAction, meta: MetaInfo, weight: number, done: () => void) {
        switch (action) {
            case 'Downloading':
                this.downloadingDisplay(weight * 0.8, downloadPatch(meta), () => {
                    this.subLogic('Verifying', meta, weight, done);
                });
                break;
            case 'Verifying':
                this.verifyingDisplay(weight * 0.05, checkPatch(meta), () => {
                    this.subLogic('Patching', meta, weight, done);
                });
                break;
            case 'Patching':
                this.patchingDisplay(weight * 0.15, patchClient(meta), () => {
                    done();
                })
        }
    }

    public connecting(done: () => void) {
        const REPLY: Interface.BaseInfo = {
            type: 'info',
            what: 'Connecting',
            msg: '连接中, 请等待...'
        }
        this.send(REPLY);
        getToUpdateVersions(versions => {
            this.versions = versions;
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
        let handled = 0;
        let metaAll = [...new Array(this.versions.length)];
        let info: UpdateInfo = {
            type: 'abstract',
            versions: this.versions,
            needDownload: 0,
        }
        this.versions.forEach(version => {
            downloadMeta(version, meta => {
                info.needDownload += meta.patchSizeBytes;
                metaAll[this.versions.indexOf(version)] = meta;
                ++handled;
                if (handled === this.versions.length) {
                    this.send(info);
                    this.meta = metaAll;
                    done();
                }
            });
        })
    }

    private downloadingDisplay(weight: number, progress: Progress, done: () => void) {
        this.progressDisplay('Downloading', '正在下载中...', weight, progress, done);
    }

    private verifyingDisplay(weight: number, progress: Progress, done: () => void) {
        this.progressDisplay('Verifying', '正在校验数据中...', weight, progress, done);
    }

    private patchingDisplay(weight: number, progress: Progress, done: () => void) {
        this.progressDisplay('Patching', '正在打包Patch中...', weight, progress, done);
    }
}