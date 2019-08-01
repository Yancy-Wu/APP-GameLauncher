import './style.scss';
import React from 'react';

type Output = {
    src: string[],
    className: string,
    selectedIndex?: number,
    onSelected?: (index: number) => void    //never call.
}

const NS = 'element-img-roll-';

export default class extends React.Component<Output, {}>{

    private lastIndex: number = 0;
    private whoShouldUp: number = 1;

    static readonly defaultProps={
        selectedIndex: 0,
        onSelected: ()=>{}
    }

    render() {
        const class1 = this.whoShouldUp === 0 ? 'up' : 'down';
        const class2 = this.whoShouldUp === 1 ? 'up' : 'down';
        const src1 = this.whoShouldUp === 0 ? this.props.src[this.props.selectedIndex!] :
            this.props.src[this.lastIndex];
        const src2 = this.whoShouldUp === 1 ? this.props.src[this.props.selectedIndex!] :
            this.props.src[this.lastIndex];
        this.whoShouldUp = 1 - this.whoShouldUp;
        return (
            <div className={`${NS}root ${this.props.className}`}>
                <img className={`${NS}img ${NS+class1}`} alt={'none'} src={src1} />
                <img className={`${NS}img ${NS+class2}`} alt={'none'} src={src2} />
            </div>
        );
    }
}