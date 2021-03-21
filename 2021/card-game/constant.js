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
    TOP: 'top',
    LEFT: 'left',
    RIGHT: 'right',
    BOTTOM: 'bottom',
};
export const SORT_TYPE = {
    DEFAULT: 'default',
    BY_VALUE: 'by_value',
    BY_SUIT: 'by_suit',
};
export const CARD_LERP_SPEED = 0.5;
export const GIVEOUT_DELAY = 50;
export const COMBINATION_TYPE = {
    // https://vi.wikipedia.org/wiki/B%C3%A0i_Ti%E1%BA%BFn_l%C3%AAn
    SINGLE: 'single', // lá lẻ
    PAIR: 'pair', // đôi - 2 lá giống nhau
    THREE: 'three', // sảnh - 3 lá giống nhau
    FOUR: 'four', // tứ quý - 4 lá giống nhau
    STRAIGHT: 'straight', // sảnh - bài liên tiếp nhau
    CONSECUTIVE_PAIRS: 'consecutive pairs', // 3 đôi thông - 3 đôi liên tiếp
};
