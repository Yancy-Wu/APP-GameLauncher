import './style.scss';
import React from 'react';
import PageNoGame from './nogame/main';
import PageGame from './game/main';
import * as ConfigAPI from '../../API/config';
import * as VersionAPI from '../../API/version';

export default class extends React.Component<{}, {
    op: 'game' | 'noGame'
}>{

    constructor(props: {}){
        super(props);
        this.state = {op: 'noGame'};
    }

    chooseOp() {
        if(ConfigAPI.get(ConfigAPI.SCHEMA.gamePath)){
            VersionAPI.getCurrentVersion(version => {
                if(version) this.setState({op: 'game'});
                else{
                    ConfigAPI.set(ConfigAPI.SCHEMA.gamePath, undefined);
                    ConfigAPI.set(ConfigAPI.SCHEMA.installPath, undefined);
                    this.setState({op:'noGame'});
                }
            });
        }
        else if(ConfigAPI.get(ConfigAPI.SCHEMA.installPath)) this.setState({op:'game'});
        else this.setState({op:'noGame'});
    }

    componentDidMount = () => this.chooseOp()
    
    render() {
        return (
            <div className={'layer'}>
                {this.state.op === 'game' ? 
                <PageGame onReleaseControl = {() => this.chooseOp()}/> : 
                <PageNoGame onReleaseControl = {() => this.chooseOp()}/>}
            </div>
        );
    }
}