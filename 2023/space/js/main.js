import StarField from "./gameObjects/StarField.js";
import Ship from "./gameObjects/Ship.js";
import Camera from "./gameObjects/Camera.js";
import Planet from "./gameObjects/Planet.js";

let starField,
  ship,
  cam,
  planets = [];

export function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  ship = new Ship();
  cam = new Camera();
  cam.follow(ship.position);

  starField = new StarField(displayHeight / 2);

  // create 10 planets, not overlapping
  for (let i = 0; i < 2; i++) {
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
  starField.show(cam);

  cam.update();
  cam.beginState();

  let planetToAttach = false;
  for (let planet of planets) {
    let d = p5.Vector.dist(planet.position, ship.position);

    if (d < planet.radius + ship.radius) ship.collide(planet);
    if (d < planet.radius * 1.5) planetToAttach = planet;
    if (d < planet.radius * 1.5) planet.gravity(ship);

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
    ship.boost(0.06);
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
    cam.zoom(cam.scale * 0.02);
  }
  if (keyIsDown(83)) {
    cam.zoom(-cam.scale * 0.02);
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
