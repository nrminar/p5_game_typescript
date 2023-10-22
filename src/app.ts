import P5, { Vector } from "p5";
// import "p5/lib/addons/p5.sound";
import "./styles.scss";

import KEYCODE from "./Constants/KEYCODE";
import ENV from "./Constants/ENV";

//Essentials
import Bubble from "./Entitites/Bubble";
import Ship from "./Entitites/Ship";
import Asteroid from "./Entitites/Asteroid";
import Laser from "./Entitites/Laser";

//ENEMIES
import EnemyShip from "./Entitites/EnemyShip";
import Experience from "./Entitites/Experience";
import BUFFS from "./Constants/BUFFS";

// document.onkeydown = function(evt) {
//     evt = evt || window.event;
//     var keyCode = evt.keyCode;
//     if (((keyCode >= 37 && keyCode <= 40) || (keyCode === 32)) && (evt.target === document.body)) {
//         return false;
//     }
// }
window.addEventListener('keydown', function(e) {
	if(e.keyCode == 32 && e.target == document.body) {
	  e.preventDefault();
	}
  });

const sketch = (p5: P5) => {
	let counter = 0;

	let bubbles: Bubble[] = [];
	let ship: Ship;
	let enemyShips: EnemyShip[] = [];
	let asteroids: Asteroid[] = [];
	let lasers: Laser[] = [];
	let enemyLasers: Laser[] = []
	let experiences: Experience[] = []
	// let score = 0;
	let lives = 30;

	p5.setup = () => {
		const canvas = p5.createCanvas(ENV.CANVAS_WIDTH, ENV.CANVAS_HEIGHT);
		canvas.parent("app");

		ship = new Ship(p5);

		enemyShips.push(new EnemyShip(p5))

		// for (let i = 0; i < ENV.STARTING_AST_NUM; i++) {
		// 	asteroids.push(new Asteroid(p5));
		// }
		for(let i=0; i<100; i++){
			bubbles.push(new Bubble(p5));
		}
	};
	p5.draw = function () {
		counter++;
		// p5.background('#222222')
		p5.background(0,0,0, 100);
		// p5.background(255,255,255, 40);

		p5.textSize(20);
		p5.text(`Counter: ${counter}`, 20, 20);
		p5.text(`Asteroids: ${asteroids.length}`, 20, 40);
		p5.text(`Lasers: ${lasers.length}`, 20, 60);
		p5.text(`Bubbles: ${bubbles.length}`, 20, 80);
		p5.text(`enemyShips: ${enemyShips.length}`, 20, 100);
		
		p5.text(`ship lives: ${lives}`, 20, 140);
		p5.text(`ship exp: ${ship.exp}`, 20, 160);
		p5.text(`ship buffs: ${ship.buffs}`, 20, 180);

		//BUBBLES
		bubbles.forEach((bubble) => {
			bubble.show()
			bubble.update()
			bubble.edges()
			//kudos - vel gets added to position -> the opposite of ship velocity
			bubble.vel = p5.createVector(ship.vel.x * -1, ship.vel.y * -1)
		})
	
		//ASTEROIDS
		asteroids.forEach((asteroid, index) => {
			asteroid.show();
			asteroid.update();
			asteroid.edges();

			let distance = p5.dist(ship.pos.x, ship.pos.y, asteroid.pos.x, asteroid.pos.y)

			if (distance < ENV.PULL_DIST && distance > ENV.MIN_RELEASE_DIST) {
				ship.pull(asteroid, 1)
			}
			if ((distance < (ship.r + asteroid.r)) && (asteroid.r >= ship.r)) {
				lives--;
				asteroids.splice(index, 1);
				asteroids.push(new Asteroid(p5));
			}
		})
	
		//LASERS
		//put a mod of counter on this for attack speed
		// estimate 60 fps so if attack speed 10 then 6 bullets per second
		// 1 per second is attack speed 60
		// PERK ADD HERE
		const attackSpeed = () => {
			const attackSpeedBuffs = ship.buffs.filter((buff) => buff === BUFFS.ATTACK_SPEED)
			if (!attackSpeedBuffs.length) return 10

			return 10 - attackSpeedBuffs.length
		}
		if (counter % attackSpeed() === 0) {
			lasers.push(new Laser(p5, ship.pos, ship.dir));
		}

		lasers.forEach((laser, laserIndex) => {
			laser.show()
			laser.update()
			if (laser.edges()) {
				lasers.splice(laserIndex, 1)
				return;
			}
			asteroids.forEach((asteroid, asteroidIndex) => {
				if (laser.hits(asteroid)) {
					if (asteroid.r > ENV.AST_SPLIT_R) {
						let asteroidChildren = asteroid.split();
						asteroids.push(...asteroidChildren)
					} else {
						asteroids.push(new Asteroid(p5))
					}
					asteroids.splice(asteroidIndex, 1);
					lasers.splice(laserIndex, 1);
				}
			})
			enemyShips.forEach((enemyShip, enemyShipIndex) => {
				if (laser.hits(enemyShip)) {
					experiences.push(new Experience(p5, enemyShip.pos))
					enemyShips.splice(enemyShipIndex, 1);
					lasers.splice(laserIndex, 1);
				}
			})
		})

		enemyLasers.forEach((laser, laserIndex) => {
			laser.show()
			laser.update()
			if (laser.edges()) {
				enemyLasers.splice(laserIndex, 1)
				return;
			}
			if (laser.hits(ship)) {
				lives--
				enemyLasers.splice(laserIndex, 1)
				return
			}
		})

		//ENEMIES
		if (counter % (150 - ship.level * 10) === 0) {
			enemyShips.push(new EnemyShip(p5))
		}

		enemyShips.forEach((enemyShip) => {
			enemyShip.show(ship);
			enemyShip.update(enemyLasers, counter);
			enemyShip.edges();
		})

		//EXP
		experiences.forEach((experience, experienceIndex) => {
			experience.show()
			experience.update()
			experience.edges()
			
			let distance = p5.dist(ship.pos.x, ship.pos.y, experience.pos.x, experience.pos.y)

			if (distance < 1000 && distance > ENV.MIN_RELEASE_DIST) {
				ship.pull(experience, 100)
			}
			if (experience.hits(ship)) {
				ship.exp++
				experiences.splice(experienceIndex, 1);
			}
		})

		//SHIP
		ship.show();
		ship.turn();
		ship.update();
		ship.edges();
		ship.checkExp();
	
		//END THE GAME
		if (lives < 1) {
			p5.noLoop();
			if (window.confirm(`You lost. Would you like to play again?`)) {
				window.location.reload();
			} else {
				console.log('no new game')
			}
		}
	}
	p5.keyPressed = function () {
		switch (p5.keyCode) {
			case KEYCODE.RIGHT:
				ship.setRotation(0.1);
				break;
			case KEYCODE.LEFT:
				ship.setRotation(-0.1);
				break;
			case KEYCODE.UP:
				ship.thrust(true);2
				break;
			// ESCAPE: PAUSE GAME : TODO BETTER THAN THIS. menu system
			// use redraw here to rerender but start main loop on selection
			case KEYCODE.ESCAPE:
				if (!p5.isLooping()) break;
				let button;
				button = p5.createButton('resume');
				button.position(p5.width / 2, p5.height / 2);
				button.class('card')
				p5.noLoop()
				button.mousePressed(() => {
					p5.loop()
					button.remove()
				});
				break;
			default:
				break;
		}
	}
	p5.keyReleased = function () {
		switch (p5.keyCode) {
			case KEYCODE.RIGHT:
			case KEYCODE.LEFT:
				ship.setRotation(0);
				break;
			case KEYCODE.UP:
				ship.thrust(false);
				break;
			default:
				break;
		}
	}
};

new P5(sketch);
