class MapGame {
	constructor(config = {}) {

		const {
			position,
			width = 500,
			height = 500,
			gridSize = 500
		} = config

		this.position = position || createVector(width * .5, height * .5)
		this.width = width
		this.height = height
		this.gridSize = gridSize
	}

	drawEdge(config = {}) {
		
		const {
			color = '#fffa',
			strokeWeightValue = 1
		} = config

		push()
		translate(this.position.x - this.width * .5, this.position.y - this.height * .5)

		noFill()
		stroke(color)
		strokeWeight(strokeWeightValue)
		line(0, 0, this.width, 0)
		line(0, 0, 0, this.height)
		line(0, this.height, this.width, this.height)
		line(this.width, 0, this.width, this.height)

		pop()
	}

	drawGrid(config = {}) {

		const {
			bound,
			color = "#5553",
			strokeWeightValue = 3
		} = config

		let left = max(bound.left, this.position.x - this.width / 2)
		let right = min(bound.right, this.position.x + this.width / 2)
		let top = max(bound.top, this.position.y - this.height / 2)
		let bottom = min(bound.bottom, this.position.y + this.height / 2)

        stroke(color);
        strokeWeight(strokeWeightValue);
        var delta = 1;

        for (var x = left; x < right; x += delta) {
            if (floor(x) % this.gridSize == 0) {
                /* while you find 1 x%this.gridSize==0 
                => delta will equal this.gridSize => shorter loop */
                delta = this.gridSize;
                line(x, top, x, bottom);
            }
        }

        // do the same thing to y axis
        delta = 1;
        for (var y = top; y < bottom; y += delta) {
            if (floor(y) % this.gridSize == 0) {
                delta = this.gridSize;
                line(left, y, right, y);
            }
        }
    }

	getBound() {
		let x = this.position.x
		let y = this.position.y
		let w1 = this.width * .5
		let h1 = this.height * .5

		return {
			top: y - h1,
			bottom: y + h1,
			left: x - w1,
			right: x + w1
		}
	}
}

export default MapGame