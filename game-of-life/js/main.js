// constant
const DEAD = 0,
    ALIVE = 1,
    MODE = {
        MOVE: 0,
        ADD: 1,
        REMOVE: 2,
    };

// config
const CANVAS_SIZE = 500, // 500x500
    GRID_SIZE = 100,
    CELL_SIZE = 10,
    GEN_SPEED = 50; // generations per seconds

//  init global variables
let world,
    loop = true,
    paused = false,
    mode = MODE.ADD,
    lastGenerateTime = 0,
    pMouseIsPressed = false;

// ---------------------------- p5JS ----------------------------
function setup() {
    createCanvas(CANVAS_SIZE, CANVAS_SIZE).parent('#game-container');
    textAlign(CENTER, CENTER);
    textSize(17);
    textFont('monospace');

    document.addEventListener('contextmenu', (event) => event.preventDefault());

    addPatternsToSelectElement();
    randomGrid();
}

function draw() {
    background(30);

    if (mode == MODE.ADD && mouseIsPressed) {
        let { row, col } = getCellAt(mouseX, mouseY);

        if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
            world[row][col] = mouseButton == LEFT ? ALIVE : DEAD;
        }
    }

    if (!(paused || mouseIsPressed)) {
        if (millis() - lastGenerateTime > 1000 / GEN_SPEED) {
            calculateNextGen();
            lastGenerateTime = millis();
        }
    }

    drawGame();

    if (paused) {
        fill('yellow');
        noStroke();
        text('PAUSED', width / 2, height - 30);
    }

    pMouseIsPressed = mouseIsPressed;
}

function keyPressed() {
    if (key == ' ') {
        togglePlay();
    } else if (key == 'r') {
        resetGrid();
    }
}

// ---------------------------- GAME OF LIFE ----------------------------
function resetGrid() {
    world = [];

    for (let row = 0; row < GRID_SIZE; row++) {
        world[row] = [];

        for (let col = 0; col < GRID_SIZE; col++) {
            world[row][col] = DEAD;
        }
    }
}

function drawGame() {
    let cell_size = width / GRID_SIZE;

    // // grid
    // stroke(40);
    // for (let row = 0; row < GRID_SIZE; row++) {
    //     line(0, row * cell_size, width, row * cell_size);
    // }
    // for (let col = 0; col < GRID_SIZE; col++) {
    //     line(col * cell_size, 0, col * cell_size, height);
    // }

    // alive cells
    // fill(255);
    // noStroke();
    stroke(255);
    strokeWeight(cell_size);
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (world[row][col] == ALIVE) {
                // rect(col * cell_size, row * cell_size, cell_size, cell_size);
                point(col * cell_size, row * cell_size);
            }
        }
    }
}

function getCellAt(x, y) {
    return {
        row: floor((y / height) * GRID_SIZE),
        col: floor((x / width) * GRID_SIZE),
    };
}

function calculateNextGen() {
    let next_gen = [];

    for (let row = 0; row < GRID_SIZE; row++) {
        next_gen[row] = [];
        for (let col = 0; col < GRID_SIZE; col++) {
            next_gen[row][col] = applyConwayRule(row, col);
        }
    }

    world = next_gen;
}

function applyConwayRule(row, col) {
    let live_count = neighborLiveCount(row, col);

    if (world[row][col] == ALIVE) {
        // Ô sống nào có đúng 2 hoặc 3 ô sống lân cận thì sẽ tiếp tục sống đến thế hệ tiếp theo.
        // Ngược lại thì sẽ thành ô chết.
        if (live_count == 2 || live_count == 3) {
            return ALIVE;
        }

        return DEAD;
    } else {
        // Ô chết nào có đúng 3 ô sống lân cận thì sẽ trở thành ô sống ở thế hệ tiếp theo.
        if (live_count == 3) {
            return ALIVE;
        }

        return DEAD;
    }
}

function applyJohnConwayRule(row, col) {
    let live_count = neighborLiveCount(row, col);

    if (world[row][col] == ALIVE) {
        // Ô sống nào có đúng 2 hoặc 3 ô sống lân cận thì sẽ tiếp tục sống đến thế hệ tiếp theo.
        // Ngược lại thì sẽ thành ô chết.
        if (live_count == 2 || live_count == 3) {
            return ALIVE;
        }

        return DEAD;
    } else {
        // Ô chết nào có đúng 3 HOẶC 6 ô sống lân cận thì sẽ trở thành ô sống ở thế hệ tiếp theo.
        if (live_count == 3 || live_count == 6) {
            return ALIVE;
        }

        return DEAD;
    }
}

function neighborLiveCount(row, col) {
    let live_count = 0;

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx || dy) {
                let nrow = row + dy;
                let ncol = col + dx;

                if (loop) {
                    if (nrow < 0) nrow = GRID_SIZE - 1;
                    if (nrow > GRID_SIZE - 1) nrow = 0;
                    if (ncol < 0) ncol = GRID_SIZE - 1;
                    if (ncol > GRID_SIZE - 1) ncol = 0;
                }

                if (world[nrow] && world[nrow][ncol] == ALIVE) {
                    live_count++;
                }
            }
        }
    }

    return live_count;
}

// ---------------------------- UI HELPER ----------------------------
function button(t, x, y, w, h) {
    let hover = pointInRect(mouseX, mouseY, x, y, w, h);

    fill(hover ? '#555' : '#4448');
    noStroke();
    rect(x, y, w, h);

    fill(hover ? '#fff' : '#bbb');
    text(t, x + w / 2, y + h / 2);

    if (hover && mouseIsPressed && !pMouseIsPressed) {
        return true;
    }

    return false;
}

function pointInRect(px, py, rx, ry, rw, rh) {
    return !(px < rx || px > rx + rw || py < ry || py > ry + rh);
}

// ---------------------------- HTML UI ----------------------------
function setPattern(pattern) {
    resetGrid();
    fillPatternToWorld(world, pattern);
}

function restartPattern() {
    setPattern(document.querySelector('#pattern').value);
}

function randomGrid(percent = 0.2) {
    world = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        world[row] = [];

        for (let col = 0; col < GRID_SIZE; col++) {
            world[row][col] = random() < percent ? ALIVE : DEAD;
        }
    }
}

function setPaused(value) {
    paused = value;
    document.querySelector('#btnPlayPause').innerHTML = paused
        ? '<i class="fas fa-play"></i>'
        : '<i class="fas fa-pause"></i>';
}

function togglePlay() {
    setPaused(!paused);
}

function step() {
    setPaused(true);
    calculateNextGen();
}

function setLoop(value) {
    loop = value;
}

function clearGrid() {
    resetGrid();
}

function toggleToolMenu() {
    let menu = document.querySelector('div#tools-menu');

    if (menu.style.display === 'none') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
}
