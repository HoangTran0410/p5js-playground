import {
    CARD_HEIGHT,
    CARD_WIDTH,
    GIVEOUT_DELAY,
    POSITION,
    SUITS,
    VALUES,
} from './constant.js';
import { testRectangleToPoint, sleep } from './helper.js';
import Card from './card.js';
import Player from './player.js';
import CardHelper from './card-helper.js';
import Button from './button.js';

export default class Game {
    constructor() {
        this.deck = [];
        this.unusedCards = [];
        this.onBoardCards = [];
        this.players = {
            [POSITION.TOP]: null,
            [POSITION.BOTTOM]: null,
            [POSITION.LEFT]: null,
            [POSITION.RIGHT]: null,
        };

        this.hoveredCard = null;
        this.selected = [];
        this.giveOutFinished = false;

        this.goBtn = new Button('Đánh', width - 50, height - 80, 80, 40);
        this.passBtn = new Button('Bỏ', width - 50, height - 30, 80, 40);

        this.goBtn.onMousePressed = () => {
            this.go(this.players[POSITION.BOTTOM], this.selected);
            this.selected.length = 0;
        };
    }

    update() {
        for (let pos in this.players) {
            if (this.players[pos]) this.players[pos].update();
        }

        for (let c of this.onBoardCards) {
            c.update();
        }

        this.hoveredCard = this.getCardAt(mouseX, mouseY);
    }

    show() {
        // draw board
        this.showBoard();

        // draw unused
        this.showUnusedCards();

        // cards on board
        for (let c of this.onBoardCards) {
            c.show();
        }

        // draw players cards
        this.showPlayerCards();

        // card at mouse
        if (this.giveOutFinished) {
            if (this.hoveredCard) {
                CardHelper.hightlight(this.hoveredCard);
            }
        }

        // ui
        this.goBtn.show();
        this.passBtn.show();
    }

    showUnusedCards() {
        if (this.unusedCards.length) {
            for (let c of this.unusedCards) {
                if (!c.hidden) {
                    c.show();
                }
            }

            CardHelper.showHiddenCard(
                width / 2,
                height / 2,
                0,
                this.unusedCards.length
            );
        }
    }

    showPlayerCards() {
        for (let pos in this.players) {
            if (this.players[pos]) {
                if (pos === POSITION.BOTTOM) {
                    this.players[pos].showCards();
                } else {
                    this.players[pos].showCardsHidden();
                }
            }
        }
    }

    showBoard() {
        // board
        fill('#067254');
        stroke('#878F95');
        strokeWeight(10);
        rect(width / 2, height / 2, width - 150, height - 200, 200);
        circle(width / 2, height / 2, 200);

        // player names
        fill('yellow');
        noStroke();
        if (this.players[POSITION.TOP]) {
            textAlign(CENTER, TOP);
            text(this.players[POSITION.TOP].name, width / 2, height / 2 - 190);
        }
        if (this.players[POSITION.BOTTOM]) {
            textAlign(CENTER, BOTTOM);
            text(
                this.players[POSITION.BOTTOM].name,
                width / 2,
                height / 2 + 190
            );
        }
        if (this.players[POSITION.LEFT]) {
            textAlign(LEFT, CENTER);
            text(this.players[POSITION.LEFT].name, 85, height / 2);
        }
        if (this.players[POSITION.RIGHT]) {
            textAlign(RIGHT, CENTER);
            text(this.players[POSITION.RIGHT].name, width - 85, height / 2);
        }
    }

    // ván mới
    async newGame() {
        this.deck = [];
        this.unusedCards = [];
        this.hoveredCard = null;
        this.giveOutFinished = false;
        this.goBtn.active = false;
        this.passBtn.active = false;

        for (let value of VALUES) {
            for (let suit of SUITS) {
                this.deck.push(new Card(suit, value));
            }
        }

        for (let c of this.deck) {
            this.unusedCards.push(c);
        }

        this.shuffle();
        await this.giveOut();

        for (let pos in this.players) {
            if (this.players[pos]) this.players[pos].sortCards();
        }

        await sleep(1000);

        this.giveOutFinished = true;
    }

    // chia bài
    async giveOut() {
        for (let i = 0; i < 13; i++) {
            for (let pos in this.players) {
                if (this.players[pos] !== null) {
                    if (this.unusedCards.length == 0) break;
                    this.players[pos].addCard(this.unusedCards.shift());
                    await sleep(GIVEOUT_DELAY);
                }
            }
        }
    }

    // xáo bài
    shuffle() {
        let u = this.unusedCards;
        for (let i = u.length - 1; i > 0; i--) {
            const j = floor(random(i + 1));
            [u[i], u[j]] = [u[j], u[i]];
        }
    }

    // đánh bài
    go(player, cards) {
        let x = width / 2 + random(-50, 50);
        let y = height / 2 + random(-50, 50);

        CardHelper.placeCards(cards, x, y);

        for (let c of cards) {
            player.removeCard(c);
            this.onBoardCards.push(c);
        }

        console.log(player.cards);
    }

    // thêm người chơi
    addPlayer(name, position) {
        if (!this.players[position])
            this.players[position] = new Player(name, position);
    }

    getCardAt(x, y) {
        if (!this.players[POSITION.BOTTOM]) return null;

        let listCards = this.players[POSITION.BOTTOM].cards;

        for (let i = listCards.length - 1; i >= 0; i--) {
            const c = listCards[i];
            const { angle: a, x: cx, y: cy } = c;
            if (testRectangleToPoint(CARD_WIDTH, CARD_HEIGHT, a, cx, cy, x, y))
                return c;
        }

        return null;
    }

    // events
    onMouseClicked() {
        if (!this.giveOutFinished) return;

        // click buttons
        this.goBtn.handleMousePressed();
        this.passBtn.handleMousePressed();

        // select card
        let cardAtMouse = this.getCardAt(mouseX, mouseY);

        if (cardAtMouse) {
            let index = this.selected.indexOf(cardAtMouse);
            if (index == -1) {
                this.selected.push(cardAtMouse);
                cardAtMouse.moveBy(0, -30);
            } else {
                this.selected.splice(index, 1);
                cardAtMouse.undoMove();
            }
        }

        this.goBtn.active = CardHelper.isValidCardsCombination(this.selected);
    }
}
