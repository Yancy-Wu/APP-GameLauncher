import './style.scss';
import React from 'react';
import Vec2 from '../../base/vec2';

///////////////////////////////////////////////////////
type Output = {
    src: string,
    className: string,
    onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    onMouseMove?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    onMouseUp?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    onMouseOut?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    getDOMSize?: (size: Vec2) => void
}
////////////////////////////////////////////////////////

const NS = 'element-icon-btn-';

export default class extends React.Component<Output, {}>{

    private ref!: HTMLDivElement;

    componentDidMount(){
        if(this.props.getDOMSize)
            this.props.getDOMSize(new Vec2(this.ref.clientWidth, this.ref.clientHeight));
    }

    render() {
        return (
            <div className={`${this.props.className} ${NS}root`} ref={(ref) => this.ref = ref!}
                onMouseDown={this.props.onMouseDown}
                onMouseMove={this.props.onMouseMove}
                onMouseOut={this.props.onMouseOut}
                onMouseUp={this.props.onMouseUp}>
                <img src={this.props.src} alt={'None'}/>
                <div />
            </div>
        );
    }
}