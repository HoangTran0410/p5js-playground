import { POSITION } from './constant.js';
import CardHelper from './card-helper.js';
import Card from './card.js';

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
            if (!Card.isNotMoving(c)) {
                c.show();
            }
        }

        Card.showHiddenCard(
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
        this.updateCardsPosition();

        if (this.posType !== POSITION.BOTTOM) card.hidden = true;
        // if (this.posType == POSITION_TYPE.LEFT) card.angle = PI / 2
        // if (this.posType == POSITION_TYPE.RIGHT) card.angle = -PI / 2
    }

    updateCardsPosition() {
        for (let i = 0; i < this.cards.length; i++) {
            let pos = this.getCardPos(i);
            this.cards[i].moveTo(pos.x, pos.y);
        }
    }

    getCardPos(index) {
        let spacing = 35;
        let pos = { ...this.position };
        let halflen = this.cards.length / 2;

        // if (
        //     this.posType === POSITION_TYPE.BOTTOM ||
        //     this.posType == POSITION_TYPE.TOP
        // ) {
        //     // horizontal
        //     pos.x -= halflen * spacing - Card.WIDTH / 2 - index * spacing
        // } else {
        //     // vertical
        //     pos.y -= halflen * spacing - Card.HEIGHT / 2 - index * spacing
        // }

        if (this.posType === POSITION.BOTTOM) {
            pos.x -= halflen * spacing - Card.WIDTH / 2 - index * spacing;
        }

        return pos;
    }

    getPlayerPosition() {
        switch (this.posType) {
            case POSITION.TOP:
                return { x: width / 2, y: Card.HEIGHT / 2 };
            case POSITION.BOTTOM:
                return { x: width / 2, y: height - Card.HEIGHT / 2 };
            case POSITION.LEFT:
                return { x: Card.WIDTH / 2, y: height / 2 };
            case POSITION.RIGHT:
                return { x: width - Card.WIDTH / 2, y: height / 2 };
        }
    }
}
