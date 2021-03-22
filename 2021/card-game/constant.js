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

// --------------- CONFIGS ---------------
export const CARD_LERP_SPEED = 0.5;
export const GIVEOUT_DELAY = 50;
export const CARD_WIDTH = 60;
export const CARD_HEIGHT = 90;
export const TURNS = [
    POSITION.BOTTOM,
    POSITION.RIGH,
    POSITION.TOP,
    POSITION.LEFT,
];