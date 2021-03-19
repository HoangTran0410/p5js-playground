class Joystick {
    constructor(config = {}) {
        const {
            position = createVector(width / 2, height / 2),
            radius = 50,
            buttonRadius = radius / 2.5,
            onChange = function () { },
            isAcceptHandPosition = function (x, y) { return true; }
        } = config

        this.position = position;
        this.radius = radius;
        this.buttonRadius = buttonRadius;

        this.handPosition = position.copy();
        this.onChange = onChange;
        this.isAcceptHandPosition = isAcceptHandPosition
    }

    run() {
        let controling = false;

        if (touches.length) {
            for (let m of touches) {
                if (this.isAcceptHandPosition(m.x, m.y)) {
                    controling = m;
                    break;
                }
            }
        }

        if (controling) {
            this.setHandPosition(controling.x, controling.y);
        } else {
            this.resetHandPosition();
        }

        this.display();
    }

    display() {
        strokeWeight(3);
        stroke(150, 50);
        line(this.position.x, this.position.y, this.handPosition.x, this.handPosition.y);

        noStroke();
        strokeWeight(1);
        fill(150, 50);
        ellipse(this.position.x, this.position.y, this.radius * 2);
        ellipse(this.handPosition.x, this.handPosition.y, this.buttonRadius * 2);
    }

    getDirectionVector() {
        let direction = p5.Vector.sub(this.handPosition, this.position);
        let value = map(direction.mag(), 0, this.radius - this.buttonRadius, 0, 1);

        return direction.setMag(value);
    }

    setHandPosition(x, y) {
        let direction = p5.Vector.sub(createVector(x, y), this.position);
        let constrain = direction.limit(this.radius - this.buttonRadius);

        this.handPosition = p5.Vector.add(this.position, constrain);
        this.onChange();
    }

    resetHandPosition() {
        this.handPosition = this.position.copy();
    }
}

class MyMouseEvent {
    constructor(config = {}) {
        this.mouseWasPressed = false;
    }

    update() {
        this.mouseWasPressed = mouseIsPressed;
    }

    isPress() {
        return !this.mouseWasPressed && mouseIsPressed;
    }
    isDown() {
        return mouseIsPressed;
    }
    isRelease() {
        return this.mouseWasPressed && !mouseIsPressed;
    }
    isDrag() {
        let mouseChange = dist(pmouseX, pmouseY, mouseX, mouseY);
        return this.mouseWasPressed && mouseIsPressed && mouseChange > 0;
    }
}

export default Joystick;