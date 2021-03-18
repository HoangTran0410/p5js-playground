class Point {
    constructor(px, py) {
        this.x = px;
        this.y = py;
    }

    add(vx, vy) {
        this.x += vx;
        this.y += vy;
        return this;
    }

    addVec(point) {
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    copy() {
        return new Point(this.x, this.y);
    }

    getRectContainer() {
        return new Rectangle(this.x, this.y, 0, 0);
    }

    show(drawContainer) {
        strokeWeight(3);
        stroke(200);
        point(this.x, this.y);

        drawContainer && this.getRectContainer().show();
    }
}

class Line {
    constructor(x1, y1, x2, y2) {
        this.head = new Point(x1, y1);
        this.tail = new Point(x2, y2);
    }

    getRectContainer() {
        var w = abs(this.head.x - this.tail.x);
        var h = abs(this.head.y - this.tail.y);
        return new Rectangle((this.head.x + this.tail.x) / 2, (this.head.y + this.tail.y) / 2, w, h);
    }

    show(drawContainer) {
        strokeWeight(1);
        stroke(200);
        line(this.head.x, this.head.y, this.tail.x, this.tail.y);

        drawContainer && this.getRectContainer().show();
    }
}

class Circle {
    constructor(px, py, r) {
        this.center = new Point(px, py);
        this.radius = r;
    }

    getRectContainer() {
        var w, h;
        w = h = this.radius * 2;
        return new Rectangle(this.center.x, this.center.y, w, h);
    }

    show(drawContainer) {
        stroke(200);
        noFill();
        ellipse(this.center.x, this.center.y, this.radius * 2);

        drawContainer && this.getRectContainer().show();
    }
}

class Rectangle {
    constructor(px, py, w, h) {
        this.center = new Point(px, py);
        this.width = w;
        this.height = h;
    }

    show() {
        stroke(200);
        noFill();
        rectMode(CENTER);
        rect(this.center.x, this.center.y, this.width, this.height);
    }
}

class Polygon {
    constructor(x, y, arrCorners, isPoints) {
        this.center = new Point(x, y);
        
        if (isPoints) {
            this.corners = arrCorners;
        } else {
            if (arrCorners.length % 2 == 1) alert("Số lượng đỉnh của polygon không hơp lệ!");

            this.corners = [];
            for (var i = 0; i < arrCorners.length; i += 2) {
                this.corners.push(new Point(arrCorners[i], arrCorners[i + 1]));
            }
        }
    }

    getRectContainer() {
        var top, down, left, right;
        top = down = this.corners[0].y;
        right = left = this.corners[0].x;

        for (var p of this.corners) {
            if (p.x > right) right = p.x;
            if (p.x < left) left = p.x;
            if (p.y > down) down = p.y;
            if (p.y < top) top = p.y;
        }

        var centerY = this.center.y + (top + down) / 2;
        var centerX = this.center.x + (left + right) / 2;
        var w = right - left;
        var h = down - top;
        return new Rectangle(centerX, centerY, w, h);
    }

    show(drawContainer) {
        stroke(200);
        noFill();
        beginShape();
        for (var v of this.corners) {
            vertex(this.center.x + v.x, this.center.y + v.y);
        }
        endShape(CLOSE);

        drawContainer && this.getRectContainer().show();
    }
}