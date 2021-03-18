var mouse = null;
var mouseIndex;
var player;

function setup() {
	createCanvas(700, 500);
	createGui();
  	b2newWorld(60, v(0, 9.8));
  	player = new Player();

  	player.create(width/2, height/2, 30, 30);
  	createWall(width, 2, width, 5) // Top
  	createWall(width / 2, height - 2, width, 5); // Down
  	createWall(0, height/2, 10, height); // Left
  	createWall(width-1, height*2/3, 10, height); // Right

 	pyramid(5, width*0.5, height-20, 30, 50); 

 	noCursor();
}

function draw() {
	background(227, 255-guiControl.blur);

	player.move('around');
	if(keyIsDown(32)) // Space key
		player.fire();

	if(keyIsDown(81)){ // Q key
		deleteObject();
	}

	if(!guiControl.pause)
		b2Update(); 
	b2Draw(true);

	if (mouse != null) mouse.setTarget(v(mouseX, mouseY), mouseIndex);

	displayMouse();
}

function keyPressed(){
	if(keyCode == 66){ // B key
		var b = createShape('box', mouseX, mouseY, 50, 50, guiControl.density, guiControl.friction, guiControl.bounce);
		b.color = color(120, 255, 140);
		b.display(attr1, 0);
	} else if(keyCode == 67){ // C key
		var b = createShape('circle',mouseX, mouseY, 30, 30, guiControl.density, guiControl.friction, guiControl.bounce);
		b.color = color(255, 120, 130);
		b.display(attr1, 0);
	} else if(keyCode == 80){ // P key
		guiControl.playOrPasue();
	} else if(keyCode == 78){ // N key
		pyramid(3, width*3/4, height - 10, 16, 50); 
	} else if(keyCode == 82){ // R key
		player.create(width/2, height/2, 30, 30);
	} else if(keyCode == 87){ 
		player.move('jump');
	} else if(keyCode == 32) { // Space
		player.fire();
	}
}

function mousePressed() {
	var b = b2GetBodyAt(mouseX, mouseY);
	if (b == null) return;
	mouse = b;
	mouseIndex = b2Joint("mouse", null, b, {xy: v(mouseX, mouseY)});
}

function mouseReleased() {
	if (mouse != null) mouse.destroyJoint();
	mouse = null;
}

function deleteObject() {
	var b = b2GetBodyAt(mouseX, mouseY);
	if (b == null) return;
	b.destroy();
}

function displayMouse(){
	if(mouseIsPressed){
		fill(255, 50, 50, 200);
		ellipse(mouseX, mouseY, 15, 15);
	}else{
		fill(51, 51, 51, 100);
		ellipse(mouseX, mouseY, 5, 5);
	}
}
