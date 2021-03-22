import {
    CARD_HEIGHT,
    CARD_WIDTH,
    GIVEOUT_DELAY,
    POSITION,
    SUITS,
    TURNS,
    VALUES,
} from './constant.js';
import { testRectangleToPoint, sleep } from './helper.js';
import Card from './card.js';
import Player from './player.js';
import CardHelper from './card-helper.js';
import Button from './button.js';

export default class Game {
    constructor() {
        // this.resetVariables();
        this.deck = [];
        this.players = {};

        this.resetVariables();
        this.initUI();
    }

    resetVariables() {
        this.unusedCards = [];
        this.onBoardCards = [];
        this.selected = [];
        this.lastMove = [];

        this.turn = POSITION.BOTTOM;
        this.hoveredCard = null;
        this.giveOutFinished = false;
        this.isValidSelected = false;
    }

    initUI() {
        this.buttons = {
            newGameBtn: new Button('Ván Mới', width - 55, height - 30, 100, 40),
            goBtn: new Button('Đánh', width / 2, height / 2 - 25, 80, 40),
            passBtn: new Button('Bỏ', width / 2, height / 2 + 25, 80, 40),
        };

        this.buttons.newGameBtn.onMousePressed(() => {
            this.newGame();
        });

        this.buttons.goBtn
            .visibleIf(
                () =>
                    this.giveOutFinished &&
                    this.turn == POSITION.BOTTOM &&
                    this.isValidSelected
            )
            .onMousePressed(() => {
                this.go(this.selected);
                this.players[POSITION.BOTTOM].sortCards();
                this.selected.length = 0;
            });

        this.buttons.passBtn
            .setColour('#dd4252')
            .visibleIf(
                () => this.giveOutFinished && this.turn == POSITION.BOTTOM
            )
            .onMousePressed(() => {});
    }

    update() {
        for (let position in this.players) {
            this.players[position].update();
        }

        for (let c of this.onBoardCards) {
            c.update();
        }

        this.hoveredCard = this.getCardAt(mouseX, mouseY);
    }

    show() {
        this.showBoard();
        this.showLastMove();
        this.showPlayerCards();

        // card at mouse
        if (this.giveOutFinished) {
            if (this.hoveredCard) {
                CardHelper.hightlight(this.hoveredCard);
            }
        }

        // ui
        for (let key in this.buttons) {
            this.buttons[key].show();
        }
    }

    showPlayerCards() {
        // player names
        let namePos = {
            [POSITION.TOP]: [CENTER, TOP, width / 2, height / 2 - 190],
            [POSITION.BOTTOM]: [CENTER, BOTTOM, width / 2, height / 2 + 190],
            [POSITION.LEFT]: [LEFT, CENTER, 85, height / 2],
            [POSITION.RIGHT]: [RIGHT, CENTER, width - 85, height / 2],
        };
        noStroke();
        for (let position in this.players) {
            let np = namePos[position];
            let name = this.players[position].name;

            fill(position === this.turn ? 'yellow' : 'white');
            textAlign(np[0], np[1]);
            text(name, np[2], np[3]);
        }

        // player cards
        for (let position in this.players) {
            if (position === POSITION.BOTTOM) {
                this.players[position].showCards();
            } else {
                this.players[position].showCardsHidden();
            }
        }
    }

    showLastMove() {
        for (let c of this.lastMove) {
            CardHelper.hightlight(c);
        }
    }

    showBoard() {
        // board
        fill('#067254');
        stroke('#878F95');
        strokeWeight(10);
        rect(width / 2, height / 2, width - 150, height - 200, 200);
        circle(width / 2, height / 2, 200);

        // unused cards
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

        // cards on board
        for (let c of this.onBoardCards) {
            c.show();
        }
    }

    // ván mới
    async newGame() {
        this.resetVariables();

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

        for (let position in this.players) {
            this.players[position].sortCards();
        }
    }

    // chia bài
    async giveOut() {
        this.giveOutFinished = false;

        for (let i = 0; i < 13; i++) {
            for (let position in this.players) {
                if (this.unusedCards.length == 0) break;
                this.players[position].addCard(this.unusedCards.shift());
                await sleep(GIVEOUT_DELAY);
            }
        }

        this.giveOutFinished = true;
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
    go(cards) {
        let player = this.players[this.turn];
        let x = width / 2 + random(-50, 50);
        let y = height / 2 + random(-50, 50);

        CardHelper.placeCards(cards, x, y);
        this.lastMove = [...cards];

        for (let c of cards) {
            player.removeCard(c);
            this.onBoardCards.push(c);
        }

        this.turn = this.getNextTurn();
    }

    // thêm người chơi
    addPlayer(name, position) {
        if (position in POSITION && !this.havePlayer(position))
            this.players[position] = new Player(name, position);
    }

    havePlayer(position) {
        return this.players[position] != undefined;
    }

    getNextTurn() {
        let curTurnIndex = TURNS.indexOf(this.turn);
        let nextTurn = null;

        while (!nextTurn) {
            curTurnIndex = (curTurnIndex + 1) % TURNS.length;

            if (this.havePlayer(TURNS[curTurnIndex])) {
                nextTurn = TURNS[curTurnIndex];
            }
        }

        return nextTurn;
    }

    getCardAt(x, y) {
        if (!this.havePlayer(POSITION.BOTTOM)) return null;

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
        for (let key in this.buttons) {
            this.buttons[key].handleMousePressed();
        }

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

        this.isValidSelected =
            this.selected.length &&
            CardHelper.isValidCardsCombination(this.selected);
    }
}
