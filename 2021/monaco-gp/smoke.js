class Smoke {
    constructor(x, y, r = random(5, 10)) {
        this.pos = createVector(x, y);
        this.r = r;
        this.originalR = r;

        this.c = random([200, 100, 150]);
    }

    update() {
        this.r += 0.5;
        this.pos.add(random(-3, 3), random(-3, 3));
    }

    show() {
        let alpha = map(this.r, this.originalR, this.originalR * 2, 255, 50);
        fill(this.c, alpha);
        circle(this.pos.x, this.pos.y, this.r * 2);
    }

    isGone() {
        return this.r <= 0;
    }
}
