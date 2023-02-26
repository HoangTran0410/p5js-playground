export default class StarField {
  constructor(numStars, camera) {
    this.camera = camera;
    this.lastPos = this.camera.position.copy();
    this.stars = [];
    for (let i = 0; i < numStars; i++) {
      this.stars.push(new Star());
    }
  }

  update() {
    let sub = p5.Vector.sub(this.camera.position, this.lastPos);
    let d = sub.mag();
    if (d > 0) {
      this.lastPos = this.camera.position.copy();

      for (const star of this.stars) {
        star.move(sub.x, sub.y);
      }
    }
  }

  draw() {
    for (const star of this.stars) {
      star.show();
    }
  }
}

class Star {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
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
