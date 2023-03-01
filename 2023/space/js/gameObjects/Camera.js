export default class Camera {
  constructor({
    position = createVector(width / 2, height / 2),
    target = null, // target is a gameObject's position
    isFollow = true,
    followLerp = 0.1,
    scale = 1,
    scaleTo = 0.1,
    scaleLerp = 0.09,
    maxScale = 1,
    minScale = 0.1,
    rotate = 0,
    rotateTo = 0,
    rotateLepr = 0.08,
    borderSize = 25,
    borderSpeed = 30,
  } = {}) {
    // default value
    this.position = position;
    this.target = target;
    this.isFollow = isFollow;
    this.followLerp = followLerp;
    this.scale = scale;
    this.scaleTo = scaleTo;
    this.scaleLerp = scaleLerp;
    this.maxScale = maxScale;
    this.minScale = minScale;
    this.rotate = rotate;
    this.rotateTo = rotateTo;
    this.rotateLepr = rotateLepr;
    this.borderSize = borderSize;
    this.borderSpeed = borderSpeed;
  }

  update() {
    this.scale = lerp(this.scale, this.scaleTo, this.scaleLerp);
    this.rotate = lerp(this.rotate, this.rotateTo, this.rotateLepr);

    if (this.planet) {
      let dir = p5.Vector.sub(this.planet.position, this.target);
      this.scaleTo = height / dir.mag();

      // make rotation smooth
      let angle = -dir.heading() + PI / 2;
      let diff = angle - this.rotateTo;
      if (abs(diff) > PI) diff = (diff + TWO_PI) % TWO_PI; // TODO: recheck logic
      this.rotateTo += diff;
    }

    // follow target
    if (this.isFollow) {
      this.position = p5.Vector.lerp(
        this.position,
        this.target,
        this.followLerp
      );
    }

    // move camera on edge
    else if (this.isMouseOnEdge()) {
      let vec = createVector(
        mouseX - width * 0.5,
        mouseY - height * 0.5
      ).setMag(this.borderSpeed);
      this.position.add(vec);
    }
  }

  detachFromPlanet() {
    if (this.planet) {
      this.planet = null;
      this.zoomTo(0.1);
    }
  }

  attachToPlanet(planet) {
    this.planet = planet;
  }

  beginState() {
    push();
    translate(width * 0.5, height * 0.5);
    scale(this.scale);
    rotate(this.rotate);
    translate(-this.position.x, -this.position.y);
  }

  endState() {
    pop();
  }

  follow(target, immediately) {
    this.target = target;

    if (immediately) this.position.set(target.x, target.y);
  }

  zoom(offset, immediately) {
    this.scaleTo += offset;
    this.scaleTo = constrain(this.scaleTo, this.minScale, this.maxScale);

    if (immediately) this.scale = this.scaleTo;
  }

  zoomTo(scale, immediately) {
    let offset = scale - this.scaleTo;
    this.zoom(offset, immediately);
  }

  turn(offset, immediately) {
    this.rotateTo += offset;
    if (immediately) this.rotate = this.rotateTo;
  }

  turnTo(angle, immediately) {
    let offset = angle - this.rotateTo;
    this.turn(offset, immediately);
  }

  getViewport() {
    let topLeftCanvas = this.canvasToWorld(0, 0);
    let bottomRightCanvas = this.canvasToWorld(width, height);

    return {
      x: topLeftCanvas.x,
      y: topLeftCanvas.y,
      w: bottomRightCanvas.x - topLeftCanvas.x,
      h: bottomRightCanvas.y - topLeftCanvas.y,
    };
  }

  canvasToWorld(canvasX, canvasY) {
    let worldX = (canvasX - width * 0.5) / this.scale + this.position.x;
    let worldY = (canvasY - height * 0.5) / this.scale + this.position.y;

    return createVector(worldX, worldY);
  }

  worldToCanvas(worldX, worldY) {
    let canvasX = (worldX - this.position.x) * this.scale + width * 0.5;
    let canvasY = (worldY - this.position.y) * this.scale + height * 0.5;

    return createVector(canvasX, canvasY);
  }

  isMouseOnEdge() {
    return (
      mouseX > width - this.borderSize ||
      mouseX < this.borderSize ||
      mouseY > height - this.borderSize ||
      mouseY < this.borderSize
    );
  }
}
