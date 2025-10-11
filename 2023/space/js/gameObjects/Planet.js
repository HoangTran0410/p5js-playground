import Cloud from "./Cloud.js";
import { createRadialGradient } from "../utils/utils.js";

const G = 0.5;

export default class Planet {
  constructor(x, y, r) {
    this.position = createVector(x, y);
    this.mass = r * 50;
    this.radius = r;

    // dirt color
    this.colour = "#202925";

    this.clouds = [];
    for (let i = 0; i < random(10); i++) {
      let cloud = new Cloud(
        this,
        random(30, this.radius / 2),
        random(30, 50),
        random(0.001) * random([-1, 1])
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
    let { x, y } = this.position;
    let r = this.radius;

    // draw atmosphere with fill
    fill(255);
    noStroke();
    createRadialGradient(x, y, 0, r * 3, [
      { stop: 0, color: "#7266b9" },
      { stop: 0.5, color: "#7266b955" },
      { stop: 1, color: "blue" },
    ]);
    circle(x, y, r * 3);

    // draw planet
    noStroke();
    fill(this.colour);
    ellipse(x, y, r * 2);

    // draw 2 diameters of planet
    stroke(255, 100);
    line(x - r, y, x + r, y);
    line(x, y - r, x, y + r);

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
