import MapGame from './Worlds/MapGame.js'
import Camera from './Worlds/Camera.js'
import Shockwares from './Effects/Shockwaves.js'
import Character from './Characters/Character.js'
import Bullet from './Bullets/Bullet.js'
import RectBound from './Worlds/Bound.js'
import AnimatedSprite from './Particles/AnimatedSprite.js'
import MobileControl from './Worlds/MobileControl.js'

let player
let camera
let mapgame
let mobile_control

// testing
let rectBound
let sprites = []

let images = {}
let bullets = []
let shockwares = []

let debugMode = false
let scaleWorld = 1

function preload() {
	images['playerBody'] = loadImage('./img/body.png')
	images['playerGun'] = loadImage('./img/gun.png')
	images['targetAim'] = loadImage('./img/target.png')
	images['rocket1'] = loadImage('./img/rocket.png')
	images['rocket2'] = loadImage('./img/rocket2.png')

	images['sprite1'] = loadImage('./img/sprite1.png')
	images['sprite2'] = loadImage('./img/sprite2.png')
}

function setup() {
	createCanvas(windowWidth, windowHeight)
	imageMode(CENTER)
	rectMode(CENTER)
	// noSmooth()

	// player
	player = new Character({
		radius: 50,
		position: createVector(width * .5, height * .5),
		bodyImage: images['playerBody'],
		gunImage: images['playerGun']
	})

	// map game
	mapgame = new MapGame({
		width: 2000,
		height: 2000
	})

	// camera
	scaleWorld = width / 1768
	camera = new Camera({
		target: player,
		scale: scaleWorld,
		constrainBound: {
			top: height * .5,
			bottom: mapgame.height - height * .5,
			left: width * .5,
			right: mapgame.width - width * .5
		}
	})

	// test rectbound
	rectBound = new RectBound({
		position: createVector(500, 700),
		width: 100,
		height: 1000
	})

	// sprite 1
	let spriteData1 = []
	for(let i = 0; i < 6; i++) {
		spriteData1.push({
			x: i * 256,
			y: 0,
			w: 256,
			h: 256
		})
	}
	sprites.push(new AnimatedSprite({
		image: images['sprite1'],
		speed: 0.25,
		spriteData: spriteData1
	}))

	// sprite 2 
	let spriteData2 = []
	for (let i = 0; i < 8; i++) {
		spriteData2.push({
			x: i * 108,
			y: 0,
			w: 108,
			h: 140
		})
	}
	sprites.push(new AnimatedSprite({
		image: images['sprite2'],
		speed: 0.25,
		spriteData: spriteData2
	}))

	mobile_control = new MobileControl({
		radius: 60,
        onChange: function() {
            this.display()
        }
	})
}

function draw() {
	background(30)

	let time_scale = 60 / (frameRate() || 60)

	let offsetSprite = 0
	for(let sprite of sprites) {
		image(sprite.getNextSprite(), 100 + offsetSprite, 100, 150, 150)
		sprite.setSpeed(player.getSpeed() / 30)

		offsetSprite += 150
	}

	// Bắt đầu translate
	camera.beginState() 
	camera.follow({
		isConstrain: false
	})

	// draw map
	mapgame.drawEdge({
		color: '#fff',
		strokeWeightValue: 3
	})
	mapgame.drawGrid({
		bound: camera.getBound(),
		color: "#5552",
		strokeWeightValue: 4
	})

	// varialbles
	let mouse = camera.screenToWorld(mouseX, mouseY)

	let mapBound = mapgame.getBound()
	let aimX = constrain(mouse.x, mapBound.left, mapBound.right)
	let aimY = constrain(mouse.y, mapBound.top, mapBound.bottom)

	// test bound class
	let check = rectBound.isIntersects({
		target: player,
		offset: 0
	})

	if (check) {
		player.setVelocityScale(.05)
	}

	// player
	player.update()
	player.makeWheelTracks()
	player.display()
	player.aimTo({
		target: createVector(aimX, aimY),
		aimImage: images['targetAim']
	})
	player.collideBound({
		bound: mapBound,
		bounce: true,
		callback: function (collidePos) {
			shockwares.push(new Shockwares({
				position: collidePos,
				strokeWeight: 2,
				speed: 2
			}))
		}
	})
	debugMode && player.debug()
	player.checkFinished()

	image(images['targetAim'], mouse.x, mouse.y, 60, 60)

	// bullets
	for (let i = bullets.length - 1; i >= 0; i--) {
		let bullet = bullets[i]

		let checkbullet = rectBound.isIntersects({
			target: bullet,
			offset: 0
		})

		if (checkbullet) {
			check = true
			bullet.setVelocityScale(.05)
		}

		bullet.update()
		bullet.display()
		bullet.collideBound({
			bound: mapBound,
			bounce: true,
			callback: function (collidePos) {
				this.collideCount = (this.collideCount || 0) + 1

				if (this.collideCount >= 4) {
					bullets.splice(bullets.indexOf(this), 1)
					new Shockwares({
						position: collidePos,
						maxRadius: this.velocity.mag() * this.radius,
						strokeWeight: 2,
						speed: 5,
						onFinished: function () {
							shockwares.splice(shockwares.indexOf(this), 1)
						},
						onBorn: function () {
							shockwares.push(this)
						}
					})
				}
			}
		})
		debugMode && bullet.debug()
		bullet.checkFinished()
	}

	rectBound.display({
		strokeColor: (check ? '#fff' : '#555')
	})

	for (let shock of shockwares) {
		shock.update({
			timeScale: time_scale
		})
		shock.display()
		shock.checkFinished()
	}

	camera.endState() // kết thúc translate

	mouseIsPressed && mobile_control.setHandPosition(mouseX, mouseY)

	// điều khiển player
	if (keyIsDown(87)) {
		player.applyForce(0, -.15)
	}
	if (keyIsDown(83)) {
		player.applyForce(0, .15)
	}
	if (keyIsDown(65)) {
		player.applyForce(-.15, 0)
	}
	if (keyIsDown(68)) {
		player.applyForce(.15, 0)
	}

	// hiện fps
	fill(255)
	text(`FPS ${~~frameRate()}`, 10, 10)
}

function mousePressed() {
	mobile_control.mousePressed()
	fire(player)
}

function mouseReleased() {
    mobile_control.mouseReleased()
}

function keyPressed() {
	if (keyCode == 13) {
		debugMode = !debugMode
	}
	if (keyCode == 32) {
		camera.followTarget = !camera.followTarget
	}
}

function mouseWheel(e) {
	let step = 0.05
	if (e.delta < 0) {
		scaleWorld += step
	} else if (scaleWorld > step) {
		scaleWorld -= step
	}

	camera.setScale(scaleWorld)
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight, true);

	scaleWorld = width / 1768
	camera.setScale(scaleWorld)
}

function fire(character) {
	let r = random(10, 30)

	let direction = character.fire()

	let bullet = new Bullet({
		image: images[`rocket${random([1, 2])}`],
		imagePosition: createVector(0, r),
		imageScale: 1.5,
		radius: r,
		speed: random(15, 40),
		position: character.position.copy().sub(direction.copy().setMag(character.radius)),
		velocity: direction.copy().mult(-1)
	})

	bullets.push(bullet)
	// bullets = [bullet]
}

console.log('GunGame.js is loaded...')
export default {
	preload,
	setup,
	draw,
	keyPressed,
	mousePressed,
	mouseReleased,
	mouseWheel,
	windowResized
}