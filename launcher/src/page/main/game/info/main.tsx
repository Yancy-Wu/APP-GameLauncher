import React from 'react';
import Button from '../../../../elements/button/main';
import * as Utils from '../../../../base/utils';
import './style.scss';

const NS = 'page-main-game-info-';

type Props = {
    type: 'update' | 'install',
    className: string,
    progress: number,
    title: string,
    restTime: number,
    speedBS: number,
    hasDownloadBytes: number,
    totalDownloadBytes: number,
    version: string
}

export default class extends React.Component<Props, {}>{

    numToPer = (n: number) => (n * 100).toFixed(2).toString() + '%';

    render() {
        const infoStr: Map<string, string> = new Map();
        infoStr.set('剩余时间', Utils.secondToTimeStr(this.props.restTime));
        infoStr.set('下载速度', Utils.bytesToStr(this.props.speedBS) + '/s');
        infoStr.set('版本号', this.props.version);
        infoStr.set('已经下载', Utils.bytesToStr(this.props.hasDownloadBytes) + '/' + 
                                Utils.bytesToStr(this.props.totalDownloadBytes));
        return (
            <div className={`${NS}root ${this.props.className}`}>
                <span className={`${NS}title`}>
                    {(this.props.type === 'install' ? '安装' : '更新') + '信息'}
                </span>
                <div className={`${NS}content`}>
                    <span className={`${NS}description`}>
                        <span>{this.props.title}</span>
                        <span>{this.numToPer(this.props.progress)}</span>
                    </span>
                    {[...infoStr.entries()].map(([k, v], i) =>
                        <div className={`${NS}line`} key={i}>
                            <span>{k}:</span>
                            <span>{v}</span>
                        </div>
                    )}
                </div>
                <div className={`${NS}btns`}>
                    <Button className={`${NS}btn`} text={'暂停'} />
                    <Button className={`${NS}btn`} text={'取消'} />
                </div>
            </div>
        );
    }
}