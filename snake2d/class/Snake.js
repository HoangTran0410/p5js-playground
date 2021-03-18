class Snake {
	constructor(x, y, d, len) {
		this.pos = createVector(x, y);
		this.size = d;
		this.segments = [];

		for(var i = 0; i < len; i++)
			this.addSegment();
	}

	addSegment(x, y) {
		this.segments.push(new SegmentSnake(x||random(width), y||random(height), this.size));
	}

	show() {
		textAlign(CENTER, CENTER);
		textSize(20);
		for(var i = this.segments.length - 1; i >= 0; i--){
			this.segments[i].show();

			fill(0); noStroke();
			text(i+1, this.segments[i].pos.x, this.segments[i].pos.y);
		}
	}

	update() {
		this.segments[0].follow(this);
		for(var i = 1; i < this.segments.length; i++)
			this.segments[i].follow(this.segments[i-1]);
	}

	reset() {
		this.segments = [];
		this.addSegment();
	}

	run() {
		this.update();
		this.show();
	}
}