export default class Cloud {
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

    this.xoff += Math.max(speed, 0.001);
  }
}
