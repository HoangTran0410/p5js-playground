class Boid {
  constructor(target) {
    // state
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.radius = BoidSetting.boidRadius;
    this.debug = false;

    // to update
    this.acceleration = createVector();
    this.target = target;
  }

  update() {
    this.velocity.add(this.acceleration);
    let speed = this.velocity.mag();
    speed = constrain(speed, BoidSetting.minSpeed, BoidSetting.maxSpeed);
    this.velocity.setMag(speed);

    this.position.add(this.velocity);
  }

  flock(boids) {
    let numPerceivedFlockmates = 0;
    let avgAlignmentHeading = createVector();
    let centreOfFlockmates = createVector();
    let avgSeperationHeading = createVector();

    let boidsInSight = this.getBoidsInSight(boids);

    for (let other of boidsInSight) {
      let offset = p5.Vector.sub(other.position, this.position);
      let dst = offset.mag();

      if (dst < BoidSetting.perceptionRadius) {
        numPerceivedFlockmates += 1;
        avgAlignmentHeading.add(other.velocity);
        centreOfFlockmates.add(other.position);

        if (dst < BoidSetting.avoidanceRadius) {
          avgSeperationHeading.sub(offset.div(dst * dst));
        }
      }
    }

    if (numPerceivedFlockmates > 0) {
      avgAlignmentHeading.div(numPerceivedFlockmates);
      centreOfFlockmates.div(numPerceivedFlockmates);
      avgSeperationHeading.div(numPerceivedFlockmates);
    }

    // add to acceleration
    this.acceleration.mult(0);

    if (this.target != null) {
      let offsetToTarget = p5.Vector.sub(this.target, this.position);
      this.acceleration = this.steerTowards(offsetToTarget).mult(
        BoidSetting.targetWeight
      );
    }

    if (numPerceivedFlockmates != 0) {
      let offsetToFlockmatesCentre = p5.Vector.sub(
        centreOfFlockmates,
        this.position
      );

      let alignmentForce = this.steerTowards(avgAlignmentHeading).mult(
        BoidSetting.alignWeight
      );
      let cohesionForce = this.steerTowards(offsetToFlockmatesCentre).mult(
        BoidSetting.cohesionWeight
      );
      let seperationForce = this.steerTowards(avgSeperationHeading).mult(
        BoidSetting.seperateWeight
      );

      this.acceleration.add(alignmentForce);
      this.acceleration.add(cohesionForce);
      this.acceleration.add(seperationForce);
    }

    let avoidWalls = this.avoidWalls().mult(BoidSetting.avoidWallWeight);
    this.acceleration.add(avoidWalls);
  }

  getBoidsInSight(boids) {
    let inSight = [];

    fill("lightgreen");

    for (let boid of boids) {
      if (boid == this) continue;

      let inCircle =
        p5.Vector.dist(this.position, boid.position) <=
        BoidSetting.perceptionRadius;

      if (inCircle) {
        inSight.push(boid);
        this.debug && circle(boid.position.x, boid.position.y, this.radius * 3);
      }
    }

    return inSight;
  }

  steerTowards(vector) {
    let v = vector.copy().setMag(BoidSetting.maxSpeed).sub(this.velocity);
    return v.limit(BoidSetting.maxSteerForce);
  }

  avoidWalls() {
    let range = BoidSetting.avoidWallRadius;
    if (
      this.position.y < range ||
      this.position.y > height - range ||
      this.position.x < range ||
      this.position.x > width - range
    ) {
      return this.steerTowards(
        p5.Vector.sub(createVector(width / 2, height / 2), this.position)
      );
    }
    return createVector();
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  show() {
    let angle = this.velocity.heading();

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    if (BoidSetting.boidShape == BoidShape.triangle) {
      triangle(
        -this.radius,
        -this.radius / 1.5,
        this.radius,
        0,
        -this.radius,
        this.radius / 1.5
      );
    } else if (BoidSetting.boidShape == BoidShape.line) {
      line(0, 0, this.radius * 2, 0);
    } else if (BoidSetting.boidShape == BoidShape.point) {
      circle(0, 0, this.radius * 2);
    }

    if (this.debug) {
      noFill();
      stroke(150, 100);
      circle(0, 0, BoidSetting.perceptionRadius * 2);
      stroke("red");
      circle(0, 0, BoidSetting.avoidanceRadius * 2);

      //   arc(
      //     0,
      //     0,
      //     2 * BoidSetting.perceptionRadius,
      //     2 * BoidSetting.perceptionRadius,
      //     -BoidSetting.sightAngle / 2,
      //     BoidSetting.sightAngle / 2,
      //     PIE
      //   );
    }

    pop();
  }
}
