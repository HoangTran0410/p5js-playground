class Bullet {
  renderOrder = 2;
  checkCollide = true;

  constructor(x, y, vx, vy, size = 15) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.size = size;
  }

  update() {
    this.pos.add(this.vel);

    if (
      this.pos.x < -width ||
      this.pos.x > width * 2 ||
      this.pos.y < -height ||
      this.pos.y > height * 2
    )
      this.isDestroy = true;
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + PI / 2);
    fill("#ff5d52");
    rect(0, 0, this.size, this.size * 2, 5, 5);
    pop();
  }
}
