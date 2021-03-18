class Camera {
	constructor(config = {}) {

		const {
			position = createVector(0, 0), // vị trí camera
			target = { // target là 1 vật thể, có chứa thuộc tính position bên trong
				position: createVector(0, 0)
			},
			followTarget = true, // di chuyển camera theo target hay không
			followSpeed = 0.1,
			scale = 1,
			borderSize = 30,
			constrainBound = {
				top: -Infinity,
				bottom: Infinity,
				left: -Infinity,
				right: Infinity
			}
		} = config

		this.position = position
		this.target = target
		this.followTarget = followTarget
		this.followSpeed = followSpeed
		this.scale = scale
		this.borderSize = borderSize
		this.constrainBound = constrainBound
	}

	beginState() { // Bắt đầu translate - push
		push()
		translate(width * .5, height * .5)
		scale(this.scale)
		translate(-this.position.x, -this.position.y)
	}

	endState() { // Kết thúc việc translate - pop
		pop()
	}

	follow(config = {}) {
		if (this.followTarget) {
			const {
				timeScale = 1,
				target = this.target,
				followSpeed = this.followSpeed,
				isConstrain = false
			} = config

			this.position = p5.Vector.lerp(this.position, target.position, followSpeed * timeScale)

			if (isConstrain) {
				const { left, right, top, bottom } = this.constrainBound

				this.position.x = constrain(this.position.x, left, right)
				this.position.y = constrain(this.position.y, top, bottom)
			}

		} else if (mouseX > width - this.borderSize || mouseX < this.borderSize ||
			mouseY > height - this.borderSize || mouseY < this.borderSize) {

			var vec = createVector(mouseX - width / 2, mouseY - height / 2).setMag(30);
			this.position.add(vec);

			// noStroke();
			// fill(200, 20);
			// var r = this.borderSize;
			// if (mouseY < r) rect(width / 2, r / 2, width, r); // top
			// if (mouseY > height - r) rect(width / 2, height - r / 2, width, r); // down
			// if (mouseX < r) rect(r / 2, height / 2, this.borderSize, height); // left
			// if (mouseX > width - r) rect(width - r / 2, height / 2, r, height); // right
		}
	}

	setTarget(newTarget) {
		this.target = newTarget
		return this
	}

	setScale(scaleValue) {
		this.scale = scaleValue
		return this
	}

	getBound() {
		let {x, y} = this.position
		let dx = width / 2 / this.scale
		let dy = height / 2 / this.scale
		return {
			left: x - dx,
			right: x + dx,
			top: y - dy,
			bottom: y + dy
		}
	}

	// Chuyển đổi vị trí thực của vật thể (theo hệ toạ độ của mapgame) về vị trí trên màn hình (theo hệ toạ độ màn hình)
	worldToScreen(worldX, worldY) {
		let screenX = (worldX - this.position.x) * this.scale + width * .5
		let screenY = (worldY - this.position.y) * this.scale + height * .5
		return createVector(screenX, screenY)
	}

	// Ngược lại worldToScreen
	screenToWorld(screenX, screenY) {
		let worldX = (screenX - width * .5) / this.scale + this.position.x
		let worldY = (screenY - height * .5) / this.scale + this.position.y
		return createVector(worldX, worldY)
	}
}

export default Camera