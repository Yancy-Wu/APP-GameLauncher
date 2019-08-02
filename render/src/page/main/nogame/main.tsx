import './style.scss';
import React from 'react';
import Button from '../../../elements/button/main';
import { DialogContext } from '../../../base/context';
import Dialog from '../../../layout/dialog/main';
import Input from '../../../elements/input/main';
import * as Info from '../../../API/info';
import * as UI from '../../../API/ui';

const NS = 'page-main-nogame-';

class InstallDialog extends React.Component<
    { installConfirm: (path: string | undefined) => void },
    { path: string }>{

    onClick(btnIndex: number) {
        switch (btnIndex) {
            case 0: this.props.installConfirm(this.state.path); break;
            case 1: this.props.installConfirm(undefined); break;
        }
    }

    constructor(props: { installConfirm: (path: string | undefined) => void }) {
        super(props);
        this.state = { path: Info.getAppPath() };
    }

    render() {
        return (
            <div className={`${NS}dialog`}>
                <Dialog className={`${NS}dialog-back`}
                    buttonText={['确定', '取消']}
                    buttonClassName={`${NS}dialog-btn`}
                    onClick={this.onClick.bind(this)}>
                    <span className={`${NS}dialog-title`}> 请选择游戏的安装目录: </span>
                    <div className={`${NS}dir-select`}>
                        <Input text={this.state.path} readonly className={`${NS}dir-input`} />
                        <span className={`${NS}dir-btn`} onClick={() => {
                            UI.openDirDialog((path) => { if (path) this.setState({ path: path }); });
                        }}>更改</span>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default class extends React.Component<
    { onReleaseControl: () => void }, {}>{

    private readonly installDialog = <InstallDialog installConfirm={(path) => {
        this.openDialog(undefined);
        if (!path) return;
        Info.setInstallPath(path);
        this.props.onReleaseControl();
    }} />;

    private openDialog!: (element: React.ReactNode) => void;

    render() {
        return (
            <div className={`${NS}root`}>
                <Button text={'游戏安装'} className={`${NS}btn`} onClick={() => this.openDialog(this.installDialog)} />
                <Button text={'游戏官网'} className={`${NS}btn`} />
                <DialogContext.Consumer>{(func) => {
                    this.openDialog = func;
                    return undefined;
                }}</DialogContext.Consumer>
            </div>
        );
    }
}