class AI_Snake extends Snake {
	constructor(x, y, d, len) {
		super(x, y, d, len);
		this.nextPoint = createVector(random(width), random(height));
	}

	move() {
		if(p5.Vector.dist(this.segments[0].pos, this.nextPoint) < this.size*.75) {
			this.nextPoint = createVector(random(width), random(height));
			if(random(1) > 0.7){
				var pos = this.segments[this.segments.length - 1].pos;
				this.addSegment(pos.x, pos.y);
				if(this.segments.length > 20)
					this.reset();
			}

		} else this.pos = p5.Vector.lerp(this.pos, this.nextPoint, 0.1);

		fill(255, 255, 0);
		text('$', this.nextPoint.x, this.nextPoint.y);
	}

	run() {
		this.move();
		super.run();
	}
}