// --------------- CONSTANTS ---------------
// sorted by ranking
export const VALUES = [2, 'A', 'K', 'Q', 'J', 10, 9, 8, 7, 6, 5, 4, 3];
export const SUITS = ['♥', '♦', '♣', '♠']; // Heart, Diamonds, Clubs, Spades
export const COLORS = {
    '♥': 'red',
    '♦': 'red',
    '♣': 'black',
    '♠': 'black',
};
export const SIDE = {
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
    CONSECUTIVE_PAIRS: 'CONSECUTIVE_PAIRS', // n đôi thông - n đôi liên tiếp
};
export const SPECIAL_COMBINATION_TYPE = {
    TWO: 'TWO', // 1 heo
    DOUBLE_TWO: 'DOUBLE_TWO', // đôi heo
    TRIPLE_TWO: 'TRIPLE_TWO', // 3 heo
    QUAD_TWO: 'QUAD_TWO', // tứ quý heo
    THREE_PAIRS: 'THREE_PAIRS', // 3 đôi thông
    FOUR_PAIRS: 'FOUR_PAIRS', // 4 đôi thông
};
export const COMPARE_TEMPLATE = {
    // tứ quý - 1 heo, 3 heo
    FOUR: ['TWO', 'TRIPLE_TWO'],
    // 3 đôi thông - 1 heo
    THREE_PAIRS: ['TWO'],
    // 4 đôi thông - 1 heo, 2 heo, 3 heo, tứ quý
    FOUR_PAIRS: ['DOUBLE_TWO', 'TRIPLE_TWO', 'THREE_PAIRS', 'FOUR'],
};

// --------------- CONFIGS ---------------
export const TURN_TIMEOUT = 30000;
export const CARD_LERP_SPEED = 0.3;
export const GIVEOUT_DELAY = 50;
export const CARD_WIDTH = 60;
export const CARD_HEIGHT = 90;
export const TURNS = [SIDE.BOTTOM, SIDE.RIGHT, SIDE.TOP, SIDE.LEFT];
