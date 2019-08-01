import './style.scss';
import React from 'react';

type Props = { 
    text?: string, 
    className?: string,
    readonly?: boolean
}

const NS = 'element-input-';

export default class extends React.Component<Props, {}>{

    static readonly defaultProps = {
        text: '',
        className: '',
        freeze: false
    }

    render() {
        return (
            <input readOnly={this.props.readonly} className={`${NS}root ${this.props.className}`}
                type="text"
                value={this.props.text}/>
        );
    }
}