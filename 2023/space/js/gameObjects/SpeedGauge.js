export default class SpeedGauge {
  constructor() {
    this.gaugeWidth = 300;
    this.gaugeHeight = 40;
  }

  show(ship, x, y) {
    const currentSpeed = ship.velocity.mag();
    const speedPercent = currentSpeed / ship.maxSpeed;

    this.drawPanel(x, y);
    this.drawGauge(x, y, speedPercent, currentSpeed, ship.maxSpeed);

    if (ship.boosting) {
      this.drawBoostIndicator(x, y);
    }
  }

  drawPanel(x, y) {
    // Outer glow
    noStroke();
    fill(0, 150, 255, 30);
    rect(x - this.gaugeWidth / 2 - 30, y - 35, this.gaugeWidth + 60, 70, 10);

    // Main panel
    fill(10, 20, 40, 200);
    stroke(0, 180, 255, 150);
    strokeWeight(2);
    rect(x - this.gaugeWidth / 2 - 20, y - 30, this.gaugeWidth + 40, 60, 8);

    // Corner accents
    this.drawCornerAccents(x, y);
  }

  drawCornerAccents(x, y) {
    stroke(0, 255, 200, 180);
    strokeWeight(2);
    noFill();

    const corners = [
      { dx: -this.gaugeWidth / 2 - 18, dy: -28 },
      { dx: this.gaugeWidth / 2 + 18, dy: -28 },
      { dx: -this.gaugeWidth / 2 - 18, dy: 28 },
      { dx: this.gaugeWidth / 2 + 18, dy: 28 },
    ];

    corners.forEach((corner) => {
      const signX = corner.dx > 0 ? -1 : 1;
      const signY = corner.dy > 0 ? -1 : 1;

      line(
        x + corner.dx,
        y + corner.dy,
        x + corner.dx + signX * 8,
        y + corner.dy
      );
      line(
        x + corner.dx,
        y + corner.dy,
        x + corner.dx,
        y + corner.dy + signY * 8
      );
    });
  }

  drawGauge(x, y, speedPercent, currentSpeed, maxSpeed) {
    // Gauge background
    noStroke();
    fill(5, 10, 20, 200);
    rect(
      x - this.gaugeWidth / 2,
      y - this.gaugeHeight / 2,
      this.gaugeWidth,
      this.gaugeHeight,
      5
    );

    // Gauge border
    noFill();
    stroke(0, 150, 255, 100);
    strokeWeight(1);
    rect(
      x - this.gaugeWidth / 2,
      y - this.gaugeHeight / 2,
      this.gaugeWidth,
      this.gaugeHeight,
      5
    );

    // Speed bar fill
    if (speedPercent > 0) {
      const barWidth = this.gaugeWidth * speedPercent;

      noStroke();
      fill(0, 200, 255, 40);
      rect(
        x - this.gaugeWidth / 2,
        y - this.gaugeHeight / 2,
        barWidth + 4,
        this.gaugeHeight,
        5
      );

      const speedColor = this.getSpeedColor(speedPercent);
      fill(speedColor.r, speedColor.g, speedColor.b, 200);
      rect(
        x - this.gaugeWidth / 2 + 2,
        y - this.gaugeHeight / 2 + 2,
        barWidth - 4,
        this.gaugeHeight - 4,
        3
      );

      fill(255, 255, 255, 100);
      rect(
        x - this.gaugeWidth / 2 + 2,
        y - this.gaugeHeight / 2 + 2,
        barWidth - 4,
        8,
        3
      );
    }

    this.drawTickMarks(x, y);
    this.drawSpeedText(x, y - 8, currentSpeed, maxSpeed);
  }

  drawTickMarks(x, y) {
    stroke(0, 150, 255, 80);
    strokeWeight(1);

    for (let i = 0; i <= 10; i++) {
      const tickX = x - this.gaugeWidth / 2 + (this.gaugeWidth / 10) * i;
      const tickHeight = i % 5 === 0 ? 12 : 8;
      line(
        tickX,
        y - this.gaugeHeight / 2,
        tickX,
        y - this.gaugeHeight / 2 + tickHeight
      );
      line(
        tickX,
        y + this.gaugeHeight / 2,
        tickX,
        y + this.gaugeHeight / 2 - tickHeight
      );
    }
  }

  drawSpeedText(x, y, currentSpeed, maxSpeed) {
    fill(0, 200, 255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    textFont("monospace");
    text("VELOCITY", x, y - 20);

    textSize(16);
    fill(0, 255, 200);
    text(currentSpeed.toFixed(2), x - 35, y + 10);

    textSize(10);
    fill(100, 150, 200);
    text(`/ ${maxSpeed.toFixed(1)}`, x + 20, y + 10);

    textSize(9);
    fill(80, 130, 180);
    text("U/S", x + 60, y + 10);
  }

  drawBoostIndicator(x, y) {
    const pulseAlpha = map(sin(frameCount * 0.2), -1, 1, 100, 255);

    noStroke();
    fill(255, 100, 150, pulseAlpha);
    triangle(
      x - this.gaugeWidth / 2 - 40,
      y,
      x - this.gaugeWidth / 2 - 50,
      y - 8,
      x - this.gaugeWidth / 2 - 50,
      y + 8
    );

    triangle(
      x + this.gaugeWidth / 2 + 40,
      y,
      x + this.gaugeWidth / 2 + 50,
      y - 8,
      x + this.gaugeWidth / 2 + 50,
      y + 8
    );

    fill(255, 150, 200, pulseAlpha);
    textAlign(CENTER, CENTER);
    textSize(10);
    textFont("monospace");
    text("BOOST", x, y + 45);
  }

  getSpeedColor(speedPercent) {
    if (speedPercent < 0.5) {
      const t = speedPercent * 2;
      return {
        r: lerp(0, 255, t),
        g: lerp(255, 255, t),
        b: lerp(255, 0, t),
      };
    } else {
      const t = (speedPercent - 0.5) * 2;
      return {
        r: 255,
        g: lerp(255, 100, t),
        b: 0,
      };
    }
  }
}
