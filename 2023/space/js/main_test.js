import SolarSystem from "./gameObjects/SolarSystem.js";

let solarSystem;

export function setup() {
  createCanvas(windowWidth, windowHeight);

  solarSystem = new SolarSystem({ x: width / 2, y: height / 2 });
}

export function draw() {
  background(30);

  solarSystem.update();
  solarSystem.show();
}
