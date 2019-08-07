import './style.scss';
import React from 'react';
import PageNoGame from './nogame/main';
import PageGame from './game/main';
import * as Info from '../../API/info';

export default class extends React.Component<{}, {
    op: 'game' | 'noGame'
}>{

    constructor(props: {}) {
        super(props);
        this.state = { op: 'noGame' };
    }

    chooseOp() {
        if (Info.getGamePath()) {
            if (Info.getCurrentVersion()) this.setState({ op: 'game' });
            else {
                Info.setGamePath(undefined);
                Info.setInstallPath(undefined);
                this.setState({ op: 'noGame' });
            }
        }
        else if (Info.getInstallPath()) this.setState({ op: 'game' });
        else this.setState({ op: 'noGame' });
    }

    componentDidMount = () => this.chooseOp()

    render() {
        return (
            <div className={'layer'}>
                {this.state.op === 'game' ?
                    <PageGame onReleaseControl={() => this.chooseOp()} /> :
                    <PageNoGame onReleaseControl={() => this.chooseOp()} />}
            </div>
        );
    }
}