import React from 'react';

//////////////////////////////////////////////////////////////////
type Input = {
    selectedIndex: number,
    onSelected: (index: number) => void
}

type Output = {
    autoplayTime:number,
    count: number,
}
////////////////////////////////////////////////////////////////////

export default class extends React.Component<Output, {selectedIndex: number}>{

    private loopId: NodeJS.Timeout | undefined;

    constructor(props:Output){
        super(props);
        this.state={selectedIndex:0};
    }

    onSelected = (index: number) => {this.setState({selectedIndex:index})}

    componentDidMount(){
        if(this.props.autoplayTime === 0){
            if(this.loopId)clearInterval(this.loopId);
            return;
        }
        if(this.loopId) return;
        this.loopId = setInterval(() => {
            this.setState({selectedIndex: (this.state.selectedIndex + 1) % this.props.count})
        }, this.props.autoplayTime);
    }

    render() {
        const input: Input = {
            selectedIndex: this.state.selectedIndex,
            onSelected: this.onSelected.bind(this)
        }
        return [
            React.Children.map(this.props.children, (child,i)=>
                React.cloneElement(child as React.ReactElement<any>, {
                    key: i,
                    ...input
                })
            )
        ];;
    }
}