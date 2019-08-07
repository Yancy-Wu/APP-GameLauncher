import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import IconButton from './elements/icon-btn/main';
import Avatar from './elements/avatar/main';
import Group from './layout/group/main';
import IconClose from './resources/close.svg';
import IconMin from './resources/min.svg';
import IconMenu from './resources/menu.svg';
import IconLogo from './resources/logo.png';
import IconWechat from './resources/wechat.svg';
import IconWeibo from './resources/weibo.svg';
import IconUpdate from './resources/page-update.png';
import IconMain from './resources/page-main.png';
import PageMain from './page/main/main';
import MV from './resources/test.mp4';
import { DialogContext } from './base/context';

class App extends React.Component<{}, { dialogElement: React.ReactNode }>{

    constructor(props: {}) {
        super(props);
        this.state = { dialogElement: undefined };
    }

    render() {
        return (
            <DialogContext.Provider value={(dialogElement) => {
                this.setState({dialogElement: dialogElement});
                return undefined;
            }}>
                <div className={'main'}>
                    <div className={'layer back'}>
                        <video src={MV} loop height={'100%'} width={'100%'} autoPlay muted />
                    </div>
                    <div className={'layer page'}>
                        <PageMain />
                    </div>
                    {!this.state.dialogElement ? undefined : (
                        <div className={'layer dialog child-center'}>
                            {this.state.dialogElement}
                        </div>
                    )}
                    <div className={'titlebar'}>
                        <Group dir={'horizontal'}>
                            <Avatar className={'system-icon'} src={IconMenu} />
                            <Avatar className={'system-icon'} src={IconMin} />
                            <Avatar className={'system-icon'} src={IconClose} />
                        </Group>
                        <span className={'switch-id'}>切换账号</span>
                        <span className={'username'}>您尚未登陆</span>
                        <img className={'logo'} src={IconLogo} alt={'none'}></img>
                        <Group dir={'horizontal'}>
                            <Avatar className={'user-icon'} src={IconWechat} />
                            <Avatar className={'user-icon'} src={IconWeibo} />
                            <Avatar className={'user-icon'} src={IconWechat} />
                        </Group>
                    </div>
                    <Group className={'switcher'} dir={'vertical'}>
                        <IconButton src={IconMain} className={'switcher-icon'} />
                        <IconButton src={IconUpdate} className={'switcher-icon'} />
                    </Group>
                </div>
            </DialogContext.Provider>
        );
    }
}

window.onload = () => {ReactDOM.render(<App />, document.getElementById('root'));}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
