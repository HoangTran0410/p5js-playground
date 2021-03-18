var balls = [];
var paddleLeft, paddleRight;
var player;
var speed = 10;

var scoreLeft = 0,
    scoreRight = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    imageMode(CENTER);

    textFont('Consolas');
    textSize(50);
    textAlign(CENTER);

    // player = new PlayerSoccer(50, 100, 50);
    // player.setKey(73, 75, 74, 76);

    balls.push(new Ball(width / 2, height / 2, 15, speed, random(-5, 5)));

    paddleLeft = new Paddle(30, height / 2, 30, 200);
    paddleLeft.setKey(87, 83, 65, 68); // W S A D
    paddleLeft.setArea(0, width / 2);

    paddleRight = new Paddle(width - 30, height / 2, 30, 200);
    paddleRight.setKey(UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW); // arrowkey
    paddleRight.setArea(width / 2, width);
}

function draw() {
    background('#489102');
    drawMap();

    // player.run();

    paddleLeft.run(balls[0], 0, width / 2);
    paddleRight.run(balls[0], width / 2, width);

    for (var ball of balls) {
        ball.run();
        checkHit(ball, paddleLeft);
        checkHit(ball, paddleRight);
    }

    stroke(255);
    strokeWeight(3);
    noFill();
    text(scoreLeft, 70, 70);
    text(scoreRight, width - 70, 70);
}

function checkHit(b, p) { // ball hit paddle ?
    var c = new Circle(b.pos.x, b.pos.y, b.r);
    var r = new Rectangle(p.pos.x, p.pos.y, p.size.x, p.size.y);

    if (circleRect(c, r)) {
        speed += .02;
        b.vel = p5.Vector.sub(b.pos, p.pos).setMag(speed);
    }
}

function drawMap() {
    stroke(255, 150);
    strokeWeight(10);
    noFill();

    // center line
    line(width / 2, 0, width / 2, height);

    // center circle
    ellipse(width / 2, height / 2, 150);

    // left circle
    ellipse(0, height / 2, height);

    // right circle
    ellipse(width, height / 2, height);
}

function goal(leftOrRight) {
    if (leftOrRight == 'left') scoreRight++;
    else scoreLeft++;

    speed = 10;

    balls = [];
    balls.push(new Ball(width / 2, height / 2, 15, speed * (leftOrRight == 'left' ? -1 : 1), random(-5, 5)));
}

function setControl(inp, isLeft) {
    if (isLeft) paddleLeft.controlType = inp.value;
    else paddleRight.controlType = inp.value;

    inp.blur();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    paddleLeft.setArea(0, width / 2);
    paddleRight.setArea(width / 2, width);
}

// ========================= Classes =====================
class Ball {
    constructor(x, y, r, vx, vy) {
        this.pos = createVector(x, y);
        this.r = r;

        this.vel = createVector(vx || 0, vy || 0);
    }

    move() {
        this.pos.add(this.vel);
    }

    collideEdge() {
        if (this.pos.x < 0) {
            // this.pos.x = this.r;
            // this.vel.x *= -1;
            goal('left');

        } else if (this.pos.x > width) {
            // this.pos.x = width - this.r;
            // this.vel.x *= -1;
            goal('right');
        }

        if (this.pos.y < this.r) {
            this.pos.y = this.r;
            this.vel.y *= -1;

        } else if (this.pos.y > height - this.r) {
            this.pos.y = height - this.r;
            this.vel.y *= -1;
        }
    }

    show() {
        noStroke();
        fill(255, 200);
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }

    run() {
        this.move();
        this.collideEdge();
        this.show();
    }
}

class Paddle {
    constructor(x, y, w, h) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.size = createVector(w, h);
        this.area = [0, width];

        this.controlType = 'key';
    }

    setKey(up, down, left, right) {
        this.keyMoveUp = up;
        this.keyMoveDown = down;
        this.keyMoveLeft = left;
        this.keyMoveRight = right;
    }

    setArea(left, right) {
        this.area = [left, right];
    }

    autoplay(b) {
        if (b.pos.x > this.area[0] && b.pos.x < this.area[1]) {
            if (this.pos.y + this.size.y / 4 < b.pos.y) this.vel.y++;
            if (this.pos.y - this.size.y / 4 > b.pos.y) this.vel.y--;
        }
    }

    follow(px, py) {
        this.pos = createVector(px, py);
    }

    controls() {
        if (keyIsDown(this.keyMoveUp)) {
            this.vel.y--;
        }
        if (keyIsDown(this.keyMoveDown)) {
            this.vel.y++;
        }
        if (keyIsDown(this.keyMoveLeft)) {
            this.vel.x--;
        }
        if (keyIsDown(this.keyMoveRight)) {
            this.vel.x++;
        }
    }

    move() {
        this.pos.add(this.vel);
        this.vel.mult(0.9);

        this.pos.x = constrain(this.pos.x, this.area[0] + this.size.x / 2, this.area[1]);
    }

    collideEdge() {
        if (this.pos.x < this.size.x / 2) {
            this.pos.x = this.size.x / 2;
            this.vel.x *= -1;

        } else if (this.pos.x > width - this.size.x / 2) {
            this.pos.x = width - this.size.x / 2;
            this.vel.x *= -1;
        }

        if (this.pos.y < this.size.y / 2) {
            this.pos.y = this.size.y / 2;
            this.vel.y *= -.8;

        } else if (this.pos.y > height - this.size.y / 2) {
            this.pos.y = height - this.size.y / 2;
            this.vel.y *= -.8;
        }
    }

    show() {
        stroke(255);
        strokeWeight(2);
        fill(255, 150);
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    run(b) {
        if (this.controlType == 'auto') this.autoplay(b);
        else if (this.controlType == 'mouse') this.follow(mouseX, mouseY);
        this.controls();

        this.move();
        this.collideEdge();
        this.show();
    }
}

class PlayerSoccer extends Paddle {
    constructor(x, y, r) {
        super(x, y, r, r);
    }

    show() {
        strokeWeight(2);
        stroke(255);
        fill(255, 150);
        ellipse(this.pos.x, this.pos.y, this.size.x * 2);
    }
}

class Item {
    constructor() {

    }
}

class Effect {
    constructor() {

    }
}