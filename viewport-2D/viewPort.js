var Viewport;
var minimap;
var player;
var enemys= [];
var walls = [];
var quad;
var AppGui;

function ResetGame(){
	Viewport = createVector(0, 0);

	//minimap
	var wMiniMap, hMiniMap;
	if(newGui.wMap >= newGui.hMap){
		wMiniMap = width/4;
		hMiniMap = map(newGui.hMap, 0, newGui.wMap, 0, width/4);
	} else {
		hMiniMap = height/4;
		wMiniMap = map(newGui.wMap, 0, newGui.hMap, 0, height/4);
	}
	minimap = new MiniMap(10, height-hMiniMap-10, wMiniMap, hMiniMap);

	//character
	player = new Character(0, 0);
	for(var i = 0; i < 10; i++){
		enemys[i] = new Enemy(0, 0);
	}

	//quadtree
	var bound = new Rectangle(newGui.wMap/2, newGui.hMap/2, newGui.wMap, newGui.hMap); 
	quad = new QuadTree(bound, 10);

	minimap.wallsPosImg.loadPixels(); // use for minimap.insertWallsPos
	for(var i = 0; i <  newGui.numOfThings; i++){
		walls[i] = new Wall(random(newGui.wMap), random(newGui.hMap));
		quad.insert(walls[i]);
		if(newGui.numOfThings <= 10000)
			minimap.insertWallsPos(walls[i]);
	}
	minimap.wallsPosImg.updatePixels();
}

function setup() {
	createCanvas(windowWidth, windowHeight)
		.position(0,0);
	rectMode(CENTER);
	textAlign(CENTER);
	textSize(15);

	addGui();
	ResetGame();
}

function draw() {
	background(51);

	setViewPort();
	drawEdge();
	if(newGui.grid)
		drawGrid();

	// plus 50 to display all object near the border (size of object < 50)
	var range = new Rectangle(Viewport.x, Viewport.y, width+50, height+50);
	var wallsInRange = quad.query(range);
	for(var i = 0; i < wallsInRange.length; i++){
		wallsInRange[i].show();
	}

	// display enemy or not
	if(newGui.enemyMode){
		for(var i = 0; i < enemys.length; i++){
			enemys[i].update();
			enemys[i].show();	
		}	
	}

	// calculate and display player
	player.move();
	player.update();
	player.show();

	minimap.update();
	minimap.show();

	// show fps
	fill(255);
	strokeWeight(1);
	text("FPS: " + floor(frameRate()), 30, 20);
}

function keyPressed(){
	if(keyCode == ENTER){ 
		newGui.generate();
	} else if(keyCode == 70){ // F key
		newGui.freeCam = !newGui.freeCam;
	} else if(keyCode == 69){ // E key
		newGui.enemyMode = !newGui.enemyMode;
	} else if(keyCode == 71){ // G key
		newGui.grid = !newGui.grid;
	}
}

function setViewPort(){
	if(newGui.freeCam)
	{
		if(mouseX > width - 40 || mouseX < 40 
		|| mouseY > height -40 || mouseY < 40)
		{
    	    var vec = createVector(mouseX - width/2, mouseY-height/2).normalize().mult(30);
        	Viewport.add(vec);
      	} 
		noStroke();
		text("X:" + floor(Viewport.x) + " Y:"+ floor(Viewport.y), width/2, height/2);
	}
	else Viewport = createVector(player.pos.x, player.pos.y);
}