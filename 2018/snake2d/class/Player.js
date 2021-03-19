class Player extends Snake {

	constructor(x, y, d, len) {
		super(x, y, d, len);
	}

	control() {
		this.pos = createVector(mouseX, mouseY);
		
		fill(150, 50);
		ellipse(mouseX, mouseY, 30);
	}

	run() {
		this.control();
		super.run();
	}
}