let boids = [];
let mouse;

function setup() {
  createCanvas(800, 600);

  for (let i = 0; i < 100; i++) boids.push(new Boid());

  boids[0].debug = true;
}

function draw() {
  background(30);

  for (let boid of boids) {
    boid.flock(boids);
  }

  for (let boid of boids) {
    boid.update();
    boid.edges();
    boid.show();
  }
}

function mousePressed() {
  for (let boid of boids) {
    boid.target = createVector(mouseX, mouseY);
  }
}

function mouseDragged() {
  for (let boid of boids) {
    boid.target = createVector(mouseX, mouseY);
  }
}

function mouseReleased() {
  for (let boid of boids) {
    boid.target = null;
  }
}
