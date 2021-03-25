// --------------- CONSTANTS ---------------
// sorted by ranking
export const VALUES = [2, 'A', 'K', 'Q', 'J', 10, 9, 8, 7, 6, 5, 4, 3];
export const SUITS = ['♥', '♦', '♠', '♣']; // Heart, Diamonds, Clubs, Spades
export const COLORS = {
    '♥': 'red',
    '♦': 'red',
    '♠': 'black',
    '♣': 'black',
};
export const POSITION = {
    TOP: 'TOP',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    BOTTOM: 'BOTTOM',
};
export const SORT_TYPE = {
    DEFAULT: 'DEFAULT',
    BY_VALUE: 'BY_VALUE',
    BY_SUIT: 'BY_SUIT',
};
export const COMBINATION_TYPE = {
    // https://vi.wikipedia.org/wiki/B%C3%A0i_Ti%E1%BA%BFn_l%C3%AAn
    SINGLE: 'SINGLE', // lá lẻ
    PAIR: 'PAIR', // đôi - 2 lá giống nhau
    THREE: 'THREE', // sảnh - 3 lá giống nhau
    FOUR: 'FOUR', // tứ quý - 4 lá giống nhau
    STRAIGHT: 'STRAIGHT', // sảnh - bài liên tiếp nhau
    CONSECUTIVE_PAIRS: 'CONSECUTIVE_PAIRS', // 3 đôi thông - 3 đôi liên tiếp
};
export const PEER_DATA_EVENTS = {
    SYNCGAME: 'SYNCGAME',
    CLIENT_LEAVE: 'CLIENT_LEAVE',
    CLIENT_JOIN: 'CLIENT_JOIN',
    START_GAME: 'START_GAME',
    EJECT: 'EJECT',
    GIVEOUT: 'GIVEOUT',
};

// --------------- CONFIGS ---------------
// export const PEERJS_SERVER = {
//     SECURE: false,
//     HOST: 'localhost', //'hoang-peerjs-server.herokuapp.com',
//     PORT: 9000,
// };
export const PEERJS_SERVER = {
    SECURE: true,
    HOST: 'hoang-peerjs-server.herokuapp.com',
    PORT: 443,
};
export const TURN_TIMEOUT = 30000;
export const CARD_LERP_SPEED = 0.5;
export const GIVEOUT_DELAY = 50;
export const CARD_WIDTH = 60;
export const CARD_HEIGHT = 90;
export const TURNS = [
    POSITION.BOTTOM,
    POSITION.RIGHT,
    POSITION.TOP,
    POSITION.LEFT,
];
