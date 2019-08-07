import './style.scss';
import React from 'react';
import ImgTutem from '../../resources/tutem.png';

////////////////////////////////////////////
type Props = {
    text: string,
    className: string,
    disabled?: boolean,
    onClick?: () => void
}
//////////////////////////////////////////////

type State = {
    radius: number,
    posX: number
}

const animateDuration = 0.5;
const disabledAnimationDuration = 5;
const maxRadius = 5;
const radiusInit = 3;
const shineLenth = 70;

const NS = 'element-btn-';

export default class extends React.Component<Props, State>{

    private radialId!: NodeJS.Timeout;
    private linearId!: NodeJS.Timeout;
    private spareId!: NodeJS.Timeout;

    constructor(props: Props) {
        super(props);
        this.state = { radius: 0, posX: 0 }
    }

    animateLighter(duration: number, maxRadius: number) {
        let count = duration * 1000 / 50;
        let step = maxRadius / count;
        this.radialId = setInterval(() => {
            this.setState({
                radius: Math.max(this.state.radius, radiusInit) + step
            })
            if (this.state.radius >= maxRadius) {
                clearInterval(this.radialId);
            }
        }, 50);
    }

    onHover() {
        if (this.props.disabled) return;
        clearInterval(this.radialId);
        this.animateLighter(animateDuration, maxRadius);
    }

    onLeave() {
        if (this.props.disabled) return;
        clearInterval(this.radialId);
        this.setState({ radius: 0 });
    }

    componentDidMount() {
        if (this.radialId) clearInterval(this.radialId);
        if (this.linearId) clearInterval(this.linearId);
        if (this.spareId) clearTimeout(this.spareId);
        if (this.props.disabled) {
            const step = (100 + shineLenth) / (disabledAnimationDuration * 1000 / 80);
            let loopFunc = () => {
                return setInterval(() => {
                    let newPosX = this.state.posX + step;
                    this.setState({ posX: newPosX });
                    if (newPosX >= 100) {
                        this.setState({ posX: -shineLenth });
                        clearInterval(this.linearId);
                        this.spareId = setTimeout(
                            () => this.linearId = loopFunc(), disabledAnimationDuration * 250);
                    }
                }, 80);
            }
            this.linearId = loopFunc();
        }
    }

    render() {
        const bigBorderClassName = NS + (this.state.radius === 0 ? 'line' : 'line-hover');
        const radientStyle = `radial-gradient(${this.state.radius}em circle, #00000000, #00000099`;
        const linearStyle = `linear-gradient(to right, 
            #00000000 ${this.state.posX}%, 
            #00000099 ${this.state.posX + shineLenth / 2}%,
            #00000000 ${this.state.posX + shineLenth}%)`;
        return (
            <div className={`${this.props.className} ${NS}root`}
                onMouseOver={this.onHover.bind(this)}
                onMouseOut={this.onLeave.bind(this)}
                onClick={this.props.onClick}>
                <div className={`layer child-center`}>
                    <img className={`${NS}back ${this.props.disabled ? NS + 'back-fade' : ''}`}
                        src={ImgTutem} alt={'None'} />
                </div>
                <div className={`layer`} style={{
                    background: `${this.props.disabled ? linearStyle : radientStyle}`
                }} />
                <div className={'layer'}>
                    <svg className={`${NS}big-border`} viewBox="0 0 500 100" preserveAspectRatio={'none'}>
                        <polyline className={bigBorderClassName} points="500 100, 500 0, 0 0" />
                        <polyline className={bigBorderClassName} points="0 0, 0 100, 500 100" />
                    </svg>
                </div>
                <div className={`layer child-center`}>
                    <svg className={`${NS}small-border`} viewBox="0 0 500 100" preserveAspectRatio={'none'}>
                        <polyline className={`${NS}line`} points="500 0, 0 0, 0 30, 20 50, 0 70, 0 100 " />
                        <polyline className={`${NS}line`} points="0 100, 500 100, 500 70, 480 50, 500 30, 500 0 " />
                        <polyline className={`${NS}flash-line`} points="500 0, 0 0, 0 30, 20 50, 0 70, 0 100 " />
                        <polyline className={`${NS}flash-line`} points="0 100, 500 100, 500 70, 480 50, 500 30, 500 0 " />
                    </svg>
                </div>
                <div className={`layer child-center`}>
                    <span>{this.props.text}</span>
                </div>
            </div>
        );
    }
}