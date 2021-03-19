let assets = [];
let cars = [];
let player;
let score;
let camera;
let died;
let ready;

function preload() {
    let paths = [
        'GreenStrip.png',
        'BlackOut.png',
        'BlueStrip.png',
        'PinkStrip.png',
        'RedStrip.png',
        'WhiteStrip.png',
    ];
    for (let p of paths) {
        assets.push(loadImage('./assets/' + p));
    }
}

function setup() {
    createCanvas(500, 500);
    rectMode(CENTER);
    imageMode(CENTER);
    textFont('Consolas');

    ready = false;
    reset();
}

function reset() {
    for (let i = 0; i < 20; i++) {
        cars.push(
            new Car(
                random(width),
                random(-height * 2, -height / 2),
                40,
                60,
                random(2, 4),
                random(assets)
            )
        );
    }

    player = new Car(width / 2, height / 2, 40, 60, 5, assets[0]);
    camera = createVector(0, 0);
    score = 0;
    died = false;
}

function draw() {
    background(50);

    if (ready) {
        // update
        if (!died) {
            score += player.vel.mag() / 100;

            control();
            player.moveUp();
            player.update();

            for (let car of cars) {
                if (player.checkCollide(car)) {
                    died = true;

                    setTimeout(reset, 2000);
                    break;
                }
            }
        }

        for (let car of cars) {
            let rand = random(1);
            if (rand < 0.1) {
                car.moveLeft();
            } else if (rand < 0.2) {
                car.moveRight();
            }
            car.moveUp();
            car.update();
        }

        for (let car of cars) {
            if (car.pos.y > player.pos.y + height * 2) {
                car.pos.y = player.pos.y - random(height, height * 2);
                car.pos.x = random(width);
            }
        }
    } else {
        // hint
        showHint();
    }

    camera.set(player.pos.x, player.pos.y - height / 4);

    // show
    push();
    translate(-camera.x + width / 2, -camera.y + height - height / 2);

    drawGrid();
    drawEgde();

    for (let car of cars) {
        car.show();
    }
    player.show();
    pop();

    // Score
    if (died) {
        textSize(45);
        textAlign(CENTER, CENTER);
        fill('red');
        stroke('pink');
        strokeWeight(3);
        text(`YOU DIED\nScore: ${~~score}`, width / 2, height / 2);
    } else if (ready) {
        textSize(40);
        textAlign(LEFT, TOP);
        fill(255);
        noStroke();
        text('Score: ' + ~~score, 10, 10);
    }
}

function control() {
    if (keyIsDown(LEFT_ARROW)) {
        player.moveLeft();
    }
    if (keyIsDown(RIGHT_ARROW)) {
        player.moveRight();
    }
    if (keyIsDown(UP_ARROW)) {
        player.speedUp();
    }
    if (keyIsDown(DOWN_ARROW)) {
        player.brake();
    }
}

function keyPressed() {
    ready = true;
    if (keyCode == DOWN_ARROW) {
        player.braking = true;
    }
}

function keyReleased() {
    if (keyCode == DOWN_ARROW) {
        player.braking = false;
    }
}

function showHint() {
    fill(30, 100);
    stroke(255);
    strokeWeight(3);
    rect(width / 2, height / 2 - 60, 50, 50);
    rect(width / 2, height / 2, 50, 50);
    rect(width / 2 - 60, height / 2, 50, 50);
    rect(width / 2 + 60, height / 2, 50, 50);

    textSize(20);
    fill(255);
    noStroke();
    textAlign(LEFT, CENTER);
    text('^  - SPEED UP', width / 2, height / 2 - 60);
    textAlign(CENTER, TOP);
    text('v\n\n|\nBRAKE', width / 2, height / 2);
    textAlign(RIGHT, CENTER);
    text('TURN LEFT -  <', width / 2 - 60, height / 2);
    textAlign(LEFT, CENTER);
    text('>  - TURN RIGHT', width / 2 + 60, height / 2);

    fill('red');
    textAlign(CENTER, BOTTOM);
    text('Press anykey to continue..', width / 2, height - 10);
}

function drawEgde() {
    stroke(200);
    strokeWeight(10);

    line(0, camera.y - height, 0, camera.y + height);
    line(width, camera.y - height, width, camera.y + height);
}

function drawGrid() {
    let leftScreen = camera.x - width / 2;
    let topScreen = camera.y - height / 2;
    let rightScreen = camera.x + width / 2;
    let bottomScreen = camera.y + height / 2;

    let leftMap = leftScreen - 50;
    let rightMap = rightScreen + 50;
    let topMap = topScreen - 50;
    let bottomMap = bottomScreen + 50;

    let gridSize = 200;

    // fill bgcolor
    //fill(this.bgColor);
    //rect(leftMap, topMap, rightMap - leftMap, bottomMap - topMap);

    // draw grid
    stroke(130, 50);
    strokeWeight(3);

    let delta = 1;
    for (let x = leftMap; x < rightMap; x += delta) {
        if (floor(x) % gridSize == 0) {
            /* while you find 1 x%this.gridSize==0 
            => delta will equal this.gridSize => shorter loop */
            delta = gridSize;
            line(x, topMap, x, bottomMap);
        }
    }

    // do the same thing to y axis
    delta = 1;
    for (let y = topMap; y < bottomMap; y += delta) {
        if (floor(y) % gridSize == 0) {
            delta = gridSize;
            line(leftMap, y, rightMap, y);
        }
    }
}
