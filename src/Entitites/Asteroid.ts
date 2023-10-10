import P5, { Vector } from "p5";
import ENV from "../Constants/ENV"

export default class Asteroid {
	p5: P5;
	pos: P5.Vector;
    r: number;

    total: number;
    offset: number[];
    vel: Vector;
    
    constructor(p5: P5, pos?: P5.Vector,  r?: number) {
        this.p5 = p5;

        if (pos) {
            this.pos = pos.copy();
            this.r = r
        } else {
            this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
            this.r = p5.random(15, 50);
        }
        this.total = p5.floor(p5.random(5, 15));
        this.offset = [];
        for (let i = 0; i < this.total; i++) {
            this.offset[i] = p5.random(-this.r * 0.5, this.r * 0.5);
        }
        this.vel = Vector.random2D();
    }
    show() {
        const p5 = this.p5;

        p5.push();
        p5.fill(255);
        p5.translate(this.pos.x, this.pos.y)

        p5.beginShape();
        for (let i = 0; i < this.total; i++) {
            let angle = p5.map(i, 0, this.total, 0, p5.TWO_PI)
            var x = (this.r + this.offset[i]) * p5.cos(angle);
            var y = (this.r + this.offset[i]) * p5.sin(angle);
            p5.vertex(x, y);
        }
        p5.endShape(p5.CLOSE);

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
    split() {
        const p5 = this.p5;

        let newA = [];
        for (let i = 0; i < 2; i++) {
            // newA.push(new Asteroid(p5, this.dt, this.pos, this.r / 2))
        }
        return newA;
    }
}