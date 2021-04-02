import Game from './game/game.js';

let game;
let fps = 0;

window.setup = async () => {
    createCanvas(min(windowWidth, 800), min(windowHeight, 600));
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textFont('Consolas');
    textStyle('bold');
    imageMode(CENTER);

    setInterval(() => {
        fps = ~~frameRate();
    }, 1000);

    game = new Game();
    game.newGame();
};

window.draw = () => {
    background(50);

    game.update();
    game.show();

    showFPS();
};

function showFPS() {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    text(fps, 15, 15);
}
