import {
    COLORS,
    VALUES,
    SUITS,
    SORT_TYPE,
    CARD_LERP_SPEED,
} from './constant.js'

export default class Card {
    static WIDTH = 60
    static HEIGHT = 90

    // kiểm tra những cards này có hợp lệ hay không
    static isValidCardsCombination(cards) {
        let sorted = Card.sort(cards)

        // same value
        let isSameValue = true
        for (let c of sorted) {
            if (c.value != sorted[0].value) {
                isSameValue = false
                break
            }
        }
        if (isSameValue) return true

        // continuous value
        let isContinuousValue = true
        for (let i = 1; i < sorted.length; i++) {
            if (
                VALUES.indexOf(sorted[i].value) !==
                VALUES.indexOf(sorted[i - 1].value) - 1
            ) {
                isContinuousValue = false
                break
            }
        }
        if (isContinuousValue && sorted.length >= 3) return true

        return false
    }

    static compare(card1, card2) {
        let value1i = VALUES.indexOf(card1.value)
        let value2i = VALUES.indexOf(card2.value)
        let suit1i = SUITS.indexOf(card1.suit)
        let suit2i = SUITS.indexOf(card2.suit)

        if (value1i == -1 || value2i == -1 || suit1i == -1 || suit2i == -1)
            return 0

        if (value1i < value2i) {
            return 1
        } else if (value1i > value2i) {
            return -1
        } else if (suit1i < suit2i) {
            return 1
        } else if (suit1i > suit2i) {
            return -1
        } else return 0
    }

    static sort(listCards, sortType = SORT_TYPE.DEFAULT) {
        if (sortType === SORT_TYPE.DEFAULT)
            return listCards.sort((c1, c2) => Card.compare(c1, c2))

        if (sortType === SORT_TYPE.BY_VALUE)
            return listCards.sort(
                (c1, c2) => VALUES.indexOf(c2.value) - VALUES.indexOf(c1.value)
            )

        if (sortType === SORT_TYPE.BY_SUIT)
            return listCards.sort(
                (c1, c2) => SUITS.indexOf(c2.suit) - SUITS.indexOf(c1.suit)
            )

        return listCards
    }

    static showHiddenCard(x, y, a, t) {
        let w = Card.WIDTH
        let h = Card.HEIGHT

        push()
        translate(x, y)
        a && rotate(a)

        fill(150)
        stroke(0)
        strokeWeight(2)
        rect(0, 0, w, h, 5)

        stroke(175)
        strokeWeight(3)
        line(-w / 2 + 5, -h / 2 + 5, w / 2 - 5, h / 2 - 5)
        line(w / 2 - 5, -h / 2 + 5, -w / 2 + 5, h / 2 - 5)

        if (t) {
            fill(255)
            stroke(0)
            strokeWeight(5)
            textSize(25)
            textAlign(CENTER, CENTER)
            text(t, 0, 0)
        }

        pop()
    }

    static hightlight(card, colour = 'yellow') {
        let { x, y } = card
        let w = Card.WIDTH
        let h = Card.HEIGHT

        // card.show()

        push()
        translate(x, y)
        card.angle && rotate(card.angle)

        noFill()
        stroke(colour)
        strokeWeight(4)
        rect(0, 0, w, h, 5)

        pop()
    }

    static isNotMoving(card) {
        return dist(card.x, card.y, card.desX, card.desY) < 2
    }

    constructor(suit, value, hidden = false, x = width / 2, y = height / 2) {
        this.value = value
        this.suit = suit
        this.hidden = hidden

        // for positioning
        this.x = x
        this.y = y
        this.preX = x
        this.preY = y
        this.angle = 0
        this.desX = x
        this.desY = y
    }

    update() {
        this.x = lerp(this.x, this.desX, CARD_LERP_SPEED)
        this.y = lerp(this.y, this.desY, CARD_LERP_SPEED)
    }

    moveTo(x, y) {
        this.desX = x
        this.desY = y
        this.savePreMove()
    }

    moveBy(dx = 0, dy = 0) {
        this.desX = this.x + dx
        this.desY = this.y + dy
        this.savePreMove()
    }

    undoMove() {
        this.desX = this.preX
        this.desY = this.preY
        this.savePreMove()
    }

    savePreMove() {
        this.preX = this.x
        this.preY = this.y
    }

    show() {
        let { x, y } = this
        let w = Card.WIDTH
        let h = Card.HEIGHT

        if (this.hidden) {
            Card.showHiddenCard(x, y, this.angle)
        } else {
            push()
            translate(x, y)
            this.angle && rotate(this.angle)

            fill(255)
            stroke(30)
            strokeWeight(2)
            rect(0, 0, w, h, 5)

            noStroke()
            fill(COLORS[this.suit])

            textSize(25)
            textAlign(LEFT, TOP)
            text(this.suit, -w / 2 + 5, -h / 2 + 30)

            if (('' + this.value).length > 1) textSize(23)
            text(this.value, -w / 2 + 5, -h / 2 + 5)

            pop()
        }
    }
}
