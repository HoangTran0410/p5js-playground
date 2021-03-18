
var qt;
var boundary;
var find;
var showWhat;
var particles = [];
var particleCount = 10;
var particleP;
var frameR;

function setup(){
	createCanvas(500, 500);
	rectMode(CENTER);
	noFill();
	noCursor();

	boundary = new Rectangle(width / 2, height / 2, width, height);
	qt = new QuadTree(boundary, 2);

	for(var i = 0; i < particleCount; i++){
		particles.push(new Point(random(width), random(height)));
		qt.insert(particles[i]);
	}

	showWhat = createSelect('Display mode');
	showWhat.option('grid');
	showWhat.option('points');
	showWhat.option('grid+points');
	showWhat.option('points at mouse');

	frameR = createP('');
	particleP = createP('');
}

function draw(){
	if(mouseIsPressed && mouseX < width && mouseY < height){
		var p = new Point(mouseX + random(-3, 3), mouseY + random(-3, 3));
		particles.push(p);
		particleCount++;
	}

	qt = new QuadTree(boundary, 2);
	for(var i = 0; i < particles.length; i++){
		particles[i].update();
		qt.insert(particles[i]);
	}

	background(40);
	qt.show(showWhat.value()); // show 'points' , 'grid' or 'grid+points'

	// Show all point inside rectangle at mouse
	var range = new Rectangle(mouseX, mouseY, 100, 100);
	find = qt.query(range);

	strokeWeight(1);
	stroke(255);
	fill(10);
	//noFill();
	rect(mouseX, mouseY, 100, 100);
	ellipse(mouseX, mouseY, 10, 10);

	strokeWeight(4);
	for(var i = 0; i < find.length; i++){
		stroke(find[i].col);
		point(find[i].x, find[i].y);
	}


	var fr = floor(frameRate());
	frameR.html("Framerate: " + fr);
	particleP.html("Particle: " + particleCount);
}

