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
  for (let i = 0; i < 5; i++) {
    let x, y, r;
    do {
      x = random(-3000, 3000);
      y = random(-3000, 3000);
      r = random(500, 1000);
    } while (planets.some((p) => p.overlaps(x, y, r * 2)));
    planets.push(new Planet(x, y, r));
  }
}

export function draw() {
  background(30);

  // starField.update();
  starField.draw(cam);

  cam.update();
  cam.beginState();

  let planetToAttach = false;
  for (let planet of planets) {
    let d = p5.Vector.dist(planet.position, ship.position);

    if (d < planet.radius + 500) {
      planetToAttach = planet;
      planet.gravity(ship);
      ship.collide(planet);
    }

    planet.update();
    planet.show();
  }
  if (planetToAttach) {
    cam.attachToPlanet(planetToAttach);
    ship.renderIgnoreScale = false;
  } else {
    ship.renderIgnoreScale = cam.scale < 0.25;
    cam.detachFromPlanet();
  }

  ship.update();
  ship.show(cam);

  cam.endState();

  // controls
  if (keyIsDown(UP_ARROW)) {
    ship.boost(0.6);
  }
  if (keyIsDown(LEFT_ARROW)) {
    ship.turn(-0.05);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    ship.turn(0.05);
  }
  if (keyIsDown(65)) {
    cam.turn(0.05);
  }
  if (keyIsDown(68)) {
    cam.turn(-0.05);
  }
  if (keyIsDown(87)) {
    cam.zoom(0.02);
  }
  if (keyIsDown(83)) {
    cam.zoom(-0.02);
  }
}

export function mouseWheel(event) {
  cam.zoom(-event.delta / 500);
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
