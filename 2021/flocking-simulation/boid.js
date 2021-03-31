class Boid {
  static minSpeed = 2;
  static maxSpeed = 5;
  static maxSteerForce = 0.1;

  static alignWeight = 1;
  static cohesionWeight = 0.5;
  static seperateWeight = 1.5;
  static targetWeight = 2;

  static perceptionRadius = 100;
  static avoidanceRadius = 40;
  static sightAngle = (Math.PI * 3) / 2;

  constructor(target) {
    // state
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.radius = 7;
    this.debug = false;

    // to update
    this.acceleration = createVector();
    this.target = target;
  }

  update() {
    this.velocity.add(this.acceleration);
    let speed = this.velocity.mag();
    speed = constrain(speed, Boid.minSpeed, Boid.maxSpeed);
    this.velocity.setMag(speed);

    this.position.add(this.velocity);
  }

  flock(boids) {
    let numPerceivedFlockmates = 0;
    let avgAlignmentHeading = createVector();
    let centreOfFlockmates = createVector();
    let avgSeperationHeading = createVector();

    let visibleBoids = this.getBoidsInSight(boids);

    for (let other of visibleBoids) {
      let offset = p5.Vector.sub(other.position, this.position);
      let dst = offset.mag();

      if (dst < Boid.perceptionRadius) {
        numPerceivedFlockmates += 1;
        avgAlignmentHeading.add(other.velocity);
        centreOfFlockmates.add(other.position);

        if (dst < Boid.avoidanceRadius) {
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
        Boid.targetWeight
      );
    }

    if (numPerceivedFlockmates != 0) {
      let offsetToFlockmatesCentre = p5.Vector.sub(
        centreOfFlockmates,
        this.position
      );

      let alignmentForce = this.steerTowards(avgAlignmentHeading).mult(
        Boid.alignWeight
      );
      let cohesionForce = this.steerTowards(offsetToFlockmatesCentre).mult(
        Boid.cohesionWeight
      );
      let seperationForce = this.steerTowards(avgSeperationHeading).mult(
        Boid.seperateWeight
      );

      this.acceleration.add(alignmentForce);
      this.acceleration.add(cohesionForce);
      this.acceleration.add(seperationForce);
    }
  }

  getBoidsInSight(boids) {
    let inSight = [];

    fill("lightgreen");

    for (let boid of boids) {
      if (boid == this) continue;

      let inBack = collidePointArc(
        boid.position.x,
        boid.position.y,
        this.position.x,
        this.position.y,
        Boid.perceptionRadius,
        this.velocity.heading() + PI,
        2 * PI - Boid.sightAngle
      );

      let inCircle =
        p5.Vector.dist(this.position, boid.position) <= Boid.perceptionRadius;

      if (inCircle && !inBack) {
        inSight.push(boid);
        this.debug && circle(boid.position.x, boid.position.y, 20);
      }
    }

    return inSight;
  }

  steerTowards(vector) {
    let v = vector.copy().setMag(Boid.maxSpeed).sub(this.velocity);
    return v.limit(Boid.maxSteerForce);
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

    stroke(255);
    fill(0);
    triangle(
      -this.radius,
      -this.radius / 1.5,
      this.radius,
      0,
      -this.radius,
      this.radius / 1.5
    );

    if (this.debug) {
      fill(30, 100);
      stroke(150, 100);
      arc(
        0,
        0,
        2 * Boid.perceptionRadius,
        2 * Boid.perceptionRadius,
        -Boid.sightAngle / 2,
        Boid.sightAngle / 2,
        PIE
      );
    }

    pop();
  }
}
