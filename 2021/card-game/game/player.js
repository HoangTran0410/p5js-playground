import { POSITION, CARD_HEIGHT, CARD_WIDTH } from '../constant.js';
import CardHelper from '../helper/card-helper.js';

export default class Player {
    constructor(name, posType, cards = []) {
        this.name = name;
        this.posType = posType;
        this.cards = cards;
        this.position = this.getPlayerPosition();
    }

    update() {
        for (let c of this.cards) {
            c.update();
        }
    }

    showCards() {
        for (let c of this.cards) {
            c.show();
        }
    }

    showCardsHidden() {
        for (let c of this.cards) {
            if (!CardHelper.isNotMoving(c)) {
                c.show();
            }
        }

        CardHelper.showHiddenCard(
            this.position.x,
            this.position.y,
            0,
            this.cards.length
        );
    }

    sortCards(sortType) {
        this.cards = CardHelper.sort(this.cards, sortType);
        this.updateCardsPosition();
    }

    addCard(card) {
        this.cards.push(card);
        card.owner = this;
        this.updateCardsPosition();
        if (this.posType !== POSITION.BOTTOM) card.hidden = true;
    }

    removeCard(card) {
        let i = this.cards.indexOf(card);
        if (i !== -1) {
            if (this.cards[i].owner == this) this.cards[i].owner = null;
            this.cards.splice(i, 1);
        }
    }

    updateCardsPosition() {
        if (this.posType === POSITION.BOTTOM) {
            CardHelper.placeCards(this.cards, this.position.x, this.position.y);
        } else {
            for (let c of this.cards) {
                c.moveTo(this.position.x, this.position.y);
            }
        }
    }

    getPlayerPosition() {
        switch (this.posType) {
            case POSITION.TOP:
                return { x: width / 2, y: CARD_HEIGHT / 2 };
            case POSITION.BOTTOM:
                return { x: width / 2, y: height - CARD_HEIGHT / 2 };
            case POSITION.LEFT:
                return { x: CARD_WIDTH / 2, y: height / 2 };
            case POSITION.RIGHT:
                return { x: width - CARD_WIDTH / 2, y: height / 2 };
        }
    }
}
