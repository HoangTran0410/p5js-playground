import World from "./world.js";

let world;
let selected = null;
let hovered = null;
let joinSpring = [];

let slEle;

const OPTIONS = {
    CustomChain: "Custom Chain",
    CustomGrid: "Custom Grid",
    "---------": "---------",
    Clothlock44: "Cloth lock 4x4",
    Grid33: "Grid 3x3",
    Gridlock44: "Grid lock 4x4",
    Gridstrong33: "Grid strong 3x3",
    Gridstronglock44: "Grid strong lock 4x4",
    Chain5: "Chain 5",
    Chainlock10: "Chain lock 10",
    Bowl: "Bowl",
    WTF: "WTF",
};

window.setup = () => {
    createCanvas(800, 600);

    slEle = createSelect();
    for (let op in OPTIONS) {
        slEle.option(OPTIONS[op]);
    }
    createButton("Add").mousePressed(addShape);

    createSpan(" | ");

    createButton("Reset").mousePressed(reset);
    createSpan("</br><b>Hover</b> to any particle then:</br>");
    createSpan("+ <b>Drag mouse</b>: Move particle </br>");
    createSpan("+ <b>Space</b>: Lock/Unlock particle</br>");
    createSpan("+ <b>C</b>: Cut spring</br>");
    createSpan("+ <b>A</b>: Join spring</br>");
    createSpan("+ <b>D</b>: Delete particle");

    reset();
};

window.draw = () => {
    background(50);

    world.update();
    world.show();

    // drag by mouse
    if (!selected) hovered = world.getParticleAt(mouseX, mouseY);

    if (hovered) {
        noFill();
        stroke(255);
        circle(hovered.position.x, hovered.position.y, hovered.radius * 2);

        if (mouseIsPressed) {
            selected = hovered;
            selected.pullTo(mouseX, mouseY);
        }
    }

    if (joinSpring[0]) {
        stroke(255);
        strokeWeight(3);
        line(
            mouseX,
            mouseY,
            joinSpring[0].position.x,
            joinSpring[0].position.y
        );
    }

    // fps
    fill(255);
    noStroke();
    text(~~frameRate(), 10, 10);
};

window.mouseReleased = () => {
    selected = null;
};

window.keyPressed = () => {
    if (hovered) {
        // Space - toggle locked
        if (keyCode == 32) {
            world.toggleLock(hovered);
        }

        // C - cut spring
        else if (keyCode == 67) {
            world.cutSpring(hovered);
        }

        // D - delete particle
        else if (keyCode == 68) {
            world.deleteParticle(hovered);
        }

        // A - join spring
        else if (keyCode == 65) {
            if (joinSpring.length == 0) {
                joinSpring[0] = hovered;
            } else if (joinSpring.length == 1) {
                joinSpring[1] = hovered;
                world.joinSpring(joinSpring[0], joinSpring[1]);
                joinSpring.length = 0;
            }
        }
    } else {
        // A - end join spring
        if (keyCode == 65) {
            joinSpring.length = 0;
        }
    }
};

function reset() {
    world = new World({
        gravity: createVector(0, 0.05),
        friction: 0.01,
    });

    world.makeGrid({
        position: createVector(width / 2, height / 2),
        row: 3,
        col: 3,
        strong: true,
        springConfig: {
            spacing: 40,
        },
    });
}

function addShape() {
    switch (slEle.value()) {
        case OPTIONS.CustomChain:
            let len = Number(window.prompt("Length:", 5)) || 5;
            let spacing = Number(window.prompt("Spacing:", 30)) || 30;
            world.makeChain({
                position: createVector(50, 0),
                len: len,
                springConfig: {
                    spacing: spacing,
                },
            });
            break;
        case OPTIONS.CustomGrid:
            let row = Number(window.prompt("Row:", 3)) || 3;
            let col = Number(window.prompt("Collumn:", 3)) || 3;
            let spa = Number(window.prompt("Spacing:", 40)) || 40;
            world.makeGrid({
                position: createVector(250, 300),
                row: row,
                col: col,
                springConfig: {
                    spacing: spa,
                },
            });
            break;
        case OPTIONS.Chain5:
            world.makeChain({
                position: createVector(50, 0),
                len: 5,
                springConfig: {
                    spacing: 30,
                },
            });
            break;
        case OPTIONS.Chainlock10:
            world.makeChain({
                position: createVector(100, 50),
                len: 10,
                springConfig: {
                    spacing: 30,
                    maxl: 100,
                },
                lock: {
                    indexes: [0],
                },
            });
            break;
        case OPTIONS.Clothlock44:
            world.makeGrid({
                position: createVector(430, 200),
                row: 4,
                col: 4,
                strong: false,
                springConfig: {
                    spacing: 40,
                    twoWay: false,
                },
                lock: {
                    rows: [0],
                },
            });
            break;
        case OPTIONS.Grid33:
            world.makeGrid({
                position: createVector(250, 300),
                row: 3,
                col: 3,
                strong: false,
                springConfig: {
                    spacing: 40,
                },
            });
            break;
        case OPTIONS.Gridlock44:
            world.makeGrid({
                position: createVector(250, 50),
                row: 4,
                col: 4,
                strong: false,
                springConfig: {
                    spacing: 40,
                    maxl: 100,
                },
                lock: {
                    rows: [0],
                },
            });
            break;
        case OPTIONS.Gridstrong33:
            world.makeGrid({
                position: createVector(600, 300),
                row: 3,
                col: 3,
                strong: true,
                springConfig: {
                    spacing: 40,
                },
            });
            break;
        case OPTIONS.Gridstronglock44:
            world.makeGrid({
                position: createVector(600, 50),
                row: 4,
                col: 4,
                strong: true,
                springConfig: {
                    spacing: 40,
                    maxl: 100,
                },
                lock: {
                    rows: [0],
                },
            });
            break;
        case OPTIONS.Bowl:
            world.makeGrid({
                position: createVector(10, 200),
                row: 5,
                col: 10,
                strong: false,
                springConfig: {
                    spacing: 20,
                    maxl: 150,
                },
                lock: {
                    rows: [4],
                    cols: [0, 9],
                },
            });
            break;
        case OPTIONS.WTF:
            break;
    }
}
