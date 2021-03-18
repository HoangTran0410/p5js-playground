import EventableParticle from './EventableParticle.js'

class GrowableParticle extends EventableParticle {
	constructor(config = {}) {

		super(config)

		const {
			strokeWeight = 1, // Độ lớn nét vẽ
			maxRadius = 100, // Bán kính lớn nhất
			position = createVector(0, 0), // Vị trí tâm xung kích
			radius = 0, // Bán kính ban đầu
			speed = 3 // Tốc độ giãn nở
		} = config

		this.position = position
		this.speed = speed
		this.radius = radius
		this.maxRadius = maxRadius
		this.strokeWeight = strokeWeight

		// function executed when born
		this.onBorn()
	}

	update(config = {}) {
		const {
			timeScale = 1
		} = config

		!this.isFinished && (this.radius += this.speed * timeScale)

		// check bán kính đã tối đa hay chưa
		this.isFinished = (this.radius >= this.maxRadius)

		this.onAlive()
	}
}

export default GrowableParticle