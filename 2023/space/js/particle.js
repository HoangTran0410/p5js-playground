let G = 9.8;

class Particle {
  constructor(x, y, mass) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.mass = mass;
    this.radius = mass * 5; // Radius proportional to mass
    this.color = color(random(255), random(255), random(255));
    this.forceRadius = this.radius * 3;
    // this.forceRadius = Infinity;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyForce(force) {
    let f = force.copy().div(this.mass);
    this.acceleration.add(f);
  }

  interact(other) {
    let distance = dist(
      this.position.x,
      this.position.y,
      other.position.x,
      other.position.y
    );

    let combinedRadius = this.radius + other.radius;

    // Gravity force
    if (distance < combinedRadius + this.forceRadius) {
      let force = p5.Vector.sub(other.position, this.position);
      let strength = (G * this.mass * other.mass) / (distance * distance);
      force.setMag(strength);
      this.applyForce(force);
      force.mult(-1);
      other.applyForce(force);
    }

    // Collision detection
    if (distance < combinedRadius) {
      let overlap = combinedRadius - distance;
      let direction = p5.Vector.sub(this.position, other.position).normalize();
      this.position.add(direction.mult(overlap / 2));
      other.position.sub(direction.mult(overlap / 2));

      // Collision resolution (conservation of momentum)
      let v1 = this.velocity.copy();
      let v2 = other.velocity.copy();
      let m1 = this.mass;
      let m2 = other.mass;
      let u1 = p5.Vector.mult(v1, (m1 - m2) / (m1 + m2)).add(
        p5.Vector.mult(v2, (2 * m2) / (m1 + m2))
      );
      let u2 = p5.Vector.mult(v2, (m2 - m1) / (m1 + m2)).add(
        p5.Vector.mult(v1, (2 * m1) / (m1 + m2))
      );
      this.velocity = u1;
      other.velocity = u2;
    }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.radius * 2);

    // Force radius
    if (this.forceRadius > 0) {
      noFill();
      stroke(this.color);
      ellipse(this.position.x, this.position.y, this.forceRadius * 2);
    }
  }
}
