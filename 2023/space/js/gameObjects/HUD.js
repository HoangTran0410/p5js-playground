import SpeedGauge from "./SpeedGauge.js";
import Compass from "./Compass.js";

export default class HUD {
  constructor() {
    this.padding = 60;
    this.speedGauge = new SpeedGauge();
    this.compass = new Compass();
  }

  show(ship, cam) {
    push();

    // Speed gauge at bottom center
    const speedX = width / 2;
    const speedY = height - this.padding;
    this.speedGauge.show(ship, speedX, speedY);

    // Compass at bottom right
    const compassX = width - this.padding - 30;
    const compassY = height - this.padding - 30;
    this.compass.show(ship, cam, compassX, compassY);

    pop();
  }
}
