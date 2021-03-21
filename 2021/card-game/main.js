import Deck from './deck.js'

const deck = new Deck()
deck.shuffle()
console.log(deck.cards)

for (let card of deck.cards) document.body.appendChild(card.getHTML())
