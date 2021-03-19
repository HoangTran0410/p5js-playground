class MobileControl {
    constructor(config = {}) {
        const {
            position = createVector(width / 2, height / 2),
            radius = 50,
            onChange = function() {}
        } = config

        this.position = position
        this.radius = radius
        this.handPosition = this.position.copy().add(10, -10)
        this.buttonRadius = radius / 2.5
        this.onChange = onChange.bind(this)
    }

    display() {
        if (this.controlable) {
            strokeWeight(3)
            stroke(150, 50)
            line(this.position.x, this.position.y, this.handPosition.x, this.handPosition.y)

            noStroke()
            strokeWeight(1)
            fill(150, 50)
            circle(this.position.x, this.position.y, this.radius * 2)
            circle(this.handPosition.x, this.handPosition.y, this.buttonRadius * 2)
        }
    }

    setControlable(value) {
        this.controlable = value
    }

    getVector() {
        let direction = p5.Vector.sub(this.handPosition, this.position)
        let value = map(direction.mag(), 0, this.radius - this.buttonRadius, 0, 1)

        return direction.setMag(value)
    }

    setHandPosition(x, y) {
        if (this.controlable) {
            let direction = p5.Vector.sub(createVector(x, y), this.position)
            let constrain = direction.limit(this.radius - this.buttonRadius)

            this.handPosition = p5.Vector.add(this.position, constrain)
            this.onChange()
        }
        return this
    }

    resetHandPosition() {
        this.handPosition = this.position.copy()
        return this
    }

    isAcceptHandPosition(x, y) {
        return y > height / 2
        // return p5.Vector.dist(this.position, createVector(x, y)) < this.radius
    }

    // for mouse control
    mousePressed() {
        let check = this.isAcceptHandPosition(mouseX, mouseY)
        if (check) {
            this.position = createVector(mouseX, mouseY)
            this.setControlable(check)
        }
    }

    mouseReleased() {
        this.setControlable(false)
    }
}

export default MobileControl