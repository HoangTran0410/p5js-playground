import { collidePointRect } from './helper.js';

export default class Button {
    #activeFunc = () => true;
    #visibleFunc = () => true;
    #onMousePressedFunc = () => {};

    constructor(t, x, y, w = 50, h = 50) {
        this.t = t;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.colour = '#007bff';
    }

    setColour(c) {
        this.colour = c;
        return this;
    }

    activeIf(func) {
        this.#activeFunc = func;
        return this;
    }

    visibleIf(func) {
        this.#visibleFunc = func;
        return this;
    }

    onMousePressed(func) {
        this.#onMousePressedFunc = func;
        return this;
    }

    show() {
        if (!this.#visibleFunc()) return;

        let active = this.#activeFunc();

        if (!active) {
            fill('#555');
            stroke('#555');
        } else if (this.isMouseHover()) {
            fill(this.colour);
            stroke(200);
        } else {
            fill(this.colour + 'ee');
            stroke(0);
        }
        strokeWeight(2);
        rect(this.x, this.y, this.w, this.h);

        fill(active ? 255 : 150);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.t, this.x, this.y);
    }

    isMouseHover() {
        return collidePointRect(mouseX, mouseY, this.x, this.y, this.w, this.h);
    }

    handleMousePressed() {
        if (this.isMouseHover()) {
            this.#onMousePressedFunc();
        }
    }
}
