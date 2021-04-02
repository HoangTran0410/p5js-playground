import { SIDE } from '../constant.js';
import Button from '../helper/button.js';
import Board from './board.js';

export default class Game {
    constructor() {
        this.board = new Board();
        this.initUI();

        this.board.addPlayer('Hoang', SIDE.BOTTOM);
        this.board.addPlayer('Hien', SIDE.TOP, true);
    }

    newGame() {
        this.board.newGame();
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
                () =>
                    this.board.giveOutFinished && this.board.turn == SIDE.BOTTOM
            )
            .activeIf(() => this.board.isValidSelected)
            .onMouseClicked(() => {
                this.board.go(this.board.selected);
                this.board.players[SIDE.BOTTOM].sortCards();
                this.board.selected.length = 0;
            });

        this.buttons.passBtn
            .setColour('#dd4252')
            .visibleIf(
                () =>
                    this.board.giveOutFinished && this.board.turn == SIDE.BOTTOM
            )
            .onMouseClicked(() => {
                this.board.pass();
            });
    }

    update() {
        this.board.update();
    }

    show() {
        this.board.show();

        // ui
        for (let key in this.buttons) {
            this.buttons[key].show();
        }
    }

    // events
    onMouseClicked() {
        // click buttons
        for (let key in this.buttons) {
            this.buttons[key].handleMouseClicked();
        }

        // click board
        this.board.onMouseClicked();
    }
}
