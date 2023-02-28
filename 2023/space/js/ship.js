export default class Ship {
  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.radius = 20;
    this.heading = -PI / 2;
    this.boosting = 0;
    this.maxSpeed = 5;

    this.renderIgnoreScale = false;
  }

  update() {
    // Update velocity, position, and rotation based on acceleration and rotation
    this.velocity.add(this.acceleration);
    this.velocity.mult(0.999); // Add a bit of friction to slow the ship down over time
    this.position.add(this.velocity);

    // Reset acceleration
    this.acceleration.set(0, 0);
  }

  collide(planet) {
    let d = p5.Vector.dist(this.position, planet.position);
    let r = this.radius / 2 + planet.radius;
    if (d <= r) {
      // limit the ship position on the surface of the planet
      let force = p5.Vector.sub(this.position, planet.position);
      force.setMag(r);
      let collidePoint = p5.Vector.add(planet.position, force);
      this.velocity.mult(0.95);
      this.position.set(collidePoint.x, collidePoint.y);
    }
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  boost(value) {
    this.boosting = value > 0;

    if (this.velocity.mag() > this.maxSpeed) return; // Limit the ship's speed

    // Apply a forward or backward force to the ship (based on value)
    let force = p5.Vector.fromAngle(this.heading);
    force.mult(value);
    this.applyForce(force);
  }

  turn(angle) {
    this.heading += angle;
  }

  show(cam) {
    // Draw the ship as a triangle with the appropriate orientation
    push();
    translate(this.position.x, this.position.y);
    rotate(this.heading + PI / 2);

    // Draw ship body
    if (this.renderIgnoreScale) {
      fill(0);
      stroke(255);
      strokeWeight(2 / cam.scale);

      beginShape();
      let r = this.radius / cam.scale;
      vertex(0, -r);
      vertex(r / 2, r / 2);
      vertex(0, r / 4);
      vertex(-r / 2, r / 2);
      endShape(CLOSE);
    } else {
      fill(0);
      stroke(255);
      strokeWeight(2);

      beginShape();
      let r = this.radius;
      // render a triangle spaceship with a circle at the back
      vertex(0, -r);
      vertex(r / 1.5, r / 2);
      vertex(-r / 1.5, r / 2);
      endShape(CLOSE);

      // render a circle at the back of the ship
      ellipse(0, r / 2, r / 1.5, r / 4);
    }

    // Draw ship exhaust if boosting
    if (!this.renderIgnoreScale && this.boosting) {
      noStroke();

      // bigger triangle first
      fill(150, 50, 200);
      triangle(
        -this.radius / 2,
        this.radius / 2,
        0,
        this.radius / 2 + random(10, 25),
        this.radius / 2,
        this.radius / 2
      );

      fill(255, 90, 150, 200);
      triangle(
        -this.radius / 2,
        this.radius / 2,
        0,
        this.radius / 2 + random(5, 15),
        this.radius / 2,
        this.radius / 2
      );
    }

    pop();
  }
}
