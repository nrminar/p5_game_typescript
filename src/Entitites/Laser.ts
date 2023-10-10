import P5, { Vector } from "p5";

export default class Laser {
	p5: P5;
	pos: P5.Vector;
    vel: P5.Vector;
    color: string

    constructor(p5: P5, start: Vector, angle: number, color?: string) {
        this.p5 = p5
        this.pos = p5.createVector(start.x, start.y);
        this.vel = Vector.fromAngle(angle);
        this.vel.mult(10);
        this.color = color || 'rgba(255 , 255, 255, 1)'
    }
    show() {
        const p5 = this.p5;

        p5.push();
        p5.stroke(this.color);
        p5.strokeWeight(10);
        p5.point(this.pos.x, this.pos.y);
        p5.pop();
    }
    update() {
        this.pos = Vector.add(this.pos, this.vel);
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
    edges() {
        const p5 = this.p5;

        return this.pos.x > p5.width || this.pos.x < 0 || this.pos.y > p5.height ||this.pos.y < 0
    }
}