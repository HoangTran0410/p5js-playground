class Car {
    constructor(x, y, w, h, maxSpeed = 3, img) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.size = createVector(w, h);
        this.maxSpeed = maxSpeed;
        this.img = img;

        this.color = [random(255), random(255), random(255)];
        this.braking = false;
    }

    update() {
        this.pos.add(this.vel);
        this.vel.limit(this.maxSpeed);
        this.vel.mult(0.99);

        this.bound();
    }

    show() {
        if (this.img) {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(-PI / 2);
            image(this.img, 0, 0, this.size.y * 1.25, this.size.x * 1.8);
            pop();

            stroke(80);
            strokeWeight(1);
            noFill();
            rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        } else {
            fill(this.color);
            strokeWeight(3);
            stroke(0);
            rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
    }

    checkCollide(other) {
        return (
            this.pos.x + this.size.x / 2 > other.pos.x - this.size.x / 2 &&
            this.pos.x - this.size.x / 2 < other.pos.x + this.size.x / 2 &&
            this.pos.y + this.size.y / 2 > other.pos.y - this.size.y / 2 &&
            this.pos.y - this.size.y / 2 < other.pos.y + this.size.y / 2
        );
    }

    bound() {
        if (this.pos.x < 0) this.pos.x = 0;
        if (this.pos.x > width) this.pos.x = width;
    }

    brake() {
        this.vel.mult(0.8);
    }

    speedUp() {
        this.vel.y -= 3;
    }

    moveUp() {
        this.vel.y -= 0.1;
    }
    moveDown() {
        this.vel.y += 0.1;
    }
    moveLeft() {
        this.vel.x -= 0.5;
    }
    moveRight() {
        this.vel.x += 0.5;
    }
}
