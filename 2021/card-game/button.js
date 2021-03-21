import { collidePointRect } from './helper.js';

export default class Button {
    constructor(t, x, y, w = 50, h = 50) {
        this.t = t;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.active = true;
    }

    show() {
        if (!this.active) {
            fill('#555');
            stroke('#555');
        } else if (this.isMouseHover()) {
            fill('#007bff');
            stroke(200);
        } else {
            fill('#557bdd');
            stroke(0);
        }
        strokeWeight(2);
        rect(this.x, this.y, this.w, this.h);

        fill(this.active ? 255 : 150);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.t, this.x, this.y);
    }

    isMouseHover() {
        return collidePointRect(mouseX, mouseY, this.x, this.y, this.w, this.h);
    }

    handleMousePressed() {
        if (this.isMouseHover()) {
            this.onMousePressed();
        }
    }

    onMousePressed() {}
}
