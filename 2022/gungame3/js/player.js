class Player {
  renderOrder = 1;
  checkCollide = true;

  animate = {
    left: createVector(),
    right: createVector(),
  };

  attackDelay = 500;
  lastAttackTime = 0;
  isAttackLeftHand = true;

  constructor(x, y, size = 55) {
    this.pos = createVector(x, y);
    this.size = size;

    this.health = 100;
    this.attackDelay = random(500, 1000);

    this.handSize = createVector(size / 2.8, size / 1.5);
    this.handOffset = {
      left: createVector(-size / 2, -size / 2.5),
      right: createVector(size / 2, -size / 2.5),
    };
  }

  lookAt(x, y) {
    this.lookAtPos = createVector(x, y);
    this.direction = this.pos.copy().sub(x, y).mult(-1);
    this.angle = this.direction
      .copy()
      .rotate(PI / 2)
      .heading();
  }

  update() {
    this.collideBullets();
    this.collideEdges();
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    fill("#F9AB64");

    let { left, right } = this.getHandPosRelative();
    let { x: w, y: h } = this.handSize;
    let border1 = this.size / 10,
      border2 = this.size / 5,
      border3 = this.size / 2.8;

    // left hand
    push();
    translate(left.x, left.y);
    rotate(-this.animate.left.y / 30);
    rect(0, 0, w, h, border2, border1, border1, border2);
    pop();

    // right hand
    push();
    translate(right.x, right.y);
    rotate(this.animate.right.y / 30);
    rect(0, 0, w, h, border1, border2, border2, border1);
    pop();

    // body
    rect(0, 0, this.size, this.size, border2, border2, border3, border3);

    fill(255);
    let eyeOffset = this.size / 4,
      eyeSize = this.size / 5.5;
    ellipse(-eyeOffset, -eyeOffset, eyeSize); // left eye
    ellipse(eyeOffset, -eyeOffset, eyeSize); // right eye

    pop();

    // --- health bar ---
    push();
    strokeWeight(0);
    // background
    fill("#4B7C25");
    rect(this.pos.x, this.pos.y + this.size + 15, 100, 15, 40);
    // health
    rectMode(CORNER);
    fill("#96C134");
    rect(this.pos.x - 50, this.pos.y + this.size + 7.5, this.health, 15, 40);
    pop();
    // border
    noFill();
    rect(this.pos.x, this.pos.y + this.size + 15, 100, 20, 40);
  }

  getHandPosAbsolute() {
    let result = {};
    let relative = this.getHandPosRelative();
    for (let key in relative) {
      result[key] = relative[key].copy().rotate(this.angle).add(this.pos);
    }
    return result;
  }

  getHandPosRelative() {
    let left = this.handOffset.left.copy().add(this.animate.left),
      right = this.handOffset.right.copy().add(this.animate.right),
      leftFinger = left.copy().add(0, -this.handSize.y / 2),
      rightFinger = right.copy().add(0, -this.handSize.y / 2);

    return {
      left,
      right,
      leftFinger,
      rightFinger,
    };
  }

  attack() {
    if (now - this.lastAttackTime > this.attackDelay) {
      this.lastAttackTime = now;
      this.isAttackLeftHand = !this.isAttackLeftHand;

      let targets = this.isAttackLeftHand
        ? this.animate.left
        : this.animate.right;

      let isLeftHandCached = this.isAttackLeftHand;
      let fire = () => {
        // add bullet
        let { leftFinger, rightFinger } = this.getHandPosAbsolute();

        let bulletPos = isLeftHandCached ? leftFinger : rightFinger;
        let vel = this.lookAtPos.copy().sub(bulletPos).setMag(7);
        gameObject.push(new Bullet(bulletPos.x, bulletPos.y, vel.x, vel.y));

        // add spark
        let sparkPos = isLeftHandCached ? leftFinger : rightFinger;
        gameObject.push(new Spark(sparkPos.x, sparkPos.y, 15, 2.5, 75));
      };

      anime
        .timeline()
        .add({
          targets: targets,
          y: -this.size / 8,
          x: ((this.isAttackLeftHand ? 1 : -1) * this.size) / 5,
          easing: "linear",
          duration: 250,
          complete: () => fire(),
        })
        .add({
          targets: targets,
          y: 0,
          x: 0,
          easing: "easeInOutBack",
          duration: 200,
          complete: () => {},
        });
    }
  }

  control() {
    let speed = 4;
    if (keyIsDown(65)) {
      this.pos.x -= speed;
    }
    if (keyIsDown(68)) {
      this.pos.x += speed;
    }
    if (keyIsDown(87)) {
      this.pos.y -= speed;
    }
    if (keyIsDown(83)) {
      this.pos.y += speed;
    }
  }

  collideEdges() {
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  collideBullets() {
    for (let b of gameObject) {
      if (b instanceof Bullet) {
        let distance = p5.Vector.dist(this.pos, b.pos);
        if (distance < this.size / 2) {
          b.isDestroy = true;

          this.pos.add(b.vel);
          this.health -= 5;
          this.destination = createVector(random(width), random(height));

          gameObject.push(new Spark(b.pos.x, b.pos.y, 0, 4, 100));

          if (this.health < 0) {
            this.die();
          }
        }
      }
    }
  }

  die() {
    this.health = 100;
    score--;
  }
}
