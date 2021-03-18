let data = [
    ['./images/toon.png', 96, 96, 50],
    ['./images/fire.png', 64, 64, 60],
    ['./images/action_player.png', 196, 128, 54],
    // ['./images/explore.png', 50, 53, 40],
    // ['./images/explosions.png', 256, 128, 12],
    // ['./images/explosion2.png', 96, 96, 12],
    ['./images/sprite_sheet.png', 171, 158, 11]
]

let things = {
    animations: []
}

function preload() {
    for(let d of data) {
        let ani = loadAnimation(loadSpriteSheet(d[0], d[1], d[2], d[3]))
        ani.frameDelay = 6
        things.animations.push(ani)
    }
}

function setup() {
    createCanvas(800, 600)
    
    x = 100
    for(let ani of things.animations) {
        let spr = createSprite(x, 100)
        spr.addAnimation('default', ani)

        x += 100
    }
}

function draw() {
    background(20)
    
    // character.velocity.x = (mouseX - character.position.x) / 10;
    // character.velocity.y = (mouseY - character.position.y) / 10;

    // character.rotation = frameCount

    drawSprites()
}
