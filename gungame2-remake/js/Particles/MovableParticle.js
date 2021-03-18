import EventableParticle from './EventableParticle.js'

class MovableParticle extends EventableParticle {
	constructor(config = {}) {

		const {
			acceleration = createVector(0, 0), // gia tốc
			position = createVector(0, 0), // toạ độ, vị trí
			velocity = createVector(0, 0), // vận tốc
			friction = 1, // ma sát
			radius = 50,
			color = randHexColor(),
			mass = 1 // trọng lượng
		} = config

		super(config)

		this.radius = radius
		this.position = position
		this.velocity = velocity
		this.acceleration = acceleration
		this.friction = friction
		this.mass = mass
		this.color = color

		this.timeScale = 1
		this.velocityScale = 1

		this.onBorn()
	}

	update(config = {}) {

		const {
			timeScale = this.timeScale
		} = config

		this.timeScale = timeScale
		this.velocity.add(this.acceleration)
		this.position.add(this.velocity.copy().mult(this.timeScale * this.velocityScale))

		// ma sát giảm vận tốc, ngăn ko cho giảm tới 0 -> vẫn giữ được hướng di chuyển
		if (this.velocity.mag() > 0.00001)
			this.velocity.mult(this.friction * this.frictionScale)

		// reset gia tốc
		this.acceleration.mult(0)

		this.resetVelocityScale()
		this.resetFrictionScale()

		this.onAlive()
	}

	applyForce(x, y) {
		// tác dụng lực làm thay đổi gia tốc
		this.acceleration.add(x / this.mass, y / this.mass)
		return this
	}

	// set functions
	setTimeScale(timeScale) {
		this.timeScale = timeScale
		return this
	}

	setSpeed(speed) {
		this.velocity.setMag(speed)
		return this
	}

	setVelocityScale(scale) {
		this.velocityScale = scale
	}

	setFrictionScale(scale) {
		this.frictionScale = 1 / scale
	}

	// reset functions
	resetTimeScale() {
		this.timeScale = 1
	}

	resetVelocityScale() {
		this.velocityScale = 1
	}

	resetFrictionScale() {
		this.frictionScale = 1
	}

	// get functions
	getSpeed() {
		return this.velocity.mag()
	}

	getTargetDirection(target) {
		// trả về vector hướng tới target
		return p5.Vector.sub(target, this.position)
	}

	getTargetHeading(target) {
		// trả về góc tới target
		return this.getTargetDirection(target).heading()
	}

	// others function
	collideBound({
		bound = {},
		bounce = false,
		callback
	}) {

		const {
			top = -Infinity,
			bottom = Infinity,
			left = -Infinity,
			right = Infinity
		} = bound

		let x = this.position.x
		let y = this.position.y
		let r = this.radius

		let collided = null

		if (x - r < left) {
			this.position.x = left + r
			collided = 'left'
		}
		if (x + r > right) {
			this.position.x = right - r
			collided = 'right'
		}
		if (y - r < top) {
			this.position.y = top + r
			collided = 'top'
		}
		if (y + r > bottom) {
			this.position.y = bottom - r
			collided = 'bottom'
		}

		if (collided) {

			// phương va chạm (x hay y)
			let direction = 'y'
			if (collided == 'left' || collided == 'right')
				direction = 'x'

			// nếu vận tốc khi chạm tường theo phương tương ứng > 1 thì mới tính là va chạm
			if (callback && abs(this.velocity[direction]) > 1) {
				// tính toạ độ va chạm
				let collidePos = this.position.copy()
				let r = this.radius

				collided == 'top' && collidePos.add(0, -r)
				collided == 'bottom' && collidePos.add(0, r)
				collided == 'left' && collidePos.add(-r, 0)
				collided == 'right' && collidePos.add(r, 0)

				// thực thi hàm truyền vào
				callback.call(this, collidePos)
			}

			this.velocity[direction] *= (bounce ? -this.friction : 0)
		}
	}

	isInsideRect({
		top = -Infinity,
		bottom = Infinity,
		left = -Infinity,
		right = Infinity,
		checkWithRadius = false,
	}) {
		let x = this.position.x
		let y = this.position.y
		let r = (checkWithRadius ? this.radius : 0)

		return (x - r > left &&
			x + r < right &&
			y - r > top &&
			y + r < bottom)
	}

	isInsideCircle({
		position = createVector(0, 0),
		radius = Infinity,
		checkWithRadius = false
	}) {
		let distance = p5.Vector.dist(this.position, position)
		let r = (checkWithRadius ? this.radius : 0)

		return (radius + r < distance)
	}

	debug() {
		// hiện mũi tên chỉ hướng vận tốc
		push()
		translate(this.position.x, this.position.y)

		strokeWeight(1)
		stroke(255)
		line(0, 0, this.velocity.x * 10, this.velocity.y * 10)

		noFill()
		ellipse(0, 0, this.radius * 2)
		pop()
	}
}

const randHexColor = () => {
	return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

export default MovableParticle