import React from 'react';
import Vec2 from '../base/vec2';

//////////////////////////////////////////////////////////////////
type Input = {
    onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    onMouseMove: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    onMouseUp: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    onMouseOut: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    getDOMSize: (size: Vec2) => void
}

type Output = {
    dir?: Vec2,
    onMainClick?: () => void,
    onAuxClick?: () => void,
    onDrag?: (offset: number) => void,
    onDragEnd?: () => void,
}
////////////////////////////////////////////////////////////////////

const BUTTON_MAIN = 0;
const BUTTON_AUX = 2;
const BUTTON_NONE = -1;

export default class extends React.Component<Output, {}>{

    private pos!: Vec2;
    private bounding!: Vec2;
    private startMove = false;
    private button = BUTTON_NONE;

    onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        this.pos = new Vec2(event.clientX, event.clientY);
        this.button = event.button;
    }

    onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        if (this.button !== BUTTON_MAIN) return;
        let curPos = new Vec2(event.clientX, event.clientY);
        let projOffset = curPos.minus(this.pos).projAt(this.props.dir!);
        if(Number.isNaN(projOffset)) return;
        let projAll = this.bounding.projAt(this.props.dir!);
        if (Math.abs(projOffset) > Math.abs(projAll) / 4) this.startMove = true;
        if (this.startMove && this.props.onDrag) {
            this.props.onDrag(projOffset);
            this.pos = curPos;
        }
    }

    onMouseUp(): void {
        if (this.button === BUTTON_NONE) return;
        if (this.button === BUTTON_AUX && this.props.onAuxClick){
            this.props.onAuxClick();
        } 
        if (this.startMove && this.button === BUTTON_MAIN && this.props.onDragEnd){
            this.props.onDragEnd();
        }
        if (!this.startMove && this.button === BUTTON_MAIN && this.props.onMainClick){
            this.props.onMainClick();
        } 
        this.startMove = false;
        this.button = BUTTON_NONE;
    }

    render() {
        let input: Input = {
            onMouseDown: this.onMouseDown.bind(this),
            onMouseMove: this.onMouseMove.bind(this),
            onMouseUp: this.onMouseUp.bind(this),
            onMouseOut: this.onMouseUp.bind(this),
            getDOMSize: (size: Vec2) => this.bounding = size
        }
        return (
            React.cloneElement(this.props.children as React.ReactElement<any>, {
                ...input,
                key: 0
            })
        );
    }
}