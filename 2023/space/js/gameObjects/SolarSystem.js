import Planet from "./Planet.js";
import { createRadialGradient } from "../utils/utils.js";

export default class SolarSystem {
  constructor(x, y, sunRadius = 800) {
    this.position = createVector(x, y);
    this.sunRadius = sunRadius;
    this.sunColor = "#FDB813"; // Sun yellow/orange color

    this.planets = [];
    this.orbitData = []; // Store orbit parameters for each planet

    this.createPlanets();
  }

  createPlanets() {
    // Define planetary system with realistic-ish proportions
    // Each entry: [orbitRadius, planetRadius, orbitSpeed, startAngle, color]
    const planetConfigs = [
      { orbit: 1500, radius: 80, speed: 0.02, angle: 0, color: "#8B7355" }, // Mercury-like
      {
        orbit: 2200,
        radius: 150,
        speed: 0.015,
        angle: PI / 3,
        color: "#CD853F",
      }, // Venus-like
      { orbit: 3000, radius: 180, speed: 0.01, angle: PI, color: "#4169E1" }, // Earth-like
      {
        orbit: 3800,
        radius: 120,
        speed: 0.008,
        angle: PI * 1.5,
        color: "#CD4F39",
      }, // Mars-like
      {
        orbit: 5500,
        radius: 400,
        speed: 0.004,
        angle: PI / 4,
        color: "#DAA520",
      }, // Jupiter-like
      {
        orbit: 7200,
        radius: 350,
        speed: 0.003,
        angle: PI * 0.7,
        color: "#F4A460",
      }, // Saturn-like
      {
        orbit: 8500,
        radius: 250,
        speed: 0.002,
        angle: PI * 1.2,
        color: "#4FD5D6",
      }, // Uranus-like
      {
        orbit: 9800,
        radius: 240,
        speed: 0.0015,
        angle: PI * 1.8,
        color: "#4169E1",
      }, // Neptune-like
    ];

    for (let config of planetConfigs) {
      // Calculate initial position
      let x = this.position.x + config.orbit * cos(config.angle);
      let y = this.position.y + config.orbit * sin(config.angle);

      // Create planet at calculated position
      let planet = new Planet(x, y, config.radius);
      planet.colour = config.color; // Override default color

      this.planets.push(planet);

      // Store orbit data
      this.orbitData.push({
        orbitRadius: config.orbit,
        orbitSpeed: config.speed,
        currentAngle: config.angle,
      });
    }
  }

  update() {
    // Update each planet's position based on its orbit
    for (let i = 0; i < this.planets.length; i++) {
      let planet = this.planets[i];
      let orbit = this.orbitData[i];

      // Increment angle
      orbit.currentAngle += orbit.orbitSpeed;

      // Calculate new position
      let x = this.position.x + orbit.orbitRadius * cos(orbit.currentAngle);
      let y = this.position.y + orbit.orbitRadius * sin(orbit.currentAngle);

      // Update planet position
      planet.position.set(x, y);

      // Update planet's internal state (clouds, etc.)
      planet.update();
    }
  }

  show() {
    // Draw orbit paths (optional, subtle circles)
    noFill();
    stroke(255, 255, 255, 30);
    strokeWeight(1);
    for (let orbit of this.orbitData) {
      circle(this.position.x, this.position.y, orbit.orbitRadius * 2);
    }

    // Draw the sun
    this.drawSun();

    // Draw all planets
    for (let planet of this.planets) {
      planet.show();
    }
  }

  drawSun() {
    let { x, y } = this.position;
    let r = this.sunRadius;

    // Draw sun's corona/glow with multiple layers
    noStroke();

    // Outer corona
    createRadialGradient(x, y, r * 0.5, r * 4, [
      { stop: 0, color: "#FDB813" },
      { stop: 0.3, color: "#FD8813AA" },
      { stop: 0.6, color: "#FD881355" },
      { stop: 1, color: "#FD881300" },
    ]);
    circle(x, y, r * 4);

    // Middle glow
    createRadialGradient(x, y, 0, r * 2.5, [
      { stop: 0, color: "#FFEB3BFF" },
      { stop: 0.4, color: "#FDB813DD" },
      { stop: 0.7, color: "#FD881388" },
      { stop: 1, color: "#FD881322" },
    ]);
    circle(x, y, r * 2.5);

    // Inner bright core
    createRadialGradient(x, y, 0, r * 2, [
      { stop: 0, color: "#FFFFFF" },
      { stop: 0.3, color: "#FFEB3B" },
      { stop: 0.7, color: "#FDB813" },
      { stop: 1, color: "#FD8813" },
    ]);
    circle(x, y, r * 2);

    // Draw sun surface details (optional solar flares)
    fill(255, 220, 100, 100);
    noStroke();
    for (let i = 0; i < 8; i++) {
      let angle = (TWO_PI / 8) * i + frameCount * 0.002;
      let flareX = x + cos(angle) * r * 0.7;
      let flareY = y + sin(angle) * r * 0.7;
      circle(flareX, flareY, r * 0.3);
    }
  }

  // Get all planets for collision detection, gravity, etc.
  getPlanets() {
    return this.planets;
  }

  // Check if a point overlaps with any celestial body
  overlaps(x, y, r) {
    // Check sun
    let dSun = p5.Vector.dist(this.position, createVector(x, y));
    if (dSun < this.sunRadius + r) return true;

    // Check planets
    for (let planet of this.planets) {
      if (planet.overlaps(x, y, r)) return true;
    }

    return false;
  }
}
