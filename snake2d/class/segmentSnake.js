class SegmentSnake {
	constructor(x, y, d) {
		this.pos = createVector(x, y);
		this.size = d;
		this.color = [random(255), random(255), random(255)];
	}

	show() {
		noStroke();
		fill(this.color);
		ellipse(this.pos.x, this.pos.y, this.size);
	}

	follow(target) {
		if(p5.Vector.dist(this.pos, target.pos) > this.size * .75) {
			this.pos = p5.Vector.lerp(this.pos, target.pos, 0.1);
		}
	}
}