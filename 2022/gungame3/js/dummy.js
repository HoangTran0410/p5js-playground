class Dummy extends Player {
  constructor(x, y) {
    super(x, y);
  }

  control() {}

  update() {
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
    if (this.health < 100) this.health += 0.2;

    // collide bullets
    for (let o of gameObject) {
      if (o instanceof Bullet) {
        let distance = p5.Vector.dist(this.pos, o.pos);
        if (distance < this.size / 2) {
          o.isDestroy = true;

          this.pos.add(o.vel);
          this.health -= 5;
          this.destination = createVector(random(width), random(height));

          gameObject.push(new Spark(o.pos.x, o.pos.y, 0, 4, 100));

          if (this.health < 0) {
            this.die();
          }
        }
      }
    }
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
