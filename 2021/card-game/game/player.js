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

            this.cards.length > 0 &&
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

        for (let c of this.selected) {
            this.removeCard(c);
        }

        let temp = [...this.selected];
        this.selected = [];
        this.isValidSelected = false;
        this.sortCards();

        Board.instance.go(temp);
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
        let notEmpty = this.selected.length;
        let validCombination = CardHelper.isValidCardsCombination(
            this.selected
        );
        let biggerThanLastMove =
            Board.instance.lastMove.length == 0 ||
            CardHelper.compareCombination(
                this.selected,
                Board.instance.lastMove
            ) == 1;

        this.isValidSelected =
            notEmpty && validCombination && biggerThanLastMove;
    }

    sortCards(sortType) {
        this.cards = CardHelper.sort(this.cards, sortType);
        this.updateCardsPosition();
    }

    addCard(card) {
        this.cards.push(card);
        // card.owner = this;
        this.updateCardsPosition();
    }

    removeCard(card) {
        let i = this.cards.indexOf(card);
        if (i !== -1) {
            // if (this.cards[i].owner == this) this.cards[i].owner = null;
            this.cards.splice(i, 1);
        }
    }

    removeAllCards() {
        this.cards.length = 0;
        this.selected.length = 0;
        this.updateValidSelected();
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
