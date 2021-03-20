class Car {
    constructor(x, y, w, h, maxSpeed = 3, img) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.size = createVector(w, h);
        this.maxSpeed = maxSpeed;
        this.img = img;

        this.color = [random(255), random(255), random(255)];
        this.braking = false;

        this.preTrack = createVector(x, y);
        this.wheelTracks = [];
        this.smokeTracks = [];
    }

    update() {
        this.pos.add(this.vel);
        this.vel.mult(0.98);

        this.bound();
        this.track();

        for (let i = this.smokeTracks.length - 1; i >= 0; i--) {
            this.smokeTracks[i].update();

            if (this.smokeTracks[i].isGone()) {
                this.smokeTracks.splice(i, 1);
            }
        }
    }

    show() {
        for (let s of this.smokeTracks) {
            s.show();
        }

        if (currentDayTime < 6 || currentDayTime > 18) {
            this.showLight();
        }

        if (-this.vel.y > this.maxSpeed + 1) {
            this.showSpeedup();
        }

        if (this.img) {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(-PI / 2);
            image(this.img, 0, 0, this.size.y * 1.25, this.size.x * 1.8);
            pop();

            // stroke(80);
            // strokeWeight(1);
            // noFill();
            // rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        } else {
            fill(this.color);
            strokeWeight(3);
            stroke(0);
            rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
    }

    showSpeedup() {
        let pos1 = createVector(
            this.pos.x - this.size.x / 3,
            this.pos.y + this.size.y / 2
        );
        let pos2 = createVector(
            this.pos.x + this.size.x / 3,
            this.pos.y + this.size.y / 2
        );

        fill('orange');
        stroke('yellow');
        ellipse(pos1.x, pos1.y, 15, 25);
        ellipse(pos2.x, pos2.y, 15, 25);

        if (random(1) < 0.3)
            this.smokeTracks.push(
                new Smoke(pos1.x, pos1.y),
                new Smoke(pos2.x, pos2.y)
            );
    }

    showLight() {
        let { x, y } = this.size;

        push();
        translate(this.pos.x, this.pos.y);
        fill(255, random(40, 80));
        noStroke();
        triangle(
            -x / 2 + 5,
            -y / 2 + 5,
            -x / 2 - 20,
            -y / 2 - 40,
            -x / 2 + 20,
            -y / 2 - 40
        );
        triangle(
            x / 2 - 5,
            -y / 2 + 5,
            x / 2 - 20,
            -y / 2 - 40,
            x / 2 + 20,
            -y / 2 - 40
        );
        pop();
    }

    showTracks() {
        fill(70);
        noStroke();
        // stroke(70);
        // strokeWeight(5);
        // noFill();
        beginShape();
        for (let t of this.wheelTracks) {
            vertex(t.x - this.size.x / 2, t.y);
        }
        endShape();

        beginShape();
        for (let t of this.wheelTracks) {
            vertex(t.x + this.size.x / 2, t.y);
        }
        endShape();
    }

    track() {
        if (p5.Vector.dist(this.preTrack, this.pos) > 30) {
            this.wheelTracks.push(this.pos.copy().add(0, this.size.y / 2));
            this.preTrack.set(this.pos.x, this.pos.y + this.size.y / 2);

            if (this.wheelTracks.length > 10) {
                this.wheelTracks.shift();
            }
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
        if (this.pos.x < this.size.x / 2) {
            this.vel.x *= -0.3;
            this.pos.x = this.size.x / 2;
        }
        if (this.pos.x > width - this.size.x / 2) {
            this.vel.x *= -0.3;
            this.pos.x = width - this.size.x / 2;
        }
    }

    brake() {
        this.vel.mult(0.9);
    }

    speedUp() {
        this.vel.y -= 3;
    }

    moveUp() {
        if (this.vel.y > -this.maxSpeed) this.vel.y -= 0.1;
    }
    moveLeft() {
        if (this.vel.x > -this.maxSpeed) this.vel.x -= 0.5;
    }
    moveRight() {
        if (this.vel.x < this.maxSpeed) this.vel.x += 0.5;
    }
}
