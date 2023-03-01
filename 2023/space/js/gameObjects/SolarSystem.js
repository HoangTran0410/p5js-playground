import CelestialBody from "./CelestialBody.js";

export default class SolarSystem {
  constructor({ x, y }) {
    this.pos = createVector(x, y);
    this.celestials = [];

    for (let i = 0; i < 40; i++) {
      this.celestials.push(
        new CelestialBody({
          x: random(0, width),
          y: random(0, height),
          r: random(10, 30),
          c: color(random(0, 255), random(0, 255), random(0, 255)),
          mass: random(1, 10),
          vx: random(-1, 1),
          vy: random(-1, 1),
        })
      );
    }
  }

  update() {
    for (let i = 0; i < this.celestials.length; i++) {
      for (let j = i + 1; j < this.celestials.length; j++) {
        if (i !== j) {
          // this.celestials[i].gravityWith(this.celestials[j]);
          // if (this.celestials[i].isCollideWith(this.celestials[j], 30)) {
          CelestialBody.resolveCollision(
            this.celestials[i],
            this.celestials[j]
          );
          // }
        }
      }
    }

    for (let celestial of this.celestials) {
      celestial.update();
    }
  }

  show() {
    for (let celestial of this.celestials) {
      celestial.show();
    }
  }
}
