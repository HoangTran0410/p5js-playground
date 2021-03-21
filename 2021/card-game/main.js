import { POSITION } from './constant.js';
import Game from './game.js';

let game;

window.setup = () => {
    createCanvas(min(windowWidth, 800), min(windowHeight, 600));

    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textFont('Consolas');
    textStyle('bold');

    game = new Game();
    game.addPlayer('Hoang', POSITION.BOTTOM);
    game.addPlayer('Hien', POSITION.TOP);
    // game.addPlayer('Nam', POSITION.RIGHT);
    // game.addPlayer('Linh', POSITION.LEFT);
    game.newGame();

    console.log(game);
};

window.draw = () => {
    background(50);

    game.update();
    game.show();

    showFPS();
};

window.mouseClicked = () => {
    game.onMouseClicked();
};

function showFPS() {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    text(~~frameRate(), 15, 15);
}
