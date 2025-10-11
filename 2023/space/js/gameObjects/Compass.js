export default class Compass {
  constructor() {
    this.compassRadius = 60;
  }

  show(ship, cam, x, y) {
    const r = this.compassRadius;

    // Outer glow
    noStroke();
    fill(0, 150, 255, 30);
    circle(x, y, r * 2 + 40);

    // Background panel
    fill(10, 20, 40, 200);
    stroke(0, 180, 255, 150);
    strokeWeight(2);
    circle(x, y, r * 2 + 10);

    // Compass circle
    fill(5, 10, 20, 200);
    stroke(0, 150, 255, 100);
    strokeWeight(1);
    circle(x, y, r * 2);

    // Compass rotates to show angles relative to camera
    this.drawCardinalDirections(x, y, r, cam.rotate);
    this.drawShipIndicator(x, y, r, ship.heading, cam.rotate);
    this.drawCameraIndicator(x, y, r);
  }

  drawCardinalDirections(x, y, r, cameraRotation) {
    const directions = [
      { label: "N", angle: -PI / 2 },
      { label: "E", angle: 0 },
      { label: "S", angle: PI / 2 },
      { label: "W", angle: PI },
    ];

    textAlign(CENTER, CENTER);
    textSize(12);

    directions.forEach((dir) => {
      // Rotate direction based on camera rotation
      const angle = cameraRotation - dir.angle;
      const dx = cos(angle) * (r - 15);
      const dy = sin(angle) * (r - 15);

      fill(0, 200, 255, 200);
      noStroke();
      text(dir.label, x + dx, y + dy);

      const tickX1 = cos(angle) * (r - 8);
      const tickY1 = sin(angle) * (r - 8);
      const tickX2 = cos(angle) * (r - 2);
      const tickY2 = sin(angle) * (r - 2);

      stroke(0, 200, 255, 150);
      strokeWeight(2);
      line(x + tickX1, y + tickY1, x + tickX2, y + tickY2);
    });

    // Minor ticks
    for (let i = 0; i < 8; i++) {
      const angle = cameraRotation - (i * PI) / 4;
      if (i % 2 === 1) {
        const tickX1 = cos(angle) * (r - 5);
        const tickY1 = sin(angle) * (r - 5);
        const tickX2 = cos(angle) * (r - 2);
        const tickY2 = sin(angle) * (r - 2);

        stroke(0, 150, 255, 200);
        strokeWeight(1);
        line(x + tickX1, y + tickY1, x + tickX2, y + tickY2);
      }
    }

    // center dot
    fill(0, 255, 200);
    noStroke();
    circle(x, y, 6);
  }

  drawShipIndicator(x, y, r, shipHeading, cameraRotation) {
    // Ship indicator shows ship direction relative to camera view
    push();
    translate(x, y);
    rotate(shipHeading + PI / 2 + cameraRotation);

    // Pointer
    fill(255, 150, 200, 255);
    stroke(255, 200, 220);
    strokeWeight(1);
    triangle(0, -r + 8, -6, -r + 18, 6, -r + 18);

    // line to center
    stroke(255, 200, 100, 100);
    strokeWeight(1);
    line(0, -r + 8, 0, 0);

    pop();
  }

  drawCameraIndicator(x, y, r) {
    // Camera indicator always points up (at 0° relative to view)
    push();
    translate(x, y);

    const size = 8;
    const offset = r - 28;

    // Main square indicator
    fill(150, 255, 100, 255);
    stroke(200, 255, 150);
    strokeWeight(1);
    rect(-size / 2, -offset - size / 2, size, size);

    pop();
  }
}
