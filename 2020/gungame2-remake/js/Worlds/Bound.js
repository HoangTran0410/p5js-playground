class RectBound {
    constructor(config = {}) {
        const {
            position = createVector(0, 0),
            width = Infinity,
            height = Infinity,
        } = config

        this.position = position
        this.width = width
        this.height = height
    }

    getBoundEdge() {
        return {
            top: this.position.y - this.height * .5,
            bottom: this.position.y - this.height * .5,
            left: this.position.x - this.width * .5,
            right: this.position.x + this.width * .5
        }
    }

    isContain(config = {}) {
        const {
            target,
            checkRadius = true
        } = config

        const {
            position = createVector(0, 0),
            radius = 0
        } = target

        let r = (checkRadius ? radius : 0)

        return (position.x - r >= this.position.x - this.width * .5 &&
            position.x + r <= this.position.x + this.width * .5 &&
            position.y - r > this.position.y - this.height * .5 &&
            position.y + r < this.position.y + this.height * .5)
    }

    isIntersects(config = {}) {
        const {
            target,
            offset = 0
        } = config

        const {
            position = createVector(0, 0),
            radius = 0
        } = target

        // p5.collide use CORNER mode 
        let pos = this.toCornerMode()
        let w = this.width + offset * 2
        let h = this.height + offset * 2
        let d = radius * 2

        return collideRectCircle(pos.x, pos.y, w, h, position.x, position.y, d)
    }

    toCornerMode() {
        let x = this.position.x - this.width * .5
        let y = this.position.y - this.height * .5
        return createVector(x, y)
    }

    display(config = {}) {
        const {
            strokeColor = '#fff'
        } = config

        noFill()
        stroke(strokeColor)
        strokeWeight(1)

        rect(this.position.x, this.position.y, this.width, this.height)
    }
}

export default RectBound