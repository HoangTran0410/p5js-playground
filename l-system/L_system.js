// use for mouse drag
var delX; 	
var delY;

// Graphic
// save first value of windowWidth windowHeight
var winX;
var winY;
// draw graphic from this position 
var grPosX;	
var grPosY;
// start drawing sentence from this position
var beginX;
var beginY;
// create graphic
var gr;
var grStrokeW = 3;
// create rule
var Rule = [];

function setup(){
	winX = windowWidth - 10;
	winY = windowHeight - 10;

	// start drawing from the middle of the screen
	grPosX = -winX*0.5;
	grPosY = -winY*0.5;
	beginX = winX;
	beginY = winY;

	createCanvas(winX, winY);
	pixelDensity(1);
	gr = createGraphics(winX*2, winY*2);
	gr.pixelDensity(1);
	gr.background(LsystemGui.colorB);
	gr.stroke(LsystemGui.color);
	gr.strokeWeight(grStrokeW);

	// create GUI
		createGui();

	// draw first time
	LsystemGui.runExample();
}

function draw(){
	if(keyIsDown(69)){	// E key
		LsystemGui.angle--;
		draw_Lsystem();
	}
	if(keyIsDown(82)){ 	// R key
		LsystemGui.angle++;
		draw_Lsystem();
	}
}

function keyPressed(){
	// G key
	if(keyCode == 71)
		LsystemGui.generate();
	// F key
	else if(keyCode == 70){
		LsystemGui.generation -= 2;
		if(LsystemGui.generation < 1) LsystemGui.generation = 1;
		LsystemGui.generate();
	}
	else if(keyCode == ENTER){
		LsystemGui.generation--;
		LsystemGui.generate();
	}
}

function mousePressed() {
	if(keyIsDown(CONTROL)){
		delX = mouseX - beginX;
		delY = mouseY - beginY;
	}else {
		delX = mouseX - grPosX;
		delY = mouseY - grPosY;
	}
}

function mouseDragged(){
	if(keyIsDown(CONTROL)){
		// move begin draw position
		beginX = mouseX - delX;
		beginY = mouseY - delY;
		draw_Lsystem();
	}else{
		// move image positon 
		grPosX = mouseX - delX;
		grPosY = mouseY - delY;
		// redraw
		background(55);
		image(gr, grPosX, grPosY, winX*2, winY*2);
	}
}

function mouseWheel(event){
	LsystemGui.len -= event.delta / 66;
	if(LsystemGui.len < 0) LsystemGui.len = 0;
	draw_Lsystem();
}

function generate(){
	var nextsentence = "";
	for(var i = 0; i < LsystemGui.sentence.length; i++) {
		var current = LsystemGui.sentence.charAt(i);
		var found = false;
		for (var j = 0; j < Rule.length; j++) {
			if(current == Rule[j].a) {
				found = true;
				nextsentence += Rule[j].b;
				break;
			}
		}
		if(!found)
			nextsentence += current;
	}

	LsystemGui.sentence = nextsentence;
	draw_Lsystem();
}

function draw_Lsystem(){
	gr.background(LsystemGui.colorB);
	gr.resetMatrix();
	gr.translate(beginX, beginY);
	gr.strokeWeight(grStrokeW);
	var Col = 0;
	var colo = [];
	for(var i = 0; i < LsystemGui.sentence.length ; i++){
		var current = LsystemGui.sentence.charAt(i);
		if(Col > 0 && current != '>') {
			colo[Col - 1] = current*10/100*255;
			if(Col >= 3){
				colorMode(HSB);
				gr.stroke(colo[0], colo[1], colo[2], 200);
				colorMode(RGB);
				Col = 0;
			}
			else Col++;
		} else if(isDrawForwardKey(current)) {
			gr.line(0, 0, 0, -LsystemGui.len);
			gr.translate(0, -LsystemGui.len);
		} else if(current == LsystemGui.moveForward){
			gr.translate(0, -LsystemGui.len);
		} else if(current == "+") {
			gr.rotate(radians(LsystemGui.angle));
		} else if(current == "-") {
			gr.rotate(-radians(LsystemGui.angle));
		} else if(current == "[") {
			gr.push();
		} else if(current == "]") {
			gr.pop();
		} else if(current == '{') {
			grStrokeW ++ ;
			if(grStrokeW > 20) grStrokeW = 20;
			gr.strokeWeight(grStrokeW);
		} else if(current == '}') {
			grStrokeW --;
			if(grStrokeW <= 0) grStrokeW = 1;
			gr.strokeWeight(grStrokeW);
		} else if(current == '|'){
			LsystemGui.angle += 180;
		} else if(current == '<'){
			Col = 1;
		} else if(current == '>'){
		  	gr.stroke(LsystemGui.color);
		}
	}
	image(gr, grPosX, grPosY, winX*2, winY*2);
}

