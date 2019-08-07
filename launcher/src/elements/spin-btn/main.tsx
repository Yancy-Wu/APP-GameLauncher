import './style.scss';
import React from 'react';

///////////////////////////////////////////////////////
type Output = {
    text: string,
    className: string,
}
////////////////////////////////////////////////////////

const NS = 'element-spin-btn-';

export default class extends React.Component<Output, {}>{

    render() {
        return (
            <div className={`${NS}root ${this.props.className}`}>
                <div className={`${NS}spin-z layer`}>
                    <div className={`${NS}spin-y layer`}>
                        <div className={`${NS}spin-text layer`}>{this.props.text}</div>
                    </div>
                </div>
            </div>
        );
    }
}