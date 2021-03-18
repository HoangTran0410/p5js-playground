import MovableParticle from '../Particles/MovableParticle.js'

class Bullet extends MovableParticle {
	constructor(config = {}) {

		const {
			image,
			imagePosition = createVector(0, 0),
			imageScale = 1,
			speed = 20,
	
			position,
			velocity,
			radius = 10,
			color = '#fff',
			friction = 1,
	
			onBorn,
			onAlive,
			onFinished
		} = config

		super({
			color,
			radius,
			position,
			velocity,
			friction,
			onBorn,
			onAlive,
			onFinished
		})

		this.image = image
		this.imagePosition = imagePosition
		this.imageScale = imageScale
		this.velocity.setMag(speed)
	}

	display() {
		if (this.image) {
			push()
			translate(this.position.x, this.position.y)
			rotate(this.velocity.heading() + PI * .5) // hình nằm dọc, góc 0 hướng ngang, nên phải cộng góc 90 độ

			let r = this.imageScale * this.radius
			image(this.image, this.imagePosition.x, this.imagePosition.y, r * 2, r * 3)

			pop()

		} else {
			fill(this.color)
			ellipse(this.position.x, this.position.y, this.radius * 2)
		}
	}
}

export default Bullet