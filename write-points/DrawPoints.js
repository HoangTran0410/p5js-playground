var dots = [];
var index;
var timeNow = 0;
var timePre = 0;

function setup() {
	createCanvas(windowWidth, windowHeight).position(0, 0);

	textAlign(CENTER, CENTER);
	textSize(20);
}

function draw() {
	background(51);
	timeNow = millis();

	if(dots.length == 0) {
		fill(255);
		noStroke();
		text("Draw anything. Hit 'Space' to CLEAR", width / 2, height / 2);
	}

	if(mouseIsPressed)
	if (dist(mouseX, mouseY, pmouseX, pmouseY) > 3 && timeNow > timePre + 40) {
		if(!dots[index]) dots[index] = [];
		timePre = timeNow;
		dots[index].push(new Dot(mouseX, mouseY, v(mouseX - pmouseX, mouseY - pmouseY).div(7), [index, dots[index].length]));
	}

	for(var j = 0; j < dots.length; j++){

		beginShape(TRIANGLE_STRIP);
		for (var i = 0; i < dots[j].length; i++) {
			vertex(dots[j][i].pos.x, dots[j][i].pos.y);
			dots[j][i].show2();
		}
		fill(100, 50);
		strokeWeight(1);
		endShape();

	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
	// dots = [];
	index = dots.length;
}

function keyPressed(){
	if(keyCode == 32){
		 dots = [];
	}
}

function Dot(x, y, vel, at) {
	this.pos = v(x, y);
	this.vel = vel;
	this.col = color(r(255), r(255), r(255));
	this.at = at;

	this.show = function() {
		var old = this.pos.copy();
		this.pos.add(this.vel);
		this.vel.mult(0.96);

		var vec = p5.Vector.sub(this.pos, old);
		drawArrow(old, vec, this.col);

		// if (this.vel.mag() < 0.05) {
		// 	dots[this.at[0]].splice(this.at[1], 1);
		// }
	}

	this.show2 = function(){
		this.pos.add(this.vel);
		this.vel.mult(0.93);

		strokeWeight(7);
		stroke(this.col);
		point(this.pos.x, this.pos.y);

		// if (this.vel.mag() < 0.05) {
		// 	dots[this.at[0]].splice(this.at[1], 1);
		// }	
	}
}

function drawArrow(base, vec, myColor) {
	push();

	stroke(myColor);
	fill(myColor);

	strokeWeight(3);
	translate(base.x, base.y);
	// line(0, 0, vec.x, vec.y);

	rotate(vec.heading());
	var arrowSize = 7;
	translate(vec.mag() - arrowSize, 0);
	triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);

	pop();
}

function v(x, y) {
	return createVector(x, y);
}

function r(n) {
	return random(n);
}