var gmap;
var viewport;
var player;

var players = [];

function setup() {
    createCanvas(windowWidth, windowHeight).position(0, 0);

    gmap = new Map(2000, 1500);
    player = new Player(random(gmap.width), random(gmap.height), 15);
    viewport = new ViewPort(0, 0, player);

    player.friction = .99;

    // for (var i = 0; i < 30; i++) {
    //     players.push(new Player(random(gmap.width), random(gmap.height), 15));
    // }
}

function draw() {
    background(15);

    viewport.run();
    gmap.showEdge();
    gmap.showGrid(viewport);

    player.move();
    player.applyForce(0, .1);
    player.collideEdge(gmap)
    player.show();

    for (var i = players.length - 1; i >= 0; i--) {
        var p = players[i];
        p.move();
        p.applyForce(random(-1, 1), random(-2, 1));
        p.show();
        if (p.collideEdge(gmap)) {
            if (p.radius >= 3) {
                // for (var j = 0; j < 1; j++)
                //     players.push(new Player(p.position.x, p.position.y, p.radius * .7));
                p.radius *= .75;
            } else players.splice(i, 1);
        }

    }

    if (keyIsDown(LEFT_ARROW)) {
        player.acceleration.x--;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        player.acceleration.x++;
    }
    if (keyIsDown(UP_ARROW)) {
        player.acceleration.y--;
    }
    if (keyIsDown(DOWN_ARROW)) {
        player.acceleration.y++;
    }

    // add players at mouse
    if (mouseIsPressed) {
        var p = new Player(mouseX + viewport.position.x - width * .5, mouseY + viewport.position.y - height * .5, random(10, 20));
        p.velocity = createVector(mouseX - pmouseX, mouseY - pmouseY);
        players.push(p);
    }

    // random
    if (random(1) > 0.96) {
        players.push(new Player(gmap.width / 4, gmap.height - 20, random(10, 20)));
        players.push(new Player(gmap.width / 4 * 3, gmap.height - 20, random(10, 20)));
    }

    if(random(1) > 0.99) {
        // player.jump();
        player.applyForce(random(-10, 10), random(-3, -20));
    }

    fill(255);
    noStroke();
    text(players.length, 10, 20);
}

function keyPressed() {
    if (keyCode == 32) {
        player.jump();
    }
    if (keyCode == 86) {
        viewport.target = viewport.target ? null : player;
    }
}