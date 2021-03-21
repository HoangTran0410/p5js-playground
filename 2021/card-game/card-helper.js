import { VALUES, SUITS, SORT_TYPE } from './constant.js';

export default class CardHelper {
    // kiểm tra những cards này có hợp lệ hay không
    static isValidCardsCombination(cards) {
        let sorted = CardHelper.sort(cards);

        // same value
        let isSameValue = true;
        for (let c of sorted) {
            if (c.value != sorted[0].value) {
                isSameValue = false;
                break;
            }
        }
        if (isSameValue) return true;

        // continuous value
        let isContinuousValue = true;
        for (let i = 1; i < sorted.length; i++) {
            if (
                VALUES.indexOf(sorted[i].value) !==
                VALUES.indexOf(sorted[i - 1].value) - 1
            ) {
                isContinuousValue = false;
                break;
            }
        }
        if (isContinuousValue && sorted.length >= 3) return true;

        return false;
    }

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
}
