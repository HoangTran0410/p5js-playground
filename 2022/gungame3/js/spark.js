class Spark {
  renderOrder = 3;

  constructor(x, y, size, growSpeed, lifeTime) {
    this.pos = createVector(x, y);
    this.size = size;
    this.growSpeed = growSpeed;
    this.lifeTime = lifeTime;

    this.bornTime = millis();
  }

  update() {
    if (now - this.bornTime > this.lifeTime) {
      this.isDestroy = true;
    }

    this.size += this.growSpeed;
  }

  render() {
    fill("#fcff66ee");
    star(this.pos.x, this.pos.y, this.size * 0.75, this.size, 5);
  }
}
