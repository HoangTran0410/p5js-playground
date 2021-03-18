import MovableParticle from '../Particles/MovableParticle.js'

class Character extends MovableParticle {
	constructor(config = {}) {

		const {
			// Những biến mới hơn so với class cha
			name = '',
			maxSpeed = Infinity,
			bodyImage,
			gunImage,
			wheelTrackImage,

			// Những biến thuộc class cha
			color,
			radius,
			position,
			friction = .97,

			// event thuộc class cha
			onFinished,
			onAlive,
			onBorn
		} = config

		super({
			color,
			radius,
			position,
			friction,
			onFinished,
			onAlive,
			onBorn
		})

		this.name = name
		this.maxSpeed = maxSpeed
		this.bodyImage = bodyImage
		this.gunImage = gunImage
		this.wheelTrackImage = wheelTrackImage

		this.targetPos = createVector(0, 0) // vị trí nhắm của nòng súng
		this.wheelTracks = [] // Mảng lưu các vệt bánh xe
		this.distanceWheelTrack = radius * .5 // Sau khi đi được khoảng cách vừa đủ thì xuất hiện 1 vệt bánh
		this.distanceMove = 0 // biến lưu quãng đường đã đi được từ vệt bánh trước
	}

	// run() {
	//	 this.update()
	//	 this.display()
	//	 this.makeWheelTracks()
	//	 this.checkFinished()
	// }

	fire() {
		let direction = p5.Vector.sub(this.position, this.targetPos)
		let force = direction.copy().setMag(2.5)
		this.applyForce(force.x, force.y)

		return direction
	}

	display() {
		this.drawWheelTrack() // vệt bánh vẽ trước -> sẽ nằm dưới hình ảnh xe tank
		this.drawBody()
		this.drawGun()
	}

	makeWheelTracks() {
		this.distanceMove += this.velocity.mag() * this.timeScale
		if (this.distanceMove > this.distanceWheelTrack) {
			this.distanceMove = 0

			let wheeltrack = new WheelTrack({
				size: this.radius * 1.5,
				position: this.position.copy(),
				direction: this.velocity.copy(),
				image: this.wheelTrackImage,
				lifeTime: 3000
			})

			// es6 arrow function make this -> character, not wheeltrack
			wheeltrack.onFinished = () => {
				this.wheelTracks.splice(this.wheelTracks.indexOf(wheeltrack), 1)
			}

			this.wheelTracks.push(wheeltrack)
		}
	}

	drawWheelTrack() {
		for (let i = this.wheelTracks.length - 1; i >= 0; i--) {
			let w = this.wheelTracks[i]
			w.update()
			w.display()
			w.checkFinished()
			// w.isFinished && this.wheelTracks.splice(this.wheelTracks.indexOf(w), 1)
		}
	}

	drawBody() {
		push()
		translate(this.position.x, this.position.y)
		rotate(this.velocity.heading() + PI * .5) // hình nằm dọc, góc 0 hướng ngang, nên phải cộng góc 90 độ

		if (this.bodyImage) {
			image(this.bodyImage, 0, 0, this.radius * 2, this.radius * 2)

		} else {
			rotate(-PI * .5)
			stroke(255, 180)
			fill(this.color)

			// body
			polygon(0, 0, this.radius, 5)

			// head
			stroke(30)
			fill(30)
			ellipse(this.radius * .65, 0, this.radius * .5)
		}
		pop()
	}

	drawGun() {
		// angle theo this.targetPos
		let angle = this.getTargetHeading(this.targetPos)

		// vẽ nòng súng theo angle tính được
		push()
		translate(this.position.x, this.position.y)
		rotate(angle + PI * .5)

		if (this.gunImage) {
			image(this.gunImage, 0, 0, this.radius * 2, this.radius * 2)

		} else {
			rotate(-PI * .5)
			fill(0, 200)
			stroke(150)
			strokeWeight(2)

			// gun
			rect(this.radius / 2, 0, this.radius / 1.5 * 2, this.radius * 0.4)

			// center
			fill(0)
			ellipse(0, 0, this.radius * .75, this.radius * .75)
		}
		pop()
	}

	aimTo(config = {}) {

		const {
			target = this.position.copy(),
			aimImage
		} = config

		// this.targetPos lerp theo target -> smooth animation
		this.targetPos = p5.Vector.lerp(this.targetPos, target, 0.1 * this.timeScale)

		if (aimImage) {
			image(aimImage, this.targetPos.x, this.targetPos.y, 60, 60)

			stroke(200, 50)
			strokeWeight(1)
			line(this.position.x, this.position.y, this.targetPos.x, this.targetPos.y)
		}
	}
}

import EventableParticle from '../Particles/EventableParticle.js'

class WheelTrack extends EventableParticle {
	constructor(config = {}) {

		const {
			size = 60,
			position = createVector(0, 0),
			direction = createVector(0, 0),
			lifeTime = 1000, // mặc định sau 1s sẽ mất
			image,

			onBorn,
			onAlive,
			onFinished
		} = config

		super({
			onBorn,
			onAlive,
			onFinished
		})

		this.image = image
		this.size = size
		this.position = position
		this.direction = direction
		this.angle = direction.heading()
		this.lifeTime = lifeTime
		this.born = millis()
	}

	update() {
		this.isFinished = (millis() - this.born > this.lifeTime)
	}

	display() {
		push()
		translate(this.position.x, this.position.y)
		rotate(this.angle + PI * .5)

		if (this.image) {
			image(this.image, 0, 0, this.size, this.size * .5)

		} else {
			let alpha = this.calculateAlpha()
			fill(0, alpha)
			// noStroke()
			strokeWeight(1)
			stroke(100, alpha)
			// rect(0, 0, this.size, this.size * 0.3)
			rect(this.size * .2, 0, this.size * .35, this.size * .2)
			rect(-this.size * .2, 0, this.size * .35, this.size * .2)
		}

		pop()
	}

	calculateAlpha() {
		let age = millis() - this.born
		return map(age, 0, this.lifeTime, 255, 0)
	}
}

const polygon = (x, y, radius, npoints) => {
	let angle = TWO_PI / npoints
	beginShape()
	for (let a = 0; a < TWO_PI; a += angle) {
		let sx = x + cos(a) * radius
		let sy = y + sin(a) * radius
		vertex(sx, sy)
	}
	endShape(CLOSE)
}

export default Character