import Joystick from './p5.joystick.js';

let SCREEN_RATIO = 9 / 16 // 16:9
let SCREEN_MARGIN = 0.1 // percents
let SPEEDUP_CONTROL = .5 // speedup value while control player

let canvas
let images = {}
let players = []
let bullets = []
let joystick, joystick2

function preload() {
    // images['spaceship'] = loadImage('./images/spaceship.png')
}

function setup() {
    stopLoading()

    let { w, h } = calculateScreenSize()
    canvas = createCanvas(w, h)

    imageMode(CENTER)
    rectMode(CENTER)
    textAlign(CENTER)

    let player1 = new SpaceShip({
        position: createVector(random(width), random(height)),
        width: 60,
        height: 75,
        friction: 0.05,
        // picture: images['spaceship']
    }).setKeyControl({
        keyUp: UP_ARROW,
        keyDown: DOWN_ARROW,
        keyLeft: LEFT_ARROW,
        keyRight: RIGHT_ARROW
    })

    let player2 = new SpaceShip({
        position: createVector(random(width), random(height)),
        width: 40,
        height: 65,
        friction: 0.05
    }).setKeyControl({
        keyUp: 87, // W S A D
        keyDown: 83,
        keyLeft: 65,
        keyRight: 68
    })

    players.push(player1, player2)
    applyBoundScreen(players)

    // ======================
    joystick = new Joystick({
        position: createVector(65, height - 65),
        radius: 60,
        // picture: 1,
        // buttonRadius: 30,
        // buttonPicture: 2,
        staticPosition: true,
        autoHide: false,
        onChange: function () {
            let velocity = this.getDirectionVector().mult(SPEEDUP_CONTROL)
            players[0].move(velocity.x, velocity.y)
        },
        isAcceptHandPosition: function(x, y) {
            return p5.Vector.dist(this.position, createVector(x, y)) < this.radius * 2;
        }
    })

    joystick2 = new Joystick({
        position: createVector(width - 65, height - 65),
        radius: 60,
        // picture: 1,
        // buttonRadius: 30,
        // buttonPicture: 2,
        staticPosition: true,
        autoHide: false,
        onChange: function () {
            let velocity = this.getDirectionVector().mult(SPEEDUP_CONTROL)
            players[1].move(velocity.x, velocity.y)
        },
        isAcceptHandPosition: function(x, y) {
            return p5.Vector.dist(this.position, createVector(x, y)) < this.radius * 2;
        }
    })
}

function draw() {
    background(70)

    for (let player of players) {
        player.control()
        player.update()
        player.display()

        if (frameCount % ~~random(10, 30) == 0) {
            bullets.push(player.fire())
        }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i]

        bullet.update()
        bullet.display()

        if (bullet.isOutOfScreen()) {
            bullets.splice(i, 1)
        }
    }

    joystick.run();
    joystick2.run();

    showFPS(10, 10)
}

function keyPressed() {

}

function windowResized() {
    let { w, h } = calculateScreenSize()
    resizeCanvas(w, h, true)
    applyBoundScreen(players)
}

function stopLoading() {
    document.getElementById('game').outerHTML = ''
}

function calculateScreenSize() {
    if (mobilecheck()) {
        return {
            w: windowWidth,
            h: windowHeight
        }
    }

    let margin = SCREEN_MARGIN * windowHeight
    let width = (windowHeight - margin) * SCREEN_RATIO
    let height = windowHeight - margin

    return {
        w: width,
        h: height
    }
}

function applyBoundScreen(playersArr) {
    let boundConstrain = {
        top: 0,
        bottom: height,
        left: 0,
        right: width
    }

    for (let player of playersArr) {
        player.setBoundConstrain(boundConstrain)
    }
}

function showFPS(x, y) {
    fill(255)
    noStroke()
    text(~~frameRate(), x, y)
}

// ================ FATHER CLASSES ============

class MoveableParticle {
    constructor(config = {}) {
        const {
            position = createVector(0, 0),
            velocity = createVector(0, 0),
            friction = 0,
            maxSpeed = 15
        } = config

        this.position = position
        this.velocity = velocity
        this.friction = friction
        this.maxSpeed = maxSpeed
    }

    update() {
        this.position.add(this.velocity)
        this.velocity.mult(1 - this.friction)

        this.constrainBound()
    }

    speedUp(vx, vy) {
        if (this.getSpeed() < this.maxSpeed) {
            this.velocity.add(vx, vy)
        }
    }

    getSpeed() {
        return this.velocity.mag()
    }

    setBoundConstrain(config = {}) {
        const {
            top = -Infinity,
            bottom = Infinity,
            left = -Infinity,
            right = -Infinity,
            bounce = this.bounce
        } = config

        this.boundConstrain = { top, bottom, left, right }
        this.bounce = bounce

        return this
    }

