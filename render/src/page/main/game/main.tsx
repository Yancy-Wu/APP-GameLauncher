import './style.scss';
import React from 'react';
import Show from './show/main';
import SpinBtn from '../../../elements/spin-btn/main';
import Button from '../../../elements/button/main';
import ProgressBar from './progressbar/main';
import Info from './info/main';
import CONST from './constant';
import * as InfoAPI from '../../../API/info';
import * as InstallAPI from '../../../API/install';
import * as UpdateAPI from '../../../API/update';

let displayInfo = {
    progress: 0,
    title: '',
    restTime: NaN,
    speedBS: 0,
    hasDownloadBytes: 0,
    totalDownloadBytes: 0,
    version: '0.00'
}

const NS = 'page-main-game-';

export default class extends React.Component<
    { onReleaseControl: () => void },
    { op: 'ready' | 'install' | 'update' }>{

    constructor(props: { onReleaseControl: () => void }) {
        super(props);
        this.state = {
            op: !InfoAPI.getGamePath() ? 'install' : 'update'
        };
    }

    installLogic() {
        InstallAPI.install(info => {
            const installInfo = info as InstallAPI.InstallInfo;
            displayInfo.title = info.msg;
            switch (installInfo.what) {
                case 'Indexing':
                    const indexInfo = info as InstallAPI.IndexInfo;
                    displayInfo.version = indexInfo.version;
                    break;
                case 'Downloading':
                    const downloadInfo = info as InstallAPI.InstallDownloadInfo;
                    displayInfo.hasDownloadBytes = downloadInfo.downloadedBytes;
                    break;
                case 'Done':
                    this.setState({ op: 'ready' });
            }
        });
    }

    private newestClientVersion!: string;
    updateLogic() {
        UpdateAPI.update(info => {
            const updateInfo = info as UpdateAPI.UpdateInfo;
            displayInfo.title = info.msg;
            switch (updateInfo.what) {
                case 'None':
                    this.setState({ op: 'ready' });
                    break;
                case 'Overall':
                    const overallInfo = info as UpdateAPI.OverallInfo;
                    this.newestClientVersion = overallInfo.newestVersion;
                    break;
                case 'Indexing':
                    const indexInfo = info as UpdateAPI.IndexInfo;
                    displayInfo.version = indexInfo.version;
                    break;
                case 'Downloading':
                    const downloadInfo = info as UpdateAPI.UpdateDownloadInfo;
                    displayInfo.hasDownloadBytes = downloadInfo.downloadedBytes;
                    displayInfo.version = downloadInfo.version;
                    break;
                case 'Done':
                    if (displayInfo.version == this.newestClientVersion) {
                        this.setState({ op: 'ready' });
                    }
            }
        });
    }

    logic() {
        if (this.state.op === 'install') this.installLogic();
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