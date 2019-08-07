import './style.scss';
import React from 'react';
import Vec2 from '../../base/vec2';

type Props = {
    dir: 'horizontal' | 'vertical',
    className?: string,
}

const NS = 'layout-group-';

export default class extends React.Component<Props, {}>{

    private readonly dir: Vec2;

    constructor(props:Props){
        super(props);
        this.dir = this.props.dir === 'horizontal' ? new Vec2(1, 0) : new Vec2(0, 1);
    }
    
    render() {
        return (
            <div className={`${this.props.className} ${NS + this.props.dir}`}>
                {React.Children.map(this.props.children, (child, i) =>
                    React.cloneElement(child as React.ReactElement<any>, {
                        key: i,
                        dir: this.dir,
                    })
                )}
            </div>
        );
    }
}