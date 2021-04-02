import CardHelper from '../helper/card-helper.js';

export default class Player {
    constructor(name, hidden = false, position = createVector(), cards = []) {
        this.name = name;
        this.cards = cards;
        this.hidden = hidden;
        this.position = position;
    }

    update() {
        for (let c of this.cards) {
            c.update();
        }
    }

    show() {
        if (this.hidden) {
            for (let c of this.cards) {
                if (CardHelper.isMoving(c)) {
                    c.show();
                }
            }

            CardHelper.showHiddenCard(
                this.position.x,
                this.position.y,
                0,
                this.cards.length
            );
        } else {
            for (let c of this.cards) {
                c.show();
            }
        }
    }

    sortCards(sortType) {
        this.cards = CardHelper.sort(this.cards, sortType);
        this.updateCardsPosition();
    }

    addCard(card) {
        this.cards.push(card);
        card.owner = this;
        this.updateCardsPosition();
    }

    removeCard(card) {
        let i = this.cards.indexOf(card);
        if (i !== -1) {
            if (this.cards[i].owner == this) this.cards[i].owner = null;
            this.cards.splice(i, 1);
        }
    }

    updateCardsPosition() {
        if (this.hidden) {
            for (let card of this.cards) {
                card.moveTo(this.position.x, this.position.y);
            }
        } else {
            CardHelper.placeCards(this.cards, this.position.x, this.position.y);
        }
    }
}
