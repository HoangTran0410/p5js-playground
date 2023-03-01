export default class StarField {
  constructor(numStars) {
    this.numStars = numStars;
    this.initGraphics();
  }

  initGraphics() {
    // delete old graphic
    if (this.graphic) this.graphic.remove();

    // create new graphic
    let size = Math.sqrt(
      Math.pow(displayWidth, 2) + Math.pow(displayHeight, 2)
    );
    this.graphic = createGraphics(size, size);

    // draw the stars inside circle area
    for (let i = 0; i < this.numStars; i++) {
      let x = random(size);
      let y = random(size);
      let r = random(1, 3);
      let twinkle = random() > 0.95;

      this.graphic.fill(255, random(100, 255));
      this.graphic.noStroke();
      this.graphic.ellipse(x, y, r, r);

      if (twinkle) {
        let r2 = r * 2;
        this.graphic.noFill();
        this.graphic.stroke(255);
        this.graphic.line(x - r2, y - r2, x + r2, y + r2);
        this.graphic.line(x + r2, y - r2, x - r2, y + r2);
      }
    }
  }

  show(cam) {
    // rotate by the camera's rotation
    push();
    translate(width * 0.5, height * 0.5);
    rotate(cam.rotate);
    translate(-width * 0.5, -height * 0.5);

    // draw graphic at center of screen
    image(
      this.graphic,
      width * 0.5 - this.graphic.width * 0.5,
      height * 0.5 - this.graphic.height * 0.5
    );

    pop();
  }
}

class Star {
  constructor() {
    this.x = random(-width, width * 2);
    this.y = random(-height, height * 2);
    this.z = random(width);
    this.size = map(this.z, 0, width, 5, 1);
    this.speed = map(this.z, 0, width, 1, 0);
    this.twinkle = random() > 0.9;
  }

  move(x, y) {
    this.x -= ((x * this.speed) / this.z) * 10;
    this.y -= ((y * this.speed) / this.z) * 10;

    if (this.x < 0) {
      this.x = width;
    }
    if (this.x > width) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = height;
    }
    if (this.y > height) {
      this.y = 0;
    }
  }

  show() {
    fill(255);
    noStroke();
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    let r = this.size;
    ellipse(sx, sy, r, r);

    if (this.twinkle) {
      let r2 = r * 2;
      noFill();
      stroke(255);
      line(sx - r2, sy - r2, sx + r2, sy + r2);
      line(sx + r2, sy - r2, sx - r2, sy + r2);
    }
  }
}
