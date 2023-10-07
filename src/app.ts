import P5 from "p5";
import "p5/lib/addons/p5.dom";
// import "p5/lib/addons/p5.sound";
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
	let dt = .1;

	const upInput = 87
	const leftInput = 68
	const rightInput = 65

	p5.setup = () => {
		const canvas = p5.createCanvas(1920, 1080);
		canvas.parent("app");

		p5.background("white");

		ship = new Ship(p5);
		for (let i = 0; i < 50; i++) {
			asteroids.push(new Asteroid(p5, dt));
		}
	};

	p5.draw = function () {
		counter++;
		p5.background(200);
		p5.textSize(20);
		p5.text(`Counter: ${counter}`, 20, 20);
		p5.text(`Asteroids: ${asteroids.length}`, 20, 40);
		// text(`Lives: ${lives}`, 40, 40);
	
		//ASTEROIDS
		asteroids.forEach((asteroid, index) => {
			asteroid.show();
			asteroid.update();
			asteroid.edges();
	
			let pullDistance = 800
			let releaseWhenCloseDistance = 40
			let distance = p5.dist(ship.pos.x, ship.pos.y, asteroid.pos.x, asteroid.pos.y)
			if (distance < pullDistance && distance > releaseWhenCloseDistance) {
				ship.pull(asteroid)
			}
			if ((distance < (ship.r + asteroid.r)) && (asteroid.r >= ship.r)) {
				lives--;
				asteroids.splice(index, 1);
				asteroids.push(new Asteroid(p5, dt));
			}
		})
		lasers.push(new Laser(p5, ship.pos, ship.dir));
	
		//LASERS
		lasers.forEach((laser, laserIndex) => {
			laser.show()
			laser.update()
			asteroids.forEach((asteroid, asteroidIndex) => {
				if (laser.hits(asteroid)) {
					if (asteroid.r > 20) {
						let asteroidChildren = asteroid.split();
						asteroids.push(...asteroidChildren)
					} else {
						asteroids.push(new Asteroid(p5, dt))
					}
					asteroids.splice(asteroidIndex, 1);
					lasers.splice(laserIndex, 1);
				}
			})
		})
	
		//END THE GAME
		if (lives < 1) {
			p5.noLoop();
			if (window.confirm(`You lost. Would you like to play again?`)) {
				window.location.reload();
			} else {
				console.log('no new game')
			}
		}
		ship.show();
		ship.turn();
		ship.update();
		ship.edges();
	}
	p5.keyPressed = function () {
		if (p5.key === ' ') {
			lasers.push(new Laser(p5, ship.pos, ship.dir));
		}
		//right
		if (p5.keyCode === leftInput) {
			ship.setRotation(0.1);
			//left
		} else if (p5.keyCode === rightInput) {
			ship.setRotation(-0.1)
			//up
		} else if (p5.keyCode === upInput) {
			ship.thrust(true);
		}
	}
	p5.keyReleased = function () {
		//right || left
		if (p5.keyCode === rightInput || p5.keyCode === leftInput) {
			ship.setRotation(0);
		}
		//up
		if (p5.keyCode === upInput) {
			ship.thrust(false);
		}
	}
};

new P5(sketch);
