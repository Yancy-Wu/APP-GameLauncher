import React from 'react';
import SelectSync from '../../../../decorator/select-sync';
import Dot from '../../../../elements/dot/main';
import Matrix from '../../../../layout/matrix/main';
import ImgRoll from '../../../../elements/img-roll/main';
import ImgTest from '../../../../resources/tutem.png';
import './style.scss';

const NS = 'page-main-game-show-';

type ShowData = {
    title: string,
    items: {title: string, time: Date}[],
    imgs: string[]
}

export default class extends React.Component<{className:string}, {}>{

    private data: ShowData = {
        title: '测试的标题在这里',
        items: [{title: '第一个',time: new Date(2019, 7, 22)},
                {title: '第二个敲里吗敲里吗',time: new Date(2019, 7, 22)},
                {title: '第三个wdnmd',time: new Date(2019, 7, 22)},
                {title: '12345jsuwahnnnbb wodllla sawcswws swxaawsawd',time: new Date(2019, 9, 22)}],
        imgs:[ImgTest,ImgTest,ImgTest,ImgTest]
    };

    render() {
        return (
            <div className={`${NS}root ${this.props.className}`}>
                <span className={`${NS}title`}>{this.data.title}</span>
                <div className={`${NS}content`}>
                    {this.data.items.map((v,i)=>(
                        <div className={`${NS}detail`} key={i}>
                            <span className={`${NS}word`}>{v['title']}</span>
                            <span className={`${NS}date`}>
                                {`${v['time'].getMonth()}/${v['time'].getDay()}`}
                            </span>
                        </div>
                    ))}
                </div>
                <div className={`${NS}img-div`}>
                    <SelectSync count={this.data.imgs.length} autoplayTime={2000}>
                        <ImgRoll className={`layer ${NS}img-roll`} src={this.data.imgs}/>
                        <Matrix className={`${NS}matrix`} row={1} column={this.data.imgs.length}>
                            <Dot className={`${NS}dot`}/>
                        </Matrix>
                    </SelectSync>
                </div>
            </div>
        );
    }
}