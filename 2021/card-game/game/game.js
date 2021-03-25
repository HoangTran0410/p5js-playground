import {
    CARD_HEIGHT,
    CARD_WIDTH,
    GIVEOUT_DELAY,
    POSITION,
    SUITS,
    TURNS,
    TURN_TIMEOUT,
    VALUES,
} from '../constant.js';
import {
    testRectangleToPoint,
    sleep,
    millisToMinutes,
} from '../helper/helper.js';

import Button from '../helper/button.js';
import CardHelper from '../helper/card-helper.js';
import Card from './card.js';
import Player from './player.js';

export default class Game {
    constructor() {
        this.deck = [];
        this.players = {};

        this.resetVariables();
        this.initUI();
    }

    resetVariables() {
        this.unusedCards = [];
        this.played = [];
        this.selected = [];
        this.lastMove = [];

        this.turn = null;
        this.turnCountDown = TURN_TIMEOUT;
        this.hoveredCard = null;
        this.giveOutFinished = false;
        this.isValidSelected = false;

        this.deck = [];

        for (let value of VALUES) {
            for (let suit of SUITS) {
                this.deck.push(new Card(suit, value));
            }
        }

        for (let c of this.deck) {
            this.unusedCards.push(c);
        }

        for (let position in this.players) {
            this.players[position].cards = [];
        }
    }

    initUI() {
        this.buttons = {
            newGameBtn: new Button('Ván Mới', width - 55, height - 30, 100, 40),
            goBtn: new Button('Đánh', width / 2, height / 2 - 25, 80, 40),
            passBtn: new Button('Bỏ Lượt', width / 2, height / 2 + 25, 100, 40),
        };

        this.buttons.newGameBtn.onMouseClicked(() => {
            this.newGame();
        });

        this.buttons.goBtn
            .visibleIf(
                () => this.giveOutFinished && this.turn == POSITION.BOTTOM
            )
            .activeIf(() => this.isValidSelected)
            .onMouseClicked(() => {
                this.go(this.selected);
                this.players[POSITION.BOTTOM].sortCards();
                this.selected.length = 0;
            });

        this.buttons.passBtn
            .setColour('#dd4252')
            .visibleIf(
                () => this.giveOutFinished && this.turn == POSITION.BOTTOM
            )
            .onMouseClicked(() => {
                this.pass();
            });
    }

    update() {
        for (let position in this.players) {
            this.players[position].update();
        }

        for (let c of this.played) {
            c.update();
        }

        this.hoveredCard = this.getCardAt(mouseX, mouseY);

        if (this.giveOutFinished) {
            this.turnCountDown -= deltaTime;

            if (this.turnCountDown <= 0) {
                this.nextTurn();
            }
        }
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

            if (this.turn == position)
                name += '\n' + millisToMinutes(this.turnCountDown);

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
            CardHelper.showHiddenCard(
                width / 2,
                height / 2,
                0,
                this.unusedCards.length
            );
        }

        // cards on board
        for (let c of this.played) {
            c.show();
        }
    }

    // ----------------- game actions -----------------
    // ván mới
    async newGame(onGiveout = () => {}) {
        this.resetVariables();

        this.shuffle();
        await this.giveOut(onGiveout);

        for (let position in this.players) {
            this.players[position].sortCards();
        }
    }

    // chia bài
    async giveOut(onGiveout) {
        this.giveOutFinished = false;

        for (let i = 0; i < 13; i++) {
            for (let position in this.players) {
                if (this.unusedCards.length == 0) break;
                let card = this.unusedCards.shift();
                this.players[position].addCard(card);
                onGiveout(this.players[position], card);
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
            this.played.push(c);
        }

        this.nextTurn();
    }

    // bỏ lượt
    pass() {
        this.nextTurn();
    }

    // lượt tiếp theo
    nextTurn() {
        let curTurnIndex = TURNS.indexOf(this.turn);
        let nextTurn = null;

        while (!nextTurn) {
            curTurnIndex = (curTurnIndex + 1) % TURNS.length;

            if (this.havePlayer(TURNS[curTurnIndex])) {
                nextTurn = TURNS[curTurnIndex];
            }
        }

        this.turn = nextTurn;
        this.turnCountDown = TURN_TIMEOUT;
    }

    // thêm người chơi
    addPlayer(name, position) {
        if (position in POSITION && !this.havePlayer(position))
            this.players[position] = new Player(name, position);
    }

    // xóa người chơi
    async removePlayer(position) {
        if (position in POSITION && this.havePlayer(position)) {
            for (let c of this.players[position].cards) {
                c.moveTo(width / 2, height / 2);
                await sleep(GIVEOUT_DELAY);
                this.unusedCards.push(c);
            }
            delete this.players[position];
        }
    }

    // events
    onMouseClicked() {
        if (!this.giveOutFinished) return;

        // click buttons
        for (let key in this.buttons) {
            this.buttons[key].handleMouseClicked();
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

    // ----------------- game utils -----------------
    // kiểm tra xem vị trí position có người chơi chưa
    havePlayer(position) {
        return !!this.players[position];
    }

    // trả về card của người chơi (BOTTOM) tại vị trí x,y trên màn hình
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
}
