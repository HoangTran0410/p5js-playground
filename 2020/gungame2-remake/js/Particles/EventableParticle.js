class EventableParticle {
	constructor(config = {}) {

		const {
			onBorn = function () {},
			onAlive = function () {},
			onFinished = function () {}
		} = config

		// https://stackoverflow.com/questions/2236747/use-of-the-javascript-bind-method
		this.onBorn = onBorn.bind(this)
		this.onAlive = onAlive.bind(this)
		this.onFinished = onFinished.bind(this)

		this.isFinished = false
	}

	checkFinished() {
		this.isFinished && this.onFinished()
		return this
	}
}

export default EventableParticle