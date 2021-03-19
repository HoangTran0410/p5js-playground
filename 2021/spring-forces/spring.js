export default class Spring {
    constructor(k, l, a, b, maxl, twoWay = true) {
        this.k = k;
        this.l = l;
        this.a = a;
        this.b = b;

        this.twoWay = twoWay;
        this.maxL = maxl || Infinity;
        this.currentL = l;

        this.isBroken = false;
    }

    update() {
        let force = p5.Vector.sub(this.a.position, this.b.position);

        this.currentL = force.mag();

        if (this.currentL > this.maxL) {
            this.isBroken = true;
        }

        let x = this.currentL - this.l;

        if (!this.twoWay && x < 0) return;

        force.normalize();

        force.mult(this.k * x);
        this.b.applyForce(force);

        force.mult(-1);
        this.a.applyForce(force);
    }

    show() {
        strokeWeight(map(this.currentL, this.l, this.maxL, 6, 1));
        // strokeWeight(4);
        stroke(map(this.currentL, this.l, this.maxL, 70, 255), 70, 70);
        line(
            this.a.position.x,
            this.a.position.y,
            this.b.position.x,
            this.b.position.y
        );
    }
}
