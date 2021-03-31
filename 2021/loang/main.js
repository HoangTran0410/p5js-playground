let CELLSIZE = 10;
let SLEEP = 20;
let neigbors = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
  // [0, -1],
  // [1, 0],
  // [0, 1],
  // [-1, 0],
];
// [[2,4],[-4,-3],[0,-2],[-2,2],[-4,-1],[-2,-3],[0,4]]

let neigborsElem;
let grid;

function setup() {
  createCanvas(500, 500);
  initGrid();

  neigborsElem = document.getElementById("neigbor");
  neigborsElem.value = JSON.stringify(neigbors);
}

function draw() {
  background(50);
  drawGrid();
}

function mouseDragged() {
  let { row, col } = getCellAt(mouseX, mouseY);
  grid[row][col] = true;
}

function mousePressed() {
  mouseDragged();
}

function keyPressed() {
  if (key == "f") {
    fillCellAt(mouseX, mouseY);
  } else if (key == "c") {
    clearGrid();
  }
}

function getCellAt(x, y) {
  let row = ~~constrain((y / height) * ROW, 0, ROW - 1);
  let col = ~~constrain((x / width) * COL, 0, COL - 1);

  return {
    row,
    col,
  };
}

function makeNeigborPattern() {
  neigbors = [];

  for (let i = 0; i < random(4, 8); i++) {
    neigbors[i] = [~~random(-5, 5), ~~random(-5, 5)];
  }

  neigborsElem.value = JSON.stringify(neigbors);
}

function setNeigborsPattern(str) {
  neigbors = JSON.parse(str);
}

function initGrid() {
  ROW = ~~(height / CELLSIZE);
  COL = ~~(width / CELLSIZE);

  grid = [];
  for (let row = 0; row < ROW; row++) {
    grid[row] = [];
    for (let col = 0; col < COL; col++) {
      grid[row][col] = false;
    }
  }
}

function drawGrid() {
  noStroke();
  fill(200);
  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (grid[row][col] == true) {
        rect(col * CELLSIZE, row * CELLSIZE, CELLSIZE, CELLSIZE);
      }
    }
  }
}

function fillCellAt(x = random(width), y = random(height)) {
  let { row, col } = getCellAt(x, y);
  fillCell(row, col, !grid[row][col]);
}

async function fillCell(row, col, value = true) {
  grid[row][col] = value;

  await sleep(SLEEP);

  for (let n of neigbors) {
    let c = constrain(n[1] + col, 0, COL - 1);
    let r = constrain(n[0] + row, 0, ROW - 1);

    if (grid[r][c] != value) {
      fillCell(r, c, value);
    }
  }
}

function clearGrid() {
  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      grid[row][col] = false;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
