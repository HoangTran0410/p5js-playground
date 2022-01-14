class Dummy extends Player {
  constructor(x, y) {
    super(x, y);
  }

  control() {}

  update() {
    super.update();

    // move to destination
    let speed = 4;
    if (
      this.destination &&
      p5.Vector.dist(this.pos, this.destination) > speed
    ) {
      let vel = this.destination.copy().sub(this.pos).setMag(speed);
      this.pos.add(vel);
    }

    // restore health
    if (this.health < 100) this.health += 0.1;
  }

  die() {
    gameObject.push(new Spark(this.pos.x, this.pos.y, 10, 4, 200));

    this.pos
      .set(width / 2, height / 2)
      .add(createVector(random(-1, 1), random(-1, 1)).setMag(width * 1.5));
    this.destination = createVector(width / 2, height / 2);
    this.health = 100;
    score++;
  }
}
