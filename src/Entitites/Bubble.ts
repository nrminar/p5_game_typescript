import P5, { Vector } from "p5";

export default class Bubble {
	p5: P5;
	pos: Vector;
    r: number;
    vel: Vector
    color: string

    constructor(p5: P5) {
        this.p5 = p5
        this.color = 'rgba(100, 100, 0, 0.05)';
        this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
        this.r = p5.random(5, 50);
        this.vel = p5.createVector(0, 0).setHeading(0)
    }
    show(){
        const p5 = this.p5;

        p5.stroke('rgba(100 , 100, 0, 0.5)');
        p5.fill(this.color);
        p5.ellipse(this.pos.x, this.pos.y, this.r/2, this.r/2);
    }
    update(){
        this.pos.add(this.vel);
    }
    edges(){
        const p5 = this.p5;

        if(this.pos.x > p5.width + this.r){
            this.pos.x = -this.r
        }else if(this.pos.x < -this.r){
            this.pos.x = p5.width + this.r
        }
        if(this.pos.y > p5.height + this.r){
            this.pos.y = -this.r
        }else if(this.pos.y < -this.r){
            this.pos.y = p5.height + this.r
        }
    }
}