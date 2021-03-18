class AnimatedSprite {
    constructor(config = {}) {
        const {
            sprites = [],
            speed = 1,

            image,
            spriteData
        } = config

        this.sprites = sprites
        this.speed = speed
        this.index = 0

        if (image) {
            this.getSpritesFrom({ image, spriteData })
        }
    }

    setSpeed(speed) {
        this.speed = speed
        return this
    }

    getSpritesFrom({ image, spriteData }) {

        this.sprites = []

        for (let i = 0; i < spriteData.length; i++) {
            let data = spriteData[i]
            let sprite = image.get(data.x, data.y, data.w, data.h)

            this.sprites.push(sprite)
        }
    }

    getNextSprite() {
        this.animate()
        return this.sprites[~~this.index]
    }

    animate() {
        this.index += this.speed
        if(this.index >= this.sprites.length)
            this.index = 0
    }
}

export default AnimatedSprite