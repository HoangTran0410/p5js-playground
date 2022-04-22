let video;
let face = { top: 0, left: 0, right: 0, bottom: 0 };
let balls = [];

function setup() {
  createCanvas(640, 480);
  textAlign(CENTER, CENTER);
  textSize(20);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // tracker
  faceTracker = new clm.tracker();
  faceTracker.init();
  faceTracker.start(video.elt);

  // faceTracker.setResponseMode("single");

  for (let i = 3; i--; )
    balls.push(new Ball(random(width), random(height), 20));
}

function draw() {
  // image(video, 0, 0, width, height);
  // filter(GRAY)
  background(30);

  for (let ball of balls) {
    ball.update();
    ball.collideRect(face);
    ball.display();
  }

  const positions = faceTracker.getCurrentPosition();
  if (positions != false) {
    let top = Infinity,
      left = Infinity,
      right = -Infinity,
      bottom = -Infinity;

    for (let [x, y] of positions) {
      if (x > bottom) bottom = x;
      if (x < top) top = x;
      if (y > right) right = y;
      if (y < left) left = y;
    }

    face.top = lerp(face.top, top, 0.5);
    face.bottom = lerp(face.bottom, bottom, 0.5);
    face.right = lerp(face.right, right, 0.5);
    face.left = lerp(face.left, left, 0.5);

    image(
      video,
      face.top,
      face.left,
      face.bottom - face.top,
      face.right - face.left,
      face.top,
      face.left,
      face.bottom - face.top,
      face.right - face.left
    );

    noStroke();
    fill(0, 255, 0, 100);
    for (let [x, y] of positions) {
      circle(x, y, 3);
    }

    strokeWeight(3);
    stroke("rgb(0,219,36)");
    noFill();
    rect(face.top, face.left, face.bottom - face.top, face.right - face.left);
  }
}

class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = random(5, 10);
    this.vy = random(5, 10);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // collide edges
    if (this.x - this.r < 0) {
      this.x = this.r;
      this.vx *= -1;
    } else if (this.x + this.r > width) {
      this.x = width - this.r;
      this.vx *= -1;
    }

    if (this.y - this.r < 0) {
      this.y = this.r;
      this.vy *= -1;
    } else if (this.y + this.r > height) {
      this.y = height - this.r;
      this.vy *= -1;
    }
  }

  collideRect({ top, left, right, bottom }) {
    let collided = circleRect(
      this.x,
      this.y,
      this.r,
      top,
      left,
      right - left,
      bottom - top
    );

    if (collided) {
      if (this.x < left || this.x > right) this.vx *= -1;
      if (this.y < top || this.y > bottom) this.vy *= -1;
    }
  }

  display() {
    fill(255);
    noStroke();
    circle(this.x, this.y, this.r * 2);
  }
}

// CIRCLE/RECTANGLE: http://www.jeffreythompson.org/collision-detection/circle-rect.php
function circleRect(cx, cy, radius, rx, ry, rw, rh) {
  // temporary variables to set edges for testing
  let testX = cx;
  let testY = cy;

  // which edge is closest?
  if (cx < rx) testX = rx; // test left edge
  else if (cx > rx + rw) testX = rx + rw; // right edge
  if (cy < ry) testY = ry; // top edge
  else if (cy > ry + rh) testY = ry + rh; // bottom edge

  // get distance from closest edges
  let distX = cx - testX;
  let distY = cy - testY;
  let distance = sqrt(distX * distX + distY * distY);

  // if the distance is less than the radius, collision!
  if (distance <= radius) {
    return true;
  }
  return false;
}