    constrainBound(config = {}) {
        const {
            offset = 0,

            offsetX = offset,
            offsetY = offset,

            offsetTop = offsetY,
            offsetBottom = offsetY,
            offsetLeft = offsetX,
            offsetRight = offsetX

        } = config

        const { x, y } = this.position
        const { top, bottom, left, right } = this.boundConstrain
        const bounceValue = (this.bounce ? -1 : 1)

        if (x < left + offsetLeft) {
            this.position.x = left + offsetLeft
            this.velocity.x *= bounceValue
        }
        if (x > right - offsetRight) {
            this.position.x = right - offsetRight
            this.velocity.x *= bounceValue
        }
        if (y < top + offsetTop) {
            this.position.y = top + offsetTop
            this.velocity.y *= bounceValue
        }
        if (y > bottom - offsetBottom) {
            this.position.y = bottom - offsetBottom
            this.velocity.y *= bounceValue
        }
    }

    isOutOfScreen(config = {}) {
        const {
            offset = 0,

            offsetX = offset,
            offsetY = offset,

            offsetTop = offsetY,
            offsetBottom = offsetY,
            offsetLeft = offsetX,
            offsetRight = offsetX

        } = config

        const { x, y } = this.position
        // const { top, bottom, left, right } = this.boundConstrain
        const top = 0, left = 0, right = width, bottom = height

        return x < left - offsetLeft || x > right + offsetRight || y < top - offsetTop || y > bottom + offsetBottom
    }

    getColorBaseSpeed() {
        return map(this.getSpeed(), 0, this.maxSpeed, 0, 255)
    }
}

class CircleParticle extends MoveableParticle {
    constructor(config = {}) {
        super(config)

        const {
            radius = 20
        } = config

        this.radius = radius
    }

    display() {
        let c = this.getColorBaseSpeed()
        fill(c)
        stroke(255 - c)
        ellipse(this.position.x, this.position.y, this.radius * 2)
    }

    constrainBound() {
        super.constrainBound({
            offsetX: 0,
            offsetY: this.radius
        })
    }

    isOutOfScreen() {
        return super.isOutOfScreen({
            offset: this.radius
        })
    }
}

class RectangleParticle extends MoveableParticle {
    constructor(config = {}) {
        super(config)

        const {
            width = 100,
            height = 100,
            angle = 0
        } = config

        this.width = width
        this.height = height
        this.angle = angle
    }

    display() {
        let c = this.getColorBaseSpeed()
        fill(c)
        stroke(255 - c)
        rect(this.position.x, this.position.y, this.width, this.height)
    }

    constrainBound() {
        super.constrainBound({
            offsetX: 0,
            offsetY: this.height / 2
        })
    }

    isOutOfScreen() {
        return super.isOutOfScreen({
            offsetX: this.width / 2,
            offsetY: this.height / 2
        })
    }
}

// ==============================================
// ======              CLASSES          =========
// ==============================================

class SpaceShip extends RectangleParticle {
    constructor(config = {}) {
        super(config)

        const {
            health = 100,
            weapon,
            picture
        } = config

        this.picture = picture
        this.health = health
        this.weapon = weapon
    }

    control() {
        const { keyUp, keyDown, keyLeft, keyRight } = this

        keyUp && keyIsDown(keyUp) && this.move(0, -SPEEDUP_CONTROL)
        keyDown && keyIsDown(keyDown) && this.move(0, SPEEDUP_CONTROL)
        keyLeft && keyIsDown(keyLeft) && this.move(-SPEEDUP_CONTROL, 0)
        keyRight && keyIsDown(keyRight) && this.move(SPEEDUP_CONTROL, 0)
    }

    move(vx, vy) {
        this.speedUp(vx, vy)
    }

    setKeyControl(config = {}) {
        const {
            keyUp,
            keyDown,
            keyLeft,
            keyRight
        } = config

        this.keyUp = keyUp
        this.keyDown = keyDown
        this.keyLeft = keyLeft
        this.keyRight = keyRight

        return this
    }

    fire() {
        let r = random(5, 15)
        return new Bullet({
            position: this.position.copy().add(0, -this.height / 2),
            velocity: createVector(0, -7),
            radius: r
        }).setBoundConstrain({
            // top: 0,
            left: 0,
            right: width,
            bounce: true
        })
    }

    display() {
        if (this.picture) {
            image(this.picture, this.position.x, this.position.y, this.width, this.height)

        } else {
            super.display()

            fill(150)
            noStroke()
            text(this.health, this.position.x, this.position.y)
        }
    }
}

class Bullet extends CircleParticle {
    constructor(config = {}) {
        super(config)

        const {
            picture
        } = config

        this.picture = picture
    }

    display() {

        if (this.picture) {
            push()
            translate(this.position.x, this.position.y)
            rotate(this.getAngleVelocity())

            image(this.picture, 0, 0, this.radius * 2, this.radius * 2)

            pop()
        } else {
            noFill()
            stroke(255)
            ellipse(this.position.x, this.position.y, this.radius * 2)

            let velVec = this.position.copy().add(this.velocity.copy().setMag(this.radius))
            line(this.position.x, this.position.y, velVec.x, velVec.y)
        }
    }

    getAngleVelocity() {
        return this.velocity.heading()
    }
}

// =============== OTHER FUNCTIONS =============

function mobilecheck() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

export default {
    preload,
    setup,
    draw,
    keyPressed,
    windowResized,
    canvas
}