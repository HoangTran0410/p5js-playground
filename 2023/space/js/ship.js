export default class Ship {
  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.radius = 20;
    this.heading = -PI / 2;
    this.boosting = 0;
    this.rotation = 0;

    this.maxSpeed = 5;
  }

  update() {
    // Update velocity, position, and rotation based on acceleration and rotation
    this.velocity.add(this.acceleration);
    this.velocity.mult(0.99); // Add a bit of friction to slow the ship down over time
    this.position.add(this.velocity);
    this.heading += this.rotation;
    this.rotation *= 0.95;

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
    // Apply a rotational force to the ship (based on angle)
    this.rotation = angle;
  }

  show() {
    // Draw the ship as a triangle with the appropriate orientation
    push();
    translate(this.position.x, this.position.y);
    rotate(this.heading + PI / 2);

    // Draw ship body
    fill(0);
    stroke(255);
    strokeWeight(2);
    beginShape();
    vertex(0, -this.radius);
    vertex(this.radius / 2, this.radius / 2);
    vertex(-this.radius / 2, this.radius / 2);
    endShape(CLOSE);

    // Draw ship exhaust if boosting
    if (this.boosting) {
      fill(255, 90, 150);
      noStroke();
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
