import './style.scss';
import React from 'react';

const NS = 'page-main-game-processbar-';

const waitText = '正在准备中，请耐心等待...';
const workText = '当前完成百分比: ';

export default class extends React.Component<{
    className: string,
    progress: number
}, {}>{

    render() {
        const progressStr = (this.props.progress * 100).toFixed(2) + '%';
        const barBack = 'rgba(0,0,0,0.6)';
        const lightStartXPer = (this.props.progress - 0.1) * 100 + '%';
        const barLight = `linear-gradient(to right, 
            #77779933 0%, 
            #777799BB ${lightStartXPer}, 
            #9999FFEE ${progressStr},
            #00000000 ${progressStr})`;
        return (
            <div className={`${NS}root ${this.props.className}`}>
                <div className={`${NS}bar`} style={{
                    background: `${barLight},${barBack}`,
                }}/>
                <span className={`${NS}caption`}>
                    {this.props.progress === 0 ? waitText : workText + progressStr}
                </span>
            </div>
        );
    }
}