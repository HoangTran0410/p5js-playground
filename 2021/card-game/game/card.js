import CardHelper from '../helper/card-helper.js';
import { CARD_LERP_SPEED } from '../constant.js';

export default class Card {
    constructor(suit, value, hidden = false, x = width / 2, y = height / 2) {
        this.value = value;
        this.suit = suit;
        this.hidden = hidden;
        this.owner = null;
        this.hightlight = false;

        // for positioning
        this.x = x;
        this.y = y;
        this.preX = x;
        this.preY = y;
        this.angle = 0;
        this.desX = x;
        this.desY = y;
    }

    update() {
        this.x = lerp(this.x, this.desX, CARD_LERP_SPEED);
        this.y = lerp(this.y, this.desY, CARD_LERP_SPEED);
    }

    moveTo(x, y) {
        this.desX = x;
        this.desY = y;
        this.savePreMove();
    }

    moveBy(dx = 0, dy = 0) {
        this.desX = this.x + dx;
        this.desY = this.y + dy;
        this.savePreMove();
    }

    undoMove() {
        this.desX = this.preX;
        this.desY = this.preY;
        this.savePreMove();
    }

    savePreMove() {
        this.preX = this.x;
        this.preY = this.y;
    }

    show() {
        let { x, y, angle, suit, value } = this;

        this.hidden
            ? CardHelper.showHiddenCard(x, y, angle)
            : CardHelper.showCard(suit, value, x, y, angle);

        if (this.hightlight) CardHelper.hightlight(this);
    }
}
