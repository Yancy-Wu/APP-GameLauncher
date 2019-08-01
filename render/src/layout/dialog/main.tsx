import './style.scss';
import React from 'react';
import Group from '../group/main';
import Avatar from '../../elements/avatar/main';
import Button from '../../elements/button/main';
import IconClose from '../../resources/close.svg';

type Props = {
    className?: string,
    buttonClassName?: string,
    buttonText?: string[],
    full?:boolean,
    onClick?: (btnIndex: number) => void
}

const NS = 'layout-dialog-';

export default class extends React.Component<Props, {}>{
    
    static readonly defaultProps = {
        className: '',
        full: false,
        buttonClassName: '',
    }

    render() {
        return (
            <div className={`${this.props.className}`}>
                <Group className={`${NS}controlbar`} dir={'horizontal'}>
                    <Avatar className={`${NS}element`} src={IconClose}/>
                </Group>
                <div className={`${this.props.full ? '' : `${NS}content`}`}>
                    {this.props.children}
                </div>
                {!this.props.buttonText ? undefined : (
                    <div className={`${NS}btn-group ${this.props.full ? `${NS}btn-fixed` : ''}`}>
                        {this.props.buttonText.map((t, i) => 
                            <Button text={t} key={i} 
                                onClick={this.props.onClick ? this.props.onClick.bind(this,i) : undefined}
                                className={`${NS}btn ${this.props.buttonClassName}`}/>
                        )}
                    </div>
                )}
            </div>
        );
    }
}