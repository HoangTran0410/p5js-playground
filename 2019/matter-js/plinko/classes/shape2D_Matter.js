class Shape2D {
    constructor(x, y, vertices, option) {
        if (x && y && vertices) {
            this.body = Bodies.fromVertices(x, y, vertices, option);
        }
    }

    addToWorld(world) {
        World.add(world, this.body);
    }

    isOffScreen() {
        return this.body.position.x < -200 || this.body.position.x > width + 200 ||
            this.body.position.y < -200 || this.body.position.y > height + 200
    }

    removeFrom(arr, world) {
        World.remove(world, this.body);
        arr.splice(arr.indexOf(this), 1);
    }

    calColor() {
        if (this.body.isStatic) {
            fill(65);
        } else {
            fill(this.col);
        }
        noStroke();
    }
}

class Box extends Shape2D {
    constructor(x, y, w, h, option) {
        super();
        this.body = Bodies.rectangle(x, y, w, h, option);
        this.col = [random(255), random(255), random(255)];
    }

    show() {
        this.calColor();

        beginShape();
        for (var p of this.body.vertices) {
            vertex(p.x, p.y);
        }
        endShape(CLOSE);
    }
}

class Circle extends Shape2D {
    constructor(x, y, r, option) {
        super();
        this.body = Bodies.circle(x, y, r, option);
        this.col = [random(255), random(255), random(255)];
    }

    show() {
        push();
        translate(this.body.position.x, this.body.position.y);
        rotate(this.body.angle);

        this.calColor();
        ellipse(0, 0, this.body.circleRadius * 2);

        // direction of ball
        if (!this.body.isStatic) {
            stroke(200);
            strokeWeight(2);
            line(0, 0, this.body.circleRadius - 2, 0);
        }
        pop();
    }
}