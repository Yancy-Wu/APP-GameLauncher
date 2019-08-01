import './style.scss';
import React from 'react';
import Show from './show/main';
import SpinBtn from '../../../elements/spin-btn/main';
import Button from '../../../elements/button/main';
import ProgressBar from './progressbar/main';
import Info from './info/main';
import CONST from './constant';
import ClientMetaInfo from '../../../API/meta';
import * as VersionAPI from '../../../API/version';
import * as DownloadAPI from '../../../API/download';
import * as VerifyAPI from '../../../API/verify';
import * as PatchAPI from '../../../API/patch';
import * as ConfigAPI from '../../../API/config';

let displayInfo = {
    progress: 0,
    title: '连接服务器中, 请等待...',
    restTime: NaN,
    speedBS: 0,
    hasDownloadBytes: 0,
    totalDownloadBytes: 0,
    version: '0.00'
}

const NS = 'page-main-game-';

export default class extends React.Component<
    { onReleaseControl: () => void },
    {
        op: 'ready' | 'install' | 'update' | 'check',
        installSubState: 'preparing' | 'indexing' | 'connecting' | 'downloading' | 'verifying' | 'unzip',
        updateSubState: 'preparing' | 'indexing' | 'connecting' | 'downloading' | 'verifying' | 'patching',
    }>{

    constructor(props: { onReleaseControl: () => void }) {
        super(props);
        this.state = {
            op: !ConfigAPI.get(ConfigAPI.SCHEMA.gamePath) ? 'install' : 'check',
            installSubState: 'preparing', updateSubState: 'preparing'
        };
    }

    private lastDownloadBytes = 0;
    downloadInfo2DisplayInfo(dInfo: DownloadAPI.DownloadInfo, sizeBytes: number) {
        displayInfo.hasDownloadBytes = dInfo.downloadedBytes;
        displayInfo.totalDownloadBytes = sizeBytes;
        displayInfo.progress = dInfo.downloadedBytes / sizeBytes;
        displayInfo.speedBS = dInfo.downloadedBytes - this.lastDownloadBytes;
        displayInfo.restTime = (sizeBytes - dInfo.downloadedBytes) / displayInfo.speedBS;
        this.lastDownloadBytes = dInfo.downloadedBytes;
    }

    private installMetaInfo!: ClientMetaInfo;
    private installVersion!: string;
    private installDownloadInfo!: DownloadAPI.DownloadInfo;
    installLogic() {
        switch (this.state.installSubState) {
            case 'preparing':
                VersionAPI.getNewestClientVersion(version => {
                    this.installVersion = version;
                    displayInfo.title = '获取元数据中, 请等待...';
                    displayInfo.version = version;
                    this.setState({ installSubState: 'indexing' });
                });
                break;
            case 'indexing':
                DownloadAPI.downloadMeta(this.installVersion, info => {
                    console.log(info)
                    this.installMetaInfo = info;
                    displayInfo.title = '连接下载服务器中...';
                    this.setState({ installSubState: 'connecting' });
                });
                break;
            case 'connecting':
                this.installDownloadInfo = DownloadAPI.downloadClient(this.installMetaInfo);
                this.lastDownloadBytes = 0;
                displayInfo.title = '正在下载客户端文件中...';
                this.setState({ installSubState: 'downloading' });
                break;
            case 'downloading':
                this.downloadInfo2DisplayInfo(this.installDownloadInfo, this.installMetaInfo.exeSizeBytes);
                if (this.installDownloadInfo.done) {
                    displayInfo.title = '下载完成，正在校验数据中...';
                    displayInfo.progress = 0;
                    this.setState({ installSubState: 'verifying' });
                } else setTimeout(() => this.setState({ installSubState: 'downloading' }), 1000);
                break;
            case 'verifying':
                VerifyAPI.md5CheckFile(this.installDownloadInfo.savedPath, this.installMetaInfo.exeMd5, res => {
                    if (res) {
                        displayInfo.title = '数据校验通过，解压文件中...';
                        displayInfo.progress = 0;
                        this.setState({ installSubState: 'unzip' });
                    }
                });
                break;
            case 'unzip':
                PatchAPI.unzip(this.installDownloadInfo.savedPath, () => {
                    ConfigAPI.set(ConfigAPI.SCHEMA.gamePath, this.installDownloadInfo.savedPath);
                    ConfigAPI.set(ConfigAPI.SCHEMA.installPath, undefined);
                    this.setState({ op: 'ready' });
                })
        }
    }

    private toUpdateVersions!: IterableIterator<string>;
    checkLogic() {
        VersionAPI.getToUpdateVersions(versions => {
            this.toUpdateVersions = versions.values();
            if (!versions) this.setState({ op: 'ready' });
            else {
                displayInfo.title = '获取元数据中, 请等待...';
                this.setState({ op: 'update', updateSubState: 'indexing' });
            }
        });
    }

    private updateMetaInfo!: ClientMetaInfo;
    private updateDownloadInfo!: DownloadAPI.DownloadInfo;
    updateLogic() {
        switch (this.state.updateSubState) {
            case 'indexing':
                const iter = this.toUpdateVersions.next();
                if (iter.done) this.setState({ op: 'ready' });
                else {
                    DownloadAPI.downloadMeta(iter.value, info => {
                        displayInfo.title = '连接到下载服务器中...';
                        this.updateMetaInfo = info;
                        this.setState({ updateSubState: 'connecting' });
                    });
                }
                break;
            case 'connecting':
                this.updateDownloadInfo = DownloadAPI.downloadPatch(this.updateMetaInfo);
                this.lastDownloadBytes = 0;
                displayInfo.title = '正在下载Patch文件中...';
                this.setState({ updateSubState: 'downloading' });
                break;
            case 'downloading':
                this.downloadInfo2DisplayInfo(this.updateDownloadInfo, this.updateMetaInfo.patchSizeBytes);
                if (this.updateDownloadInfo.done) {
                    displayInfo.title = '下载完成，正在校验数据中...';
                    displayInfo.progress = 0;
                    this.setState({ updateSubState: 'verifying' });
                } else setTimeout(() => {
                    this.setState({ updateSubState: 'downloading' });
                }, 1000);
                break;
            case 'verifying':
                VerifyAPI.md5CheckFile(this.updateDownloadInfo.savedPath, this.updateMetaInfo.exeMd5, res => {
                    if (res) {
                        displayInfo.title = '数据校验完成，开始打包Patch...';
                        this.setState({ updateSubState: 'patching' });
                    }
                });
                break;
            case 'patching':
                PatchAPI.patch(this.updateDownloadInfo.savedPath, () => {
                    displayInfo.title = '获取元数据中, 请等待...';
                    this.setState({ updateSubState: 'indexing' });
                });
                break;
        }
    }

    logic() {
        if (this.state.op === 'install') this.installLogic();
        if (this.state.op === 'check') this.checkLogic();
        if (this.state.op === 'update') this.updateLogic();
    }

    componentDidUpdate = () => { this.logic(); }
    componentDidMount = () => { this.logic(); }

    render() {
        const all = CONST[this.state.op];
        return [
            <div className={`${NS}root`} key={0}>
                <Show className={`${NS}show`} />
                <div className={`${NS}main`}>
                    <div className={`${NS}select-service`}>
                        <div className={`${NS}text`}>请选择服务器</div>
                        <SpinBtn className={`${NS}select-service-btn`} text={'选服'} />
                    </div>
                    <Button text={all.btnText} className={`${NS}btn`} disabled={all.btnDisabled} />
                    <div className={`${NS}aux`}>
                        <span className={`${NS}aux-btn`}>游戏修复</span>
                        <span className={`${NS}aux-btn`}>打开目录</span>
                    </div>
                    {all.infoText ?
                        <div className={`${NS}trape-btn`}>{all.infoText}信息&nbsp;▲</div>
                        : undefined}
                </div>
                {all.infoType ?
                    <Info className={`${NS}info`} type={all.infoType as 'install' | 'update'} {...displayInfo} />
                    : undefined}
            </div>,
            <div key={1}>{all.progressBar ?
                <ProgressBar className={`${NS}bar`} progress={0.5} key={1} />
                : undefined}
            </div>
        ];
    }
}