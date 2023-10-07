import P5, { Vector } from "p5";

export default class Laser {
	p5: P5;
	pos: P5.Vector;
    vel: P5.Vector;

    constructor(p5: P5, start: Vector, angle: number) {
        this.p5 = p5
        this.pos = p5.createVector(start.x, start.y);
        this.vel = Vector.fromAngle(angle);
        this.vel.mult(10);
    }
    show() {
        const p5 = this.p5;

        p5.push();
        p5.stroke(255, 0, 0);
        p5.strokeWeight(4);
        p5.point(this.pos.x, this.pos.y);
        p5.pop();
    }
    update() {
        this.pos.add(this.vel);
    }
    hits(asteroid) {
        const p5 = this.p5;

        const d = p5.dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y)
        if (d < asteroid.r) {
            return true;
        } else {
            return false;
        }
    }
}