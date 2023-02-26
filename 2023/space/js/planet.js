const G = 0.5;

export default class Planet {
  constructor(x, y, r) {
    this.position = createVector(x, y);
    this.mass = r * 50;
    this.radius = r;
    this.colour = [random(255), random(255), random(255)];

    this.clouds = [];
    for (let i = 0; i < random(this.radius / 10); i++) {
      let cloud = new Cloud(
        this,
        random(30, this.radius / 2),
        random(30, 50),
        random(-0.005, 0.005)
      );
      this.clouds.push(cloud);
    }
  }

  update() {
    for (let cloud of this.clouds) {
      cloud.update();
    }
  }

  show() {
    noStroke();
    fill(this.colour);
    ellipse(this.position.x, this.position.y, this.radius * 2);

    for (let cloud of this.clouds) {
      cloud.show();
    }
  }

  overlaps(x, y, r) {
    let d = p5.Vector.dist(this.position, createVector(x, y));
    return d < this.radius + r;
  }

  gravity(ship) {
    let force = p5.Vector.sub(this.position, ship.position);
    let distanceSq = force.magSq() - this.radius;
    let strength = (G * (this.mass * (ship.mass || 1))) / distanceSq;
    force.setMag(strength);
    ship.applyForce(force);
  }
}

class Cloud {
  constructor(planet, height, radius, speed) {
    this.planet = planet;
    this.height = height;
    this.angle = random(TWO_PI);
    this.radius = radius;
    this.speed = speed;

    this.xoff = random(1000);
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(p5.Vector.sub(this.planet.position, this.position).heading());

    noStroke();
    fill(200);
    for (let i = 0; i < 20; i++) {
      let noiseX = noise(this.xoff + i);
      let noiseY = noise(this.xoff + i + 100);
      let x = map(noiseX, 0, 1, -50, 50);
      let y = map(noiseY, 0, 1, -100, 100);

      ellipse(x, y, 30, 30);
    }

    pop();
  }

  update() {
    let { speed, planet, angle, height } = this;

    this.angle += speed;
    this.position = createVector(
      planet.position.x + cos(angle) * (planet.radius + height),
      planet.position.y + sin(angle) * (planet.radius + height)
    );

    this.xoff += Math.max(this.speed, 0.001);
  }
}
