import './style.scss';
import React from 'react';

type Props = {
    className: string,
    src: string
}

const NS = 'element-avatar-';

export default class extends React.Component<Props, {}>{
    render() {
        return (
            <img className={`${this.props.className} ${NS}root`} src={this.props.src}
                alt={'None'}>
            </img>
        );
    }
}