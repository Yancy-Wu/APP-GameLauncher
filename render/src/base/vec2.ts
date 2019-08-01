export default class Vec2 {
    x: number;
    y: number;
    constructor(x:number, y: number){
        this.x = x;
        this.y = y;
    }
    vertical = () => new Vec2(this.y, -this.x);
    add = (v: Vec2) => new Vec2(this.x + v.x, this.y + v.y);
    minus = (v: Vec2) => new Vec2(this.x - v.x, this.y - v.y);
    cross = (v: Vec2) => this.x * v.y - this.y * v.x;
    dot = (v: Vec2) => this.x * v.x + this.y * v.y;
    times = (n: number) => new Vec2(this.x * n, this.y * n);
    mag = () => Math.sqrt(this.x * this.x + this.y * this.y);
    copy = () => new Vec2(this.x, this.y);
    normX = () => new Vec2(1, this.y / this.x);
    projAt = (v: Vec2) => this.dot(v) / (this.mag() * v.mag());
    norm(): Vec2{
        let m = this.mag();
        return new Vec2(this.x / m, this.y / m);
    }
}
