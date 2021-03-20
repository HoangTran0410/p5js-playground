let assets = [];
let cars = [];
let smokes = [];
let trees = [];
let player;
let camera;
let daynight_icon;

let died;
let ready;
let score;
let currentDayTime;

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

    daynight_icon = loadImage('./assets/day-and-night.png');
}

function setup() {
    createCanvas(450, 600);
    rectMode(CENTER);
    imageMode(CENTER);
    textFont('Consolas');

    currentDayTime = random(24);
    ready = false;
    reset();
}

function reset() {
    cars = [];
    for (let i = 0; i < 15; i++) {
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

    trees = [];
    for (let i = 0; i < 20; i++) {
        let t = {};
        t.y = random(-height, height);
        t.x = random([random(-300, 0), random(width, width + 300)]);
        t.d = random(50, 80);

        trees.push(t);
    }

    player = new Car(width / 2, height / 2, 40, 60, 5, assets[0]);
    camera = createVector(0, 0);
    score = 0;
    died = false;

    frameRate(60);
}

function draw() {
    background(getBgColor());

    if (ready) {
        // update
        if (!died) {
            currentDayTime += 0.005;
            if (currentDayTime > 24) currentDayTime = 0;

            score += -player.vel.y / 30;

            control();
            player.moveUp();
            player.update();

            for (let car of cars) {
                if (player.checkCollide(car)) {
                    died = true;
                    frameRate(15);

                    setTimeout(reset, 3000);
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

            if (rand < 0.005) car.speedUp();

            car.moveUp();
            car.update();
        }

        for (let car of cars) {
            if (car.pos.y > player.pos.y + height / 2) {
                car.pos.y = player.pos.y - random(height, height - 200);
                car.pos.x = random(width);
                car.wheelTracks.length = 0;
            }
        }

        for (let i = smokes.length - 1; i >= 0; i--) {
            smokes[i].update();

            if (smokes[i].isGone()) {
                smokes.splice(i, 1);
            }
        }

        for (let t of trees) {
            if (t.y > player.pos.y + height * 2) {
                console.log('tree');
                t.y = player.pos.y - random(height, height * 2);
                t.x = random([
                    random(-100, -50),
                    random(width + 50, width + 100),
                ]);
            }
        }
    }

    // camera follow player
    camera = p5.Vector.lerp(
        camera,
        player.pos.copy().add(0, -height / 2.5),
        0.05
    );

    // show
    push();
    translate(-camera.x + width / 2, -camera.y + height - height / 2);

    drawRoad();
    drawTrees();

    for (let s of smokes) {
        s.show();
    }

    for (let car of cars) {
        car.showTracks();
    }
    player.showTracks();

    for (let car of cars) {
        car.show();
    }
    player.show();
    pop();

    // show hint
    if (!ready) {
        showHint();
    } else {
        drawSpeed();
        drawScore();
        drawTime();
        if (died) drawDead();
    }
}

function control() {
    if (keyIsDown(LEFT_ARROW)) {
        player.moveLeft();
    }
    if (keyIsDown(RIGHT_ARROW)) {
        player.moveRight();
    }
    if (keyIsDown(DOWN_ARROW)) {
        player.brake();
    }
}

function keyPressed() {
    ready = true;
    if (keyCode == UP_ARROW) {
        player.speedUp();
    }
}

function keyReleased() {}

function getBgColor() {
    let colors = [
        color(3, 7, 36),
        color(1, 17, 61),
        color(3, 67, 110),
        color(54, 114, 138),
        color(161, 147, 138),
        color(143, 72, 59),
        color(0, 0, 10),
    ];
    let times = [0, 5, 9, 12, 15, 17];

    let fromIndex = times.length - 1,
        toIndex = 0;

    for (let i = 0; i < times.length; i++) {
        if (times[i] > currentDayTime) {
            fromIndex = i == 0 ? times.length - 1 : i - 1;
            toIndex = i;
            break;
        }
    }

    let f = times[fromIndex];
    let t = times[toIndex];
    let c = currentDayTime;
    let range = t < f ? t + 24 - f : t - f;
    let actualRange = c < f ? c + 24 - f : c - f;

    let diff = actualRange / range;

    return lerpColor(colors[fromIndex], colors[toIndex], diff);
}

function showHint() {
    background('#2229');

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
    text('Press anykey to continue', width / 2, height - 10);
}

function addZero(num) {
    return num < 10 ? '0' + num : num;
}

function drawTime() {
    image(daynight_icon, width - 40, 40);

    let angle = map(currentDayTime / 24, 0, 1, -180, 180);

    noFill();
    stroke('#000');
    strokeWeight(5);
    push();
    translate(width - 40, 40);
    rotate(radians(angle));
    line(0, 0, 25, 0);
    circle(0, 0, 70);
    pop();
}

function getDayNight() {
    let c = currentDayTime;
    if (c > 3 && c < 6) return 'dawn';
    else if (c > 6 && c < 10) return 'morning';
    else if (c > 10 && c < 13) return 'noon';
    else if (c > 13 && c < 17) return 'afternoon';
    else if (c > 17 && c < 19) return 'sunset';
    else if (c > 19 && c < 22) return 'night';
    else if ((c > 22 && c < 24) || (c > 0 && c < 3)) return 'midnight';
    else return '...';
}

function drawScore() {
    textSize(25);
    textAlign(LEFT, BOTTOM);
    fill(255);
    noStroke();

    let mm = addZero(~~map(currentDayTime - ~~currentDayTime, 0, 1, 0, 59));
    let timeText = `${addZero(~~currentDayTime)}:${mm} ${getDayNight()}`;
    let scoreText = `${~~score} m`;

    text(scoreText + '\n' + timeText, 10, height - 10);
}

function drawTrees() {
    stroke('#5c9700');
    fill('#224021');
    for (let t of trees) {
        circle(t.x, t.y, t.d);

        // line(player.pos.x, player.pos.y, t.x, t.y);
    }
}

function drawDead() {
    stroke(150);
    fill('#3339');
    rect(width / 2, height / 2, width * 2, height / 3);

    textSize(40);
    textAlign(CENTER, CENTER);
    fill('#f22');
    noStroke();
    text(`YOU DIED\nScore: ${~~score} m`, width / 2, height / 2);
}

function drawRoad() {
    // background
    noStroke();
    fill('#5555');
    rect(width / 2, camera.y, width, height);

    // center road
    let delta = 1;
    let spacing = 40;
    let len = 50;
    let w = 15;

    fill(255, 100);
    noStroke();
    for (let y = camera.y - height; y < camera.y + height; y += delta) {
        if (floor(y) % (len + spacing) == 0) {
            delta = len + spacing;
            rect(width / 2 - w / 2, y, w, len);
        }
    }

    // edge
    stroke(255, 100);
    strokeWeight(3);

    line(0, camera.y - height, 0, camera.y + height);
    line(width, camera.y - height, width, camera.y + height);
}

function drawSpeed() {
    let speed = -player.vel.y;
    let size = 70;

    let angle = map(speed, 0, player.maxSpeed * 1.5, -PI, -PI / 2);
    let v = p5.Vector.fromAngle(angle, size);

    push();
    translate(width - 20, height - 20);

    fill(200, 50);
    noStroke();
    arc(5, 5, size * 2.5, size * 2.5, -PI, -PI / 2);

    fill(speed > player.maxSpeed ? 'red' : 'white');
    textAlign(CENTER, CENTER);
    textSize(25);
    text(~~(speed * 10), -size / 2, -size / 2);

    stroke(255);
    line(0, 0, v.x, v.y);
    pop();
}
