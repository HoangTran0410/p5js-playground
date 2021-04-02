import {
    CARD_HEIGHT,
    CARD_WIDTH,
    GIVEOUT_DELAY,
    SIDE,
    TURNS,
    TURN_TIMEOUT,
    VALUES,
    SUITS,
} from '../constant.js';
import {
    testRectangleToPoint,
    millisToMinutes,
    sleep,
} from '../helper/helper.js';
import CardHelper from '../helper/card-helper.js';
import Player from './player.js';
import Card from './card.js';
import Game from './game.js';
import AI from './ai.js';

export default class Board {
    static instance = null;

    constructor() {
        Board.instance = this;
        this.players = {};
        this.reset();
    }

    reset() {
        this.deck = [];
        this.unused = [];
        this.played = [];
        this.lastMove = [];

        this.turn = SIDE.BOTTOM;
        this.turnCountDown = TURN_TIMEOUT;
        this.giveOutFinished = false;

        for (let position in this.players) {
            this.players[position].removeAllCards();
        }

        for (let value of VALUES) {
            for (let suit of SUITS) {
                this.deck.push(new Card(suit, value));
            }
        }

        this.unused.push(...this.deck);
    }

    update() {
        for (let position in this.players) {
            this.players[position].update();
        }

        for (let c of this.played) {
            c.update();
        }

        if (this.giveOutFinished) {
            this.turnCountDown -= deltaTime;

            if (this.turnCountDown <= 0) {
                this.pass();
            }
        }
    }

    show() {
        this.showBoard();
        this.showPlayerCards();
    }

    showPlayerCards() {
        // player names
        let namePos = {
            [SIDE.TOP]: [CENTER, TOP, width / 2, height / 2 - 190],
            [SIDE.BOTTOM]: [CENTER, BOTTOM, width / 2, height / 2 + 190],
            [SIDE.LEFT]: [LEFT, CENTER, 85, height / 2],
            [SIDE.RIGHT]: [RIGHT, CENTER, width - 85, height / 2],
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
            this.players[position].show();
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
        if (this.unused.length) {
            CardHelper.showHiddenCard(
                width / 2,
                height / 2,
                0,
                this.unused.length
            );
        }

        // cards on board
        for (let c of this.played) {
            c.show();
        }
    }

    // ----------------- game actions -----------------
    // ván mới
    async newGame() {
        this.reset();

        this.shuffle();
        await this.giveOut();

        for (let side in this.players) {
            this.players[side].sortCards();
        }
    }

    // chia bài
    async giveOut() {
        this.giveOutFinished = false;

        for (let i = 0; i < 13; i++) {
            for (let side in this.players) {
                if (this.unused.length == 0) break;

                let card = this.unused.shift();
                card.hidden = this.players[side].hidden;
                this.players[side].addCard(card);

                await sleep(GIVEOUT_DELAY);
            }
        }

        this.giveOutFinished = true;
    }

    // xáo bài
    shuffle() {
        let u = this.unused;
        for (let i = u.length - 1; i > 0; i--) {
            const j = floor(random(i + 1));
            [u[i], u[j]] = [u[j], u[i]];
        }
    }

    // đánh bài
    go(cards) {
        let x = width / 2 + random(-50, 50);
        let y = height / 2 + random(-50, 50);

        cards.forEach((card) => (card.hidden = false));
        CardHelper.placeCards(cards, x, y, random(-0.5, 0.5));

        this.setLastMove(cards);
        this.played.push(...cards);

        if (this.checkWin()) setTimeout(() => this.newGame(), 2000);
        else this.nextTurn();
    }

    checkWin() {
        for (let side in this.players) {
            if (this.players[side].cards.length == 0) {
                return true;
            }
        }

        return false;
    }

    setLastMove(cards = []) {
        this.lastMove.forEach((card) => (card.hightlight = false));
        this.lastMove = [...cards];
        this.lastMove.forEach((card) => (card.hightlight = true));
    }

    // bỏ lượt
    pass() {
        this.setLastMove([]);
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

        // AI check turn
        let curPlayer = this.getCurrentPlayer();
        if (curPlayer != Game.instance.mainPlayer) {
            setTimeout(() => AI.go(curPlayer), 1000);
        }
    }

    getCurrentPlayer() {
        return this.players[this.turn];
    }

    // thêm người chơi
    addPlayer(name, side, hidden = false) {
        if (side in SIDE && !this.havePlayer(side)) {
            this.players[side] = new Player(
                name,
                CardHelper.getPlayerPosition(side),
                hidden
            );

            return this.players[side];
        }
        return null;
    }

    // xóa người chơi
    async removePlayer(side) {
        if (side in SIDE && this.havePlayer(side)) {
            for (let c of this.players[side].cards) {
                c.moveTo(width / 2, height / 2);
                await sleep(GIVEOUT_DELAY);
                this.unused.push(c);
            }
            delete this.players[side];
        }
    }

    // ----------------- board utils -----------------
    // kiểm tra xem vị trí 'side' có người chơi chưa
    havePlayer(side) {
        return !!this.players[side];
    }

    // trả về card thuộc listCards tại vị trí x,y trên màn hình
    getCardAt(x, y, listCards = this.deck) {
        for (let i = listCards.length - 1; i >= 0; i--) {
            const c = listCards[i];
            const { angle: a, x: cx, y: cy } = c;
            if (testRectangleToPoint(CARD_WIDTH, CARD_HEIGHT, a, cx, cy, x, y))
                return c;
        }

        return null;
    }
}
