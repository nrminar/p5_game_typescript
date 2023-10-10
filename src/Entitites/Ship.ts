import P5, { Vector } from "p5";
import ENV from "../Constants/ENV"

export default class Ship {
	p5: P5;
	pos: P5.Vector;
    r: number;
    dir: number;
    rotation: number;
    vel: P5.Vector;
    isAcc: boolean;
    mass: number;
    rs: number;
    
    constructor(p5: P5) {
        this.p5 = p5;
        this.pos = p5.createVector(p5.width / 2, p5.height / 2);
        this.r = 15;
        this.dir = 0;
        this.rotation = 0;
        this.vel = p5.createVector(0, 0)
        this.isAcc = false;
        this.mass = 50;

        this.rs = (2 * ENV.ATTRACT_ACC * this.mass / (ENV.ESCAPE_ACC * ENV.ESCAPE_ACC))
    }
    show() {
        const p5 = this.p5;

        p5.push();
        p5.stroke(245)
        p5.fill('rgba(0, 255, 100, 0.5)');
        p5.translate(this.pos.x, this.pos.y);
        p5.rotate(this.dir + p5.PI / 2);
        p5.triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
        p5.pop();
    }
    setRotation(angle) {
        this.rotation = angle;
    }
    turn() {
        this.dir += this.rotation;
    }
    update() {
        if (this.isAcc) {
            this.acc();
        }
        this.pos.add(this.vel);
        this.vel.mult(0.99)
    }
    acc() {
        let force = Vector.fromAngle(this.dir);
        force.mult(0.1);
        this.vel = Vector.add(this.vel, force);
    }
    thrust(boolean) {
        this.isAcc = boolean;
    }
    pull(asteroid) {
        let force = Vector.sub(this.pos, asteroid.pos);
        let r = force.mag();
        let fg = this.mass * ENV.ATTRACT_ACC / (r * r);
        force.setMag(fg);
        asteroid.vel.add(force);
        asteroid.vel.limit(ENV.ESCAPE_ACC);
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
}