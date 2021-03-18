import EventableParticle from '../Particles/EventableParticle.js'

// class Smoke extends EventableParticle {
// 	constructor(config = {}) {

// 		super(config)

// 		const {
// 			position = createVector(0, 0),
// 			radius = ~~random(10, 50),
// 			lifeTime = 0
// 		} = config

// 		this.position = position
// 		this.radius = radius
// 		this.lifeTime = lifeTime
// 	}

// 	update() {

// 	}

// 	display() {

// 	}
// }

class Smoke {
    constructor(x, y, life, r) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.radius = r || floor(random(10, 50));
        this.born = millis();
        this.life = life;
    }

    run() {
        this.show();
    }

    isFinished() {
        return (millis() - this.born > this.life);
    }

    show() {
        this.vel.add(random(-1, 1), random(-1, 1));
        this.pos.add(this.vel);
        this.vel.mult(0.9);

        // show 
        if (this.radius < 100)
            this.radius += random(7) * (30 / (frameRate() + 1));
        var c = map(this.life - (millis() - this.born), 0, this.life, 30, 255);
        fill(c, c * 2);
        noStroke();

        ellipse(this.pos.x, this.pos.y, this.radius * 2);
    }
}