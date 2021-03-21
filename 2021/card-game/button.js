import { collidePointRect } from './helper.js';

export default class Button {
    constructor(t, x, y, w, h) {
        this.t = t;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    show() {
        fill('#9999');
        stroke(0);
        rect(this.x, this.y, this.w, this.h);

        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.t, this.x, this.y);
    }

    isMouseHover() {
        return collidePointRect(mouseX, mouseY, this.x, this.y, this.w, this.h);
    }

    isMousePressed() {
        return mouseIsDown && this.isMouseHover();
    }

    onMousePressed() {}
}
