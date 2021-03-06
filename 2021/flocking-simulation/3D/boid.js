class Boid {
  constructor(target) {
    // state
    this.position = createVector();
    this.velocity = p5.Vector.random3D();
    this.radius = BoidSetting.boidRadius;
    this.colour = [random(0, 255), random(0, 255), random(0, 255)];

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

      if (dst != 0 && dst < BoidSetting.perceptionRadius) {
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

    if (BoidSetting.avoidWall) {
      let avoidWalls = this.avoidWalls().mult(BoidSetting.avoidWallWeight);
      this.acceleration.add(avoidWalls);
    }
  }

  getBoidsInSight(boids) {
    let inSight = [];

    for (let boid of boids) {
      if (boid == this) continue;

      let inCircle =
        p5.Vector.dist(this.position, boid.position) <=
        BoidSetting.perceptionRadius;

      if (inCircle) {
        inSight.push(boid);
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
    let { width: w, height: h, depth: d } = BoidSetting.container;
    if (
      this.position.x < -w / 2 + range ||
      this.position.x > w / 2 - range ||
      this.position.y < -h / 2 + range ||
      this.position.y > h / 2 - range ||
      this.position.z < -d / 2 + range ||
      this.position.z > d / 2 - range
    ) {
      return this.steerTowards(p5.Vector.sub(createVector(), this.position));
    }
    return createVector();
  }

  edges() {
    let { width: w, height: h, depth: d } = BoidSetting.container;

    if (this.position.x > w / 2) {
      this.position.x = -w / 2;
    } else if (this.position.x < -w / 2) {
      this.position.x = w / 2;
    }
    if (this.position.y > h / 2) {
      this.position.y = -h / 2;
    } else if (this.position.y < -h / 2) {
      this.position.y = h / 2;
    }
    if (this.position.z > d / 2) {
      this.position.z = -d / 2;
    } else if (this.position.z < -d / 2) {
      this.position.z = d / 2;
    }
  }

  show() {
    push();
    {
      translate(this.position);
      // rotate(this.velocity.heading());

      // https://stackoverflow.com/a/65322034
      var right = p5.Vector(this.velocity.x, 0, this.velocity.z);
      rotate(atan(this.velocity.y / this.velocity.x), right);
      rotateY(atan2(-this.velocity.z, this.velocity.x));

      fill(this.colour);
      // cone(this.radius, this.radius * 2);

      box(this.radius * 3, this.radius, this.radius)
    }
    pop();
  }
}
