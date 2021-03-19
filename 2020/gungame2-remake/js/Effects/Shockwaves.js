import GrowableParticle from '../Particles/GrowableParticle.js'

class Shockwaves extends GrowableParticle {
	// constructor không có gì khác so với class cha GrowableParticle
	// nên không cần ghi lại

	// run() {
	// 	this.update()
	// 	this.display()
	// 	this.checkFinished()
	// }

	display() {
		let alpha = map(this.radius, 0, this.maxRadius, 255, 0)

		noFill()
		stroke(255, alpha)
		strokeWeight(this.strokeWeight)
		ellipse(this.position.x, this.position.y, this.radius * 2)
	}
}

export default Shockwaves