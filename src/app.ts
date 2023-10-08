import P5 from "p5";
import "p5/lib/addons/p5.dom";
// import "p5/lib/addons/p5.sound";
import "./styles.scss";

import KEYCODE from "./Constants/KEYCODE"
import ENV from "./Constants/ENV"
import Ship from "./Entitites/Ship";
import Asteroid from "./Entitites/Asteroid";
import Laser from "./Entitites/Laser"


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

	let ship: Ship;
	let asteroids: Asteroid[] = [];
	let lasers: Laser[] = [];
	// let score = 0;
	let lives = 3;

	p5.setup = () => {
		const canvas = p5.createCanvas(ENV.CANVAS_WIDTH, ENV.CANVAS_HEIGHT);
		canvas.parent("app");

		ship = new Ship(p5);
		for (let i = 0; i < ENV.STARTING_AST_NUM; i++) {
			asteroids.push(new Asteroid(p5));
		}
	};
	p5.draw = function () {
		counter++;
		p5.background('#222222')
		
		p5.textSize(20);
		p5.text(`Counter: ${counter}`, 20, 20);
		p5.text(`Asteroids: ${asteroids.length}`, 20, 40);
		p5.text(`Lasers: ${lasers.length}`, 20, 60);
	
		//ASTEROIDS
		asteroids.forEach((asteroid, index) => {
			asteroid.show();
			asteroid.update();
			asteroid.edges();

			let distance = p5.dist(ship.pos.x, ship.pos.y, asteroid.pos.x, asteroid.pos.y)

			if (distance < ENV.PULL_DIST && distance > ENV.MIN_RELEASE_DIST) {
				ship.pull(asteroid)
			}
			if ((distance < (ship.r + asteroid.r)) && (asteroid.r >= ship.r)) {
				lives--;
				asteroids.splice(index, 1);
				asteroids.push(new Asteroid(p5));
			}
		})
	
		//LASERS

		//put a mod of counter on this for attack speed
		lasers.push(new Laser(p5, ship.pos, ship.dir));

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
		})

		//SHIP
		ship.show();
		ship.turn();
		ship.update();
		ship.edges();
	
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
				ship.thrust(true);
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
