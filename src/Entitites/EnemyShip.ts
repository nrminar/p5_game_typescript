import P5, { Vector } from "p5";
import Ship from "./Ship";
import Laser from "./Laser";

export default class EnemyShip {
	p5: P5;
	pos: P5.Vector;
    r: number;
    dir: number;
    rotation: number;
    vel: P5.Vector;
    isAcc: boolean;
    lifeTime: number;
    // angleToPlayer: number;
    angle: number;
    
    constructor(p5: P5, ship: Ship) {
        this.p5 = p5;
        this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
        this.r = 30;
        this.dir = 0;
        this.rotation = 0;
        this.vel = p5.createVector(0, 0)
    }
    show(ship: Ship) {
        this.lifeTime++;

        const p5 = this.p5;

        let dx = ship.pos.x - this.pos.x
        let dy = ship.pos.y - this.pos.y

        this.angle = p5.atan2(dy, dx)

        this.pos.x = ship.pos.x - p5.cos(this.angle) * 300
        this.pos.y = ship.pos.y - p5.sin(this.angle) * 300

        p5.fill(255, 0, 100);
        p5.ellipse(this.pos.x, this.pos.y, this.r, this.r)
    }
    turn(ship: Ship) {
    }
    update(ship: Ship, lasers: Laser[], counter: number) {
        const p5 = this.p5;
		const attackSpeed = 30
		if (counter % attackSpeed === 0) {

            //3rd argument - what do i pass here
			lasers.push(new Laser(p5, this.pos, this.angle, 'rgba(255, 0, 100, 1)'));
		}
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