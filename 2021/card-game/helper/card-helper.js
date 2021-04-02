import {
    VALUES,
    SUITS,
    COLORS,
    SORT_TYPE,
    SIDE,
    CARD_WIDTH,
    CARD_HEIGHT,
    COMBINATION_TYPE,
} from '../constant.js';

export default class CardHelper {
    static isMoving(card) {
        return dist(card.x, card.y, card.desX, card.desY) > 2;
    }

    // sắp xếp bài
    static sort(listCards, sortType = SORT_TYPE.DEFAULT) {
        if (sortType === SORT_TYPE.DEFAULT)
            return listCards.sort((c1, c2) => CardHelper.compare(c1, c2));

        if (sortType === SORT_TYPE.BY_VALUE)
            return listCards.sort(
                (c1, c2) => VALUES.indexOf(c2.value) - VALUES.indexOf(c1.value)
            );

        if (sortType === SORT_TYPE.BY_SUIT)
            return listCards.sort(
                (c1, c2) => SUITS.indexOf(c2.suit) - SUITS.indexOf(c1.suit)
            );

        return listCards;
    }

    // so sánh 2 lá bài
    static compare(card1, card2) {
        let value1i = VALUES.indexOf(card1.value);
        let value2i = VALUES.indexOf(card2.value);
        let suit1i = SUITS.indexOf(card1.suit);
        let suit2i = SUITS.indexOf(card2.suit);

        if (value1i == -1 || value2i == -1 || suit1i == -1 || suit2i == -1)
            return 0;

        if (value1i < value2i) {
            return 1;
        } else if (value1i > value2i) {
            return -1;
        } else if (suit1i < suit2i) {
            return 1;
        } else if (suit1i > suit2i) {
            return -1;
        } else return 0;
    }

    // so sánh 2 sự kết hợp bài
    static compareCombination(cards1, cards2) {
        let type1 = CardHelper.getCombinationType(cards1);
        let type2 = CardHelper.getCombinationType(cards2);

        // same type
        if (type1 === type2) {
            let biggest1 = CardHelper.sort(cards1)[0];
            let biggest2 = CardHelper.sort(cards2)[0];

            return CardHelper.compare(biggest1, biggest2);
        }

        // TODO: special compare
        // tứ quý - heo
        // 3 đôi thông - heo
    }

    // kiểm tra sự kết hợp bài có hợp lệ hay không
    static isValidCardsCombination(cards) {
        return CardHelper.getCombinationType(cards) !== null;
    }

    // xem loại kết hợp
    static getCombinationType(cards) {
        if (cards.length == 0) return null;

        for (let type in COMBINATION_TYPE) {
            if (CardHelper.isCombinationType(cards, type)) {
                return type;
            }
        }

        return null;
    }

    static isCombinationType(cards, type) {
        // single
        if (type == COMBINATION_TYPE.SINGLE) return cards.length == 1;

        // pair
        if (type == COMBINATION_TYPE.PAIR)
            return cards.length == 2 && cards[0].value == cards[1].value;

        // three
        if (type == COMBINATION_TYPE.THREE)
            return (
                cards.length == 3 &&
                cards[0].value == cards[1].value &&
                cards[1].value == cards[2].value
            );

        // four
        if (type == COMBINATION_TYPE.FOUR)
            return (
                cards.length == 4 &&
                cards[0].value == cards[1].value &&
                cards[1].value == cards[2].value &&
                cards[2].value == cards[3].value
            );

        // straight
        if (type == COMBINATION_TYPE.STRAIGHT) {
            if (cards.length < 3) return false;
            if (cards.find((c) => c.value == 2)) return false;

            let sorted = CardHelper.sort(cards);
            let isStraight = true;
            for (let i = 1; i < sorted.length; i++) {
                if (
                    VALUES.indexOf(sorted[i].value) !==
                    VALUES.indexOf(sorted[i - 1].value) - 1
                ) {
                    isStraight = false;
                    break;
                }
            }
            return isStraight;
        }

        // consecutive pairs
        if (type == COMBINATION_TYPE.CONSECUTIVE_PAIRS) {
            if (cards.length % 2 !== 0) return false;

            let sorted = CardHelper.sort(cards);
            let odd = sorted.filter((v, i) => i % 2 !== 0);
            let even = sorted.filter((v, i) => i % 2 === 0);

            return (
                CardHelper.isCombinationType(odd, COMBINATION_TYPE.STRAIGHT) &&
                CardHelper.isCombinationType(even, COMBINATION_TYPE.STRAIGHT)
            );
        }

        return false;
    }

