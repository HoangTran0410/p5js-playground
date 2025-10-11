export default class Ship {
  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.radius = 20;
    this.heading = -PI / 2;
    this.boosting = 0;
    this.maxSpeed = 10;

    this.renderIgnoreScale = false;
  }

  update() {
    // Update velocity, position, and rotation based on acceleration and rotation
    this.velocity.add(this.acceleration);
    this.velocity.mult(0.999); // Add a bit of friction to slow the ship down over time
    this.velocity.limit(this.maxSpeed);
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
      let r = this.radius;

      // Draw ship exhaust glow if boosting (behind ship)
      if (this.boosting) {
        this.drawEngineGlow(r);
      }

      // Draw main ship body with sci-fi details
      this.drawShipBody(r);

      // Draw glowing accents and details
      this.drawShipDetails(r);
    }

    pop();
  }

  drawEngineGlow(r) {
    noStroke();

    // Outer glow layers
    for (let i = 3; i > 0; i--) {
      fill(0, 150, 255, 30 * i);
      ellipse(0, r / 2, r * (1 + i * 0.3), r * (0.8 + i * 0.4));
    }

    // Main exhaust plume
    fill(0, 200, 255, 180);
    triangle(-r / 2.5, r / 2, 0, r / 2 + random(15, 30), r / 2.5, r / 2);

    // Bright core exhaust
    fill(100, 220, 255, 220);
    triangle(-r / 3.5, r / 2, 0, r / 2 + random(10, 20), r / 3.5, r / 2);

    // White-hot center
    fill(200, 240, 255, 250);
    triangle(-r / 5, r / 2, 0, r / 2 + random(5, 12), r / 5, r / 2);
  }

  drawShipBody(r) {
    // Main hull - dark metallic
    fill(20, 25, 35);
    stroke(80, 90, 110);
    strokeWeight(1.5);

    // Front nose section
    beginShape();
    vertex(0, -r);
    vertex(r / 3, -r / 2);
    vertex(r / 2, r / 4);
    vertex(-r / 2, r / 4);
    vertex(-r / 3, -r / 2);
    endShape(CLOSE);

    // Wing sections
    fill(15, 20, 30);
    stroke(60, 70, 90);
    strokeWeight(1.2);

    // Right wing
    beginShape();
    vertex(r / 3, -r / 2);
    vertex(r * 0.7, r / 2);
    vertex(r / 2, r / 2);
    vertex(r / 2, r / 4);
    endShape(CLOSE);

    // Left wing
    beginShape();
    vertex(-r / 3, -r / 2);
    vertex(-r * 0.7, r / 2);
    vertex(-r / 2, r / 2);
    vertex(-r / 2, r / 4);
    endShape(CLOSE);

    // Rear engine housing
    fill(25, 30, 40);
    stroke(70, 80, 100);
    strokeWeight(1.5);
    beginShape();
    vertex(-r / 2.5, r / 4);
    vertex(-r / 3, r / 2);
    vertex(r / 3, r / 2);
    vertex(r / 2.5, r / 4);
    endShape(CLOSE);
  }

  drawShipDetails(r) {
    // Cockpit glow (cyan energy)
    noStroke();
    fill(0, 255, 255, 180);
    ellipse(0, -r / 2, r / 3, r / 2.5);

    fill(100, 255, 255, 220);
    ellipse(0, -r / 2, r / 4.5, r / 3.5);

    // Energy core in center
    fill(0, 200, 255, 150);
    ellipse(0, 0, r / 2.5, r / 3.5);
    fill(100, 230, 255, 200);
    ellipse(0, 0, r / 4, r / 5);

    // Panel lines
    stroke(100, 150, 200, 150);
    strokeWeight(0.8);
    line(-r / 4, -r / 3, r / 4, -r / 3);
    line(-r / 3, 0, r / 3, 0);

    // Wing edge lights
    stroke(0, 255, 255, 200);
    strokeWeight(2);
    point(r * 0.65, r / 3);
    point(-r * 0.65, r / 3);

    // Engine vents
    stroke(0, 180, 255, 180);
    strokeWeight(1.5);
    line(-r / 4, r / 2.5, -r / 4, r / 2);
    line(r / 4, r / 2.5, r / 4, r / 2);

    // Accent glow on edges when boosting
    if (this.boosting) {
      stroke(0, 255, 255, 150);
      strokeWeight(1.5);
      noFill();

      // Glow around nose
      beginShape();
      vertex(0, -r);
      vertex(r / 3, -r / 2);
      vertex(r / 2, r / 4);
      endShape();

      beginShape();
      vertex(0, -r);
      vertex(-r / 3, -r / 2);
      vertex(-r / 2, r / 4);
      endShape();
    }
  }
}
