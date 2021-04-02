import CardHelper from '../helper/card-helper.js';
import Board from './board.js';

export default class AI {
    static go(player) {
        let { lastMove } = Board.instance;
        let { cards } = player;

        let len = lastMove.length;
        if (len == 0) {
            player.selectCards([cards[0]]);
            player.go();
            return;
        }

        if (cards.length < len) {
            Board.instance.pass();
            return;
        }

        let type = CardHelper.getCombinationType(lastMove);

        for (let i = 0; i < cards.length - len; i++) {
            let c = cards.slice(i, i + len);
            if (
                CardHelper.isCombinationType(c, type) &&
                CardHelper.compareCombination(c, lastMove) == 1
            ) {
                player.selectCards(c);
                player.go();
                return;
            }
        }

        Board.instance.pass();
    }
}
