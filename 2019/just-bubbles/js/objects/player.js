class Player extends PhysicObject {
    constructor(_x, _y, _r) {
        super(_x, _y, _r, 0, 0, 0, 0);
        this.color = [random(255), random(255), random(255)];
    }

    show() {
        // fill(this.color, 100);
        fill(100, 40)
        strokeWeight(1);
        stroke(150);

        ellipse(this.position.x, this.position.y, this.radius * 2);
    }
}