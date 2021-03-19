class ViewPort {
    constructor(_x, _y, _target) {
        this.position = createVector(_x, _y);
        this.target = _target;
        this.followTarget = true;
    }

    run() {
        translate(-this.position.x + width * .5, -this.position.y + height * .5); // width, height of canvas
        if (this.target && this.followTarget) {
            this.position = p5.Vector.lerp(this.position, this.target.position, 0.1);
        }
    }
}