import P5, { Vector } from "p5";
import ENV from "../Constants/ENV"

export default class Experience {
	p5: P5;
	pos: P5.Vector;
    r: number;
    vel: Vector;
    
    constructor(p5: P5, pos?: P5.Vector) {
        this.p5 = p5;

        if (pos) {
            this.pos = pos.copy();
            this.r = 15
        }
        this.vel = p5.createVector(0, 0);
    }
    show() {
        const p5 = this.p5;

        p5.push();
        p5.stroke('rgba(100 , 255, 255, 1)');
        p5.strokeWeight(10);
        p5.point(this.pos.x, this.pos.y);
        p5.pop();
    }
    update() {
        this.pos = Vector.add(this.pos, this.vel);
        let DeltaV = this.vel.copy();
        DeltaV.mult(ENV.ADELTAV);
        this.pos = Vector.add(this.pos, DeltaV);
    }
    edges() {
        const p5 = this.p5;

        if (this.pos.x > p5.width + this.r) {
            this.pos.x = -this.r
        } else if (this.pos.x < -this.r) {
            this.pos.x = p5.width + this.r
        }
        if (this.pos.y > p5.height + this.r) {
            this.pos.y = -this.r
        } else if (this.pos.y < -this.r) {
            this.pos.y = p5.height + this.r
        }
    }
    hits(target) {
        const p5 = this.p5;

        const d = p5.dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y)
        if (d < target.r) {
            return true;
        } else {
            return false;
        }
    }
}