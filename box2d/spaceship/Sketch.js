var mouse = null;
var mouseIndex;

var ship;
var enemy;
var traps = [];
var shipImg;
var gunSound;
var backImage;

function preload(){
    gunSound = loadSound("Sound/Player_Shoot.wav");
    backImage = createImg("Texture/BackGround2.jpeg").hide();
    shipImg = createImg("Texture/Spaceship2.png").hide();  // ship at mouse posotion

    gunSound.setVolume(0.1);
}

function setup() {
    createCanvas(600, 600);
    noCursor();

    imageMode(CENTER);

    createGui();
    b2newWorld(45, v(0, 0));

    createWall(width/2, 0, width, 5);       // Top wall
    createWall(width/2, height, width, 5);  // bottom wall
    createWall(0, height/2, 5, height);     // left wall
    createWall(width, height/2, 5, height); // right wall

    ship = new SpaceShip(250, 250);
    enemy = new Enemy(100, 100);

    for(var i = 0; i < 5; i++) // Khởi tao trap
        traps.push(new Trap(i*100, 200));
}

function draw() {
    //image(backImage, width/2, height/2, width, height);
    background(20, 200);

    if(!newGUI.pause){
        ship.control();
        ship.update();
        enemy.update();
        enemy.fire();

        //follow traps
        for(var i = 0; i < traps.length; i++){
            traps[i].update();
            for(var j = 0; j < traps.length; j++){
                follow(traps[i], v(traps[j].x, traps[j].y), 0.25);
            }
        }

        if(newGUI.rain)
            createRain();

        b2Update();
    }

    b2Draw(false);
    image(shipImg, mouseX, mouseY, 80, 80);
    displayMouse();
    
    // join mouse and object
    if (mouse != null) mouse.setTarget(v(mouseX, mouseY), mouseIndex); 
    
    if(keyIsDown(81)){ // Q key
        deleteObject();
    }
}

function keyPressed(){
    if(keyCode  == 32) // Space Key
        ship.fire();
    else if(keyCode == 66){ // B key
        newGUI.addBox();
    } else if(keyCode == 67){ // C key
        newGUI.addCir();
    } else if(keyCode == 80){ // P key
        newGUI.pauseF();
    } else if(keyCode == 83){ // S key
        newGUI.addShip();
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

function follow(objectFollow, followTo, force){
    var x1 = objectFollow.x;var y1 = objectFollow.y;
    var x2 = followTo.x;    var y2 = followTo.y;
    // var distance = dist(x1, y1, x2, y2);

    objectFollow.Box.applyImpulse(v(x2-x1, y2-y1), force);
}

function collide(body1, body2){
    // body2.destroy();
    console.log('va cham');
}

function balance(object){
    if(object.Box.angle > 0)
        object.Box.applyTorque(-object.w*object.h*degrees(object.Box.angle));
    else if(object.Box.angle < 0)
        object.Box.applyTorque(object.w*object.h*degrees(-object.Box.angle));
}

function displayWithImage(objectBox, imagePath){
    var ObjImage = createImg(imagePath).hide();
    objectBox.image(ObjImage, 0);
}

function displayMouse(){
    fill(255, 50, 50, 200);
    if(mouseIsPressed){
        ellipse(mouseX, mouseY, 18, 18);
    }else{
        ellipse(mouseX, mouseY, 5, 5);
    }
}

function deleteObject() {
    var b = b2GetBodyAt(mouseX, mouseY);
    if (b == null) return;
    b.destroy();
}

function v(x, y){
    return createVector(x, y);
}

function createWall(x, y, w, h) { 
    return new b2Body('box', false, v(x, y), v(w, h)); 
}

function createShape(type, x, y, w, h, density, friction, bounce, angle = 0) { 
    return new b2Body(type, true, v(x, y), v(w, h), density, friction, bounce, angle);;
}

function createRain(){
    var waterImage = createImg("Texture/Water3.png").hide();
    if(random()<1 && !newGUI.pause){
        var shapeNew = createShape('circle', random(width), 5, 10, 10, 1, 0.5, 0.1);
        shapeNew.life = 30;
        shapeNew.image(waterImage, 0);
        shapeNew.applyImpulse(v(0, random(1,5)), 0.1);
    }  
}

function createMeteorite(){
    var meteoriteImage = createImg("Texture/meteorite.png").hide();
    for(var i =0; i < 15; i++){
        var big = random(10, 70);
        var c = createShape('circle', random(width), random(height), big, big, big*big, 0.5, 0.6);
        c.applyImpulse(v(random(10), random(10)), 0.1);
        c.image(meteoriteImage, 0);
    }
}

function attr1(body, fixture, position) {
    fill(body.color);
    b2Display(body, fixture, position);
}