    static getPlayerPosition(side) {
        switch (side) {
            case SIDE.TOP:
                return { x: width / 2, y: CARD_HEIGHT / 2 };
            case SIDE.BOTTOM:
                return { x: width / 2, y: height - CARD_HEIGHT / 2 };
            case SIDE.LEFT:
                return { x: CARD_WIDTH / 2, y: height / 2 };
            case SIDE.RIGHT:
                return { x: width - CARD_WIDTH / 2, y: height / 2 };
        }
    }

    // đặt bài tại vị trí x,y
    static placeCards(cards, x, y, angle = 0) {
        let spacing = 30;
        let halflen = cards.length / 2;

        for (let i = 0; i < cards.length; i++) {
            let dx = -halflen * spacing + CARD_WIDTH / 2 + i * spacing;
            let des = createVector(dx, 0).rotate(angle).add(x, y);

            cards[i].moveTo(des.x, des.y);
            cards[i].angle = angle;
        }
    }

    // hiển thị 1 lá bài ngửa tại vị trí x,y
    static cardGraphics = {};
    static showCard(suit, value, x, y, angle) {
        let key = value + suit;
        if (!CardHelper.cardGraphics[key]) {
            CardHelper.cardGraphics[key] = CardHelper.generateCardGraphic(
                suit,
                value
            );
        }

        push();
        translate(x, y);
        angle && rotate(angle);
        image(CardHelper.cardGraphics[key], 0, 0);
        pop();
    }

    static generateCardGraphic(suit, value) {
        let w = CARD_WIDTH;
        let h = CARD_HEIGHT;
        let _ = createGraphics(w, h);

        _.fill(255);
        _.stroke(150);
        _.strokeWeight(2);
        _.rect(1, 1, w - 2, h - 2, 5);

        _.noStroke();
        _.fill(COLORS[suit]);

        _.textFont('Consolas');
        _.textStyle('bold');
        _.textSize(25);
        _.textAlign(LEFT, TOP);
        _.text(suit, 5, 30);

        if (('' + value).length > 1) _.textSize(23);
        _.text(value, 5, 5);

        return _;
    }

    // hiển thị 1 lá bài úp tại vị trí x,y
    static hiddenCardGraphics = null;
    static showHiddenCard(x, y, a, t) {
        if (CardHelper.hiddenCardGraphics == null) {
            let w = CARD_WIDTH;
            let h = CARD_HEIGHT;

            CardHelper.hiddenCardGraphics = createGraphics(w, h);

            let _ = CardHelper.hiddenCardGraphics; // ref

            _.fill(150);
            _.stroke(30);
            _.strokeWeight(2);
            _.rect(1, 1, w - 2, h - 2, 5);

            _.stroke(175);
            _.strokeWeight(3);
            _.line(5, 5, w - 5, h - 5);
            _.line(w - 5, 5, 5, h - 5);
        }

        push();
        translate(x, y);
        a && rotate(a);

        image(CardHelper.hiddenCardGraphics, 0, 0);

        if (t) {
            fill(255);
            stroke(0);
            strokeWeight(5);
            textSize(25);
            textAlign(CENTER, CENTER);
            text(t, 0, 0);
        }

        pop();
    }

    // tô sáng 1 lá bài
    static hightlight(card, colour = 'yellow') {
        let { x, y } = card;
        let w = CARD_WIDTH;
        let h = CARD_HEIGHT;

        push();
        translate(x, y);
        card.angle && rotate(card.angle);

        noFill();
        stroke(colour);
        strokeWeight(4);
        rect(0, 0, w, h, 5);

        pop();
    }
}
