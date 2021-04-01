class BoidManager {
  constructor(numberOfBoids = 50) {
    this.boids = [];

    let { width: w, height: h, depth: d } = BoidSetting.container;
    for (let i = 0; i < numberOfBoids; i++) {
      let b = new Boid();
      b.position.set(random(-w, w), random(-h, h), random(-d, d));
      this.boids.push(b);
    }
  }

  update() {
    for (var boid of this.boids) {
      boid.flock(this.boids);
    }

    for (let boid of this.boids) {
      boid.update();
      boid.edges();
    }
  }

  show() {
    noStroke();
    for (let boid of this.boids) {
      boid.show();
    }
  }
}
