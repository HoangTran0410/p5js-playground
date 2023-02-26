import StarField from "./starField.js";
import Ship from "./ship.js";
import Camera from "./camera.js";
import Planet from "./planet.js";

let starField,
  ship,
  cam,
  planets = [];

export function setup() {
  createCanvas(windowWidth, windowHeight);

  ship = new Ship();

  cam = new Camera();
  cam.follow(ship.position);

  starField = new StarField(500, cam);

  // create 10 planets, not overlapping
  for (let i = 0; i < 10; i++) {
    let x, y, r;
    do {
      x = random(-width * 3, width * 3);
      y = random(-height * 3, height * 3);
      r = random(100, 500);
    } while (planets.some((p) => p.overlaps(x, y, r * 2)));
    planets.push(new Planet(x, y, r));
  }
}

export function draw() {
  background(30);

  starField.update();
  starField.draw();

  cam.update();
  cam.beginState();

  for (let planet of planets) {
    let d = p5.Vector.dist(planet.position, ship.position);
    if (d < planet.radius * 2) {
      planet.gravity(ship);
      ship.collide(planet);
    }

    planet.update();
    planet.show();
  }

  ship.update();
  ship.show();

  cam.endState();

  if (keyIsDown(UP_ARROW)) {
    ship.boost(0.6);
  }
  if (keyIsDown(LEFT_ARROW)) {
    ship.turn(-0.05);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    ship.turn(0.05);
  }
}

export function keyPressed() {}

export function keyReleased() {
  if (keyCode == UP_ARROW) {
    ship.boost(0);
  }
}

export function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true);
}
