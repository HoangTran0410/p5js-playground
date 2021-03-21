import { dragElement } from './helper.js'

const VALUES = [2, 'A', 'K', 'Q', 'J', 10, 9, 8, 7, 6, 5, 4, 3]
const SUITS = ['♥', '♦', '♠', '♣']
const SUITTEXT = {
  '♥': 'H',
  '♦': 'D',
  '♠': 'S',
  '♣': 'C',
}

export default class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards
  }

  get numberOfCards() {
    return this.cards.lenght
  }

  shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1))
      const oldValue = this.cards[newIndex]

      this.cards[newIndex] = this.cards[i]
      this.cards[i] = oldValue
    }
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit
    this.value = value
  }

  get color() {
    return this.suit === '♥' || this.suit === '♦' ? 'red' : 'black'
  }

  get imgPath() {
    return `./assets/${this.value}${SUITTEXT[this.suit]}.png`
  }

  getHTML() {
    const div = document.createElement('div')
    div.classList.add('card')
    div.dataset.value = `${this.value} ${this.suit}`

    const img = document.createElement('img')
    img.src = this.imgPath
    div.appendChild(img)

    dragElement(div)

    div.style.top = 100 + "px"
    div.style.left = 100 + "px"

    return div
  }
}

function freshDeck() {
  return VALUES.flatMap((value) => {
    return SUITS.map((suit) => {
      return new Card(suit, value)
    })
  })
}
