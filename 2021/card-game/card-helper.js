import {
    VALUES,
    SUITS,
    SORT_TYPE,
    CARD_WIDTH,
    CARD_HEIGHT,
    COMBINATION_TYPE,
} from './constant.js';

export default class CardHelper {
    static isNotMoving(card) {
        return dist(card.x, card.y, card.desX, card.desY) < 2;
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

    // kiểm tra sự kết hợp bài có hợp lệ hay không
    static isValidCardsCombination(cards) {
        return CardHelper.getCombinationType(cards) !== null;
    }

    // xem loại kết hợp
    static getCombinationType(cards) {
        // empty
        if (cards.length == 0) return null;

        // single
        if (cards.length == 1) return COMBINATION_TYPE.SINGLE;

        // pair
        if (cards.length == 2 && cards[0].value == cards[1].value)
            return COMBINATION_TYPE.PAIR;

        // three
        if (
            cards.length == 3 &&
            cards[0].value == cards[1].value &&
            cards[1].value == cards[2].value
        )
            return COMBINATION_TYPE.THREE;

        // four
        if (
            cards.length == 4 &&
            cards[0].value == cards[1].value &&
            cards[1].value == cards[2].value &&
            cards[2].value == cards[3].value
        )
            return COMBINATION_TYPE.FOUR;

        // consecutive pairs
        // TODO this is wrong: 3 đôi thông phải LIÊN TIẾP NHAU
        if (cards.length == 6) {
            let sorted = CardHelper.sort(cards);

            if (
                sorted[0].value === sorted[1].value &&
                sorted[1].value !== sorted[2].value &&
                sorted[2].value === sorted[3].value &&
                sorted[3].value !== sorted[4].value &&
                sorted[4].value === sorted[5].value
            ) {
                return COMBINATION_TYPE.CONSECUTIVE_PAIRS;
            }
        }

        // straight
        if (cards.length >= 3) {
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
            if (isStraight) return COMBINATION_TYPE.STRAIGHT;
        }

        return null;
    }

    // đặt bài tại vị trí x,y
    static placeCards(cards, x, y, angle = 0) {
        let spacing = 30;
        let halflen = cards.length / 2;

        for (let i = 0; i < cards.length; i++) {
            let desX = x - halflen * spacing + CARD_WIDTH / 2 + i * spacing;
            cards[i].moveTo(desX, y);
        }
    }

    // hiển thị 1 lá bài úp tại vị trí x,y
    static showHiddenCard(x, y, a, t) {
        let w = CARD_WIDTH;
        let h = CARD_HEIGHT;

        push();
        translate(x, y);
        a && rotate(a);

        fill(150);
        stroke(0);
        strokeWeight(2);
        rect(0, 0, w, h, 5);

        stroke(175);
        strokeWeight(3);
        line(-w / 2 + 5, -h / 2 + 5, w / 2 - 5, h / 2 - 5);
        line(w / 2 - 5, -h / 2 + 5, -w / 2 + 5, h / 2 - 5);

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

        // card.show()

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
