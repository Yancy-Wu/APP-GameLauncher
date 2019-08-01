import './style.scss';
import React from 'react';

type Props = {
    className: string,
    selected?: boolean,
    onSelected?: () => void,
}

const NS = 'element-dot-';

export default class extends React.Component<Props, {}>{

    static readonly defaultProps={
        selected: false,
        onSelected: ()=>{}
    }
    
    render() {
        const hoverClass = this.props.selected ? `${NS}hover`: '';
        return (
            <div className={`${NS}root ${this.props.className} ${hoverClass}`} 
                 onMouseOver={this.props.onSelected}/>
        );
    }
}