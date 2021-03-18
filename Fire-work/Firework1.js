var fireworks = [];
var gravity;
var numParticle = 50;
var life = 255;
var dragmouse = false;
var mouse_preX;
var mouse_preY;
var high = 100;

function setup() {
	createCanvas(windowWidth - 5, windowHeight - 5);
	gravity = createVector(0, 0.12);
	colorMode(RGB);
	background(0);
}

function draw() {
	if(fireworks.length === 0)
		background(0, 0, 0);
	else
		background(0, 0, 0, 25);

	if(dragmouse){
		line(mouse_preX, mouse_preY, mouseX, mouseY);
	}


	if(random(1) < 0.05){
		var gra = random(1, 10);
		fireworks.push(new Firework(0, 0, 0));
	}

	for(var i = fireworks.length - 1; i >= 0  ; i--){
		fireworks[i].update();
		fireworks[i].show();
		if(fireworks[i].done()){
			fireworks.splice(i, 1);
		}
	}
}

function Particle(x, y, col, boom, velInput) {
	this.boom = boom;
	this.pos = createVector(x, y);
	if(this.boom){
		this.vel = new ExplodeMode("graOn");
	}
	else{
		if(velInput){
			this.vel = velInput;
		}else {
			var dirX;
			if(x < width / 2) {dirX = random(0, 5);}
			else {dirX = random(-5, 0);}
			this.vel = createVector(dirX, random(-12, -8));
		}
	}
	this.acc = createVector(0, 0);
	this.col = col;
	this.lifespan = life;

	this.done = function(){
		if(this.lifespan < 0)
			return true;
		else return false;
	}

	this.applyForce = function(force){
		this.acc.add(force);
	}

	this.update = function(){
		if(this.boom){
			this.vel.mult(0.9);
			this.lifespan -= 5;
		}
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.show = function(){
		if(this.boom){
			stroke(this.col.r, this.col.g, this.col.b, this.lifespan);
			strokeWeight(5);
		}
		else{
			stroke(this.col.r, this.col.g, this.col.b);
			strokeWeight(4);
		}
		point(this.pos.x, this.pos.y);
	}
}

function Firework(x, y, velInput) {

	this.col ={
		r: random(255),
		g: random(255),
		b:random(255)
	};

	this.posx;
	this.posy;
	if(x != 0 && y != 0){
		this.posx = x;
		this.posy = y;
	}else {
		this.posx = random(width);
		this.posy = height;
	}
	if(velInput)
		this.firework = new Particle(this.posx, this.posy, this.col, false, velInput);
	else
		this.firework = new Particle(this.posx, this.posy, this.col, false, 0);

	this.exploded = false;
	this.particles = [];

	this.done = function(){
		if(this.exploded && this.particles.length === 0){
			return true;
		}
		else{ 
			return false;
		}
	}

	this.update = function() {
		if(!this.exploded){
			this.firework.applyForce(gravity);
			this.firework.update();
			if(this.firework.vel.y >= 0){
				this.exploded = true;
				this.explode();
			}
		}

		for(var i = this.particles.length - 1; i >= 0; i--){
			this.particles[i].applyForce(gravity);
			this.particles[i].update();
			if(this.particles[i].done()){
				this.particles.splice(i, 1);
			}
		}
	}

	this.explode = function(){
		for(var i = 0; i < numParticle; i++){
			var p = new Particle(this.firework.pos.x, this.firework.pos.y, this.col, true, 0);
			this.particles.push(p);
		}
	}

	this.show = function(){
		if(!this.exploded){
			this.firework.show();
		}
		else{
			for(var i = this.particles.length - 1; i >= 0; i--){
				this.particles[i].show();
			}
		}
	}
}

function ExplodeMode(mode){
	if(mode === "graOn"){
		this.velOut = p5.Vector.random2D();
		this.velOut.mult(random(1, 15));
		return this.velOut; 
	}else if(mode === "circle"){
		this.velOut = p5.Vector.random2D();
		this.velOut.mult(10);
		return this.velOut; 
	}

	// this.GravityOff = function(){

	// }
}

function mousePressed(){
	mouse_preX = mouseX;
	mouse_preY = mouseY;
}

function mouseDragged(){
	dragmouse = true;
}

function mouseReleased(){
	if(dragmouse){
		dragmouse = false;
		var dir = createVector((mouse_preX - mouseX)*0.1, (mouse_preY - mouseY)*0.1);
		fireworks.push(new Firework(mouseX, mouseY, dir));
	}else{
		fireworks.push(new Firework(mouseX, mouseY, 0));
	}
}

function windowResized(){
	setup();
}

