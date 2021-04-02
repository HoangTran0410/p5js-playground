import CardHelper from '../helper/card-helper.js';
import Board from './board.js';

export default class Player {
    constructor(name, position = createVector(), hidden = false, cards = []) {
        this.name = name;
        this.cards = cards;
        this.hidden = hidden;
        this.position = position;

        this.selected = [];
        this.isValidSelected = false;
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

    // đánh bài đang chọn
    go() {
        if (this.selected.length == 0) return;

        Board.instance.go(this.selected);
        for (let c of this.selected) {
            this.removeCard(c);
        }
        this.selected = [];
        this.sortCards();
    }

    toggleSelect(card) {
        let index = this.selected.indexOf(card);
        index == -1 ? this.selected.push(card) : this.selected.splice(index, 1);

        this.updateValidSelected();

        return index == -1;
    }

    selectCards(cards) {
        this.selected = cards;
        this.updateValidSelected();
    }

    updateValidSelected() {
        this.isValidSelected =
            this.selected.length &&
            CardHelper.isValidCardsCombination(this.selected);
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
