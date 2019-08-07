import './style.scss';
import React from 'react';

type Output = {
    row: number,
    column: number,
    className: string,
    selectedIndex?: number,
    onSelected?: (index: number) => void
}

const NS = 'layout-matrix-';

export default class extends React.Component<Output, {}>{

    static readonly defaultProps = {
        selectedIndex: 0,
        onSelect: () => {}
    }

    render() {
        return (
            <div className={`${NS}root ${this.props.className}`}>
                {new Array(this.props.row).fill(null).map((_, i)=>(
                    <div className={`${NS}row`} key={i}>
                        {new Array(this.props.column).fill(null).map((_, j) => {
                            const id = i* this.props.row + j;
                            return React.cloneElement(
                            this.props.children as React.ReactElement<any>,{
                                key: id,
                                selected: this.props.selectedIndex === id,
                                onSelected: this.props.onSelected!.bind(this, id)
                            }
                        )})}
                    </div>
                ))}
            </div>
        );
    }
}