import { SIDE } from '../constant.js';
import { wireP5Event } from '../helper/helper.js';
import CardHelper from '../helper/card-helper.js';
import Button from '../helper/button.js';
import Board from './board.js';
import AI from './ai.js';

export default class Game {
    static instance = null;

    constructor() {
        Game.instance = this;

        this.board = new Board();
        this.hoveredCard = null;

        this.mainPlayer = this.board.addPlayer('Hoang', SIDE.BOTTOM);
        this.topPlayer = this.board.addPlayer('Hien', SIDE.TOP);

        this.initUI();
        wireP5Event('mouseClicked', this.onMouseClicked.bind(this));
    }

    newGame() {
        this.board.newGame();
    }

    initUI() {
        this.buttons = {
            // newGameBtn: new Button('Ván Mới', width - 55, height - 30, 100, 40),
            // goBtn: new Button('Đánh', width / 2, height / 2 - 25, 80, 40),
            newGameBtn: new Button('Ván Mới', width - 55, height - 30, 100, 40),
            passBtn: new Button('Bỏ Lượt', width - 55, height - 75, 100, 40),
            goBtn: new Button('Đánh', width - 45, height - 120, 80, 40),
        };

        this.buttons.newGameBtn
            .setColour('#455062')
            .visibleIf(() => this.board.giveOutFinished)
            .onMouseClicked(() => {
                this.newGame();
            });

        this.buttons.goBtn
            .visibleIf(
                () =>
                    this.board.giveOutFinished && this.board.turn == SIDE.BOTTOM
            )
            .activeIf(() => this.mainPlayer.isValidSelected)
            .onMouseClicked(() => {
                this.mainPlayer.go();
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

        if (this.hoveredCard) this.hoveredCard.hightlight = false;
        this.hoveredCard = this.board.getCardAt(
            mouseX,
            mouseY,
            this.mainPlayer.cards
        );
        if (this.hoveredCard) this.hoveredCard.hightlight = true;
    }

    show() {
        this.board.show();

        // hovered card
        if (this.hoveredCard) {
            CardHelper.hightlight(this.hoveredCard);
        }

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

        // select card
        let cardAtMouse = this.board.getCardAt(
            mouseX,
            mouseY,
            this.mainPlayer.cards
        );

        if (cardAtMouse) {
            let isSelected = this.mainPlayer.toggleSelect(cardAtMouse);
            isSelected ? cardAtMouse.moveBy(0, -30) : cardAtMouse.undoMove();
        }
    }
}
