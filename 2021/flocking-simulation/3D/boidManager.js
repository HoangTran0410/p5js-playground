class BoidManager {
  constructor(numberOfBoids = 50) {
    this.boids = [];

    let { width: w, height: h, depth: d } = BoidSetting.container;
    for (let i = 0; i < numberOfBoids; i++) {
      let b = new Boid();
      b.position.set(random(-w / 2, w / 2), random(-h / 2, h / 2), 0);
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
    for (let boid of this.boids) {
      boid.show();
    }
  }
}
