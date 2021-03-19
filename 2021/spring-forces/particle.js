export default class Particle {
    constructor(x, y, r = 15) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.radius = r;
        this.isLocked = false;
    }

    pullTo(x, y) {
        let pos = this.position.copy();
        pos = p5.Vector.lerp(pos, createVector(x, y), 0.2);

        this.velocity.set(x - this.position.x, y - this.position.y);
        this.position.set(pos.x, pos.y);
    }

    update() {
        if (!this.isLocked) {
            this.velocity.add(this.acc);
            this.position.add(this.velocity);
            this.velocity.mult(0.99);
            this.acc.mult(0);
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    show() {
        stroke(30);
        strokeWeight(2);
        fill(this.isLocked ? "gray" : "#25f");
        circle(this.position.x, this.position.y, this.radius * 2);
    }

    checkCollision(other) {
        // https://p5js.org/examples/motion-bouncy-bubbles.html
        let spring = 0.1;
        let dx = other.position.x - this.position.x;
        let dy = other.position.y - this.position.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDist = other.radius + this.radius;

        if (distance < minDist) {
            let angle = atan2(dy, dx);
            let targetX = this.position.x + cos(angle) * minDist;
            let targetY = this.position.y + sin(angle) * minDist;
            let ax = (targetX - other.position.x) * spring;
            let ay = (targetY - other.position.y) * spring;

            if (this.isLocked && !other.isLocked) {
                other.acc.x += ax * 2;
                other.acc.y += ay * 2;
                other.position.x += ax * 2;
                other.position.y += ay * 2;
            } else if (!this.isLocked && other.isLocked) {
                this.acc.x -= ax * 2;
                this.acc.y -= ay * 2;
                this.position.x -= ax * 2;
                this.position.y -= ay * 2;
            } else if (!this.isLocked && !other.isLocked) {
                this.acc.x -= ax;
                this.acc.y -= ay;
                other.acc.x += ax;
                other.acc.y += ay;

                this.position.x -= ax;
                this.position.y -= ay;
                other.position.x += ax;
                other.position.y += ay;
            }
        }
    }
}
