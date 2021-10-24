import Cell from "./cell.js";
import { sleep } from "./utils.js";
import { readPathStr } from "./path.js";

export default class Maze {
  constructor({
    row_count = 5,
    col_count = 5,
    cell_size = 30,
    startCell = { row: 0, col: 0 },
    finishCell = { row: row_count - 1, col: col_count - 1 },
  }) {
    this.row_count = row_count;
    this.col_count = col_count;
    this.cell_size = cell_size;

    this.grid = this.createGrid(row_count, col_count, cell_size);

    this.startCell = this.grid[this.index(startCell.row, startCell.col)];
    this.finishCell = this.grid[this.index(finishCell.row, finishCell.col)];
  }

  index(row, col) {
    if (col < 0 || col >= this.col_count || row < 0 || row >= this.row_count)
      return -1;
    return col + row * this.col_count;
  }

  createGrid(row_count, col_count, cell_size) {
    let grid = [];
    for (let row = 0; row < row_count; row++) {
      for (let col = 0; col < col_count; col++) {
        grid.push(new Cell({ row: row, col: col, size: cell_size }));
      }
    }
    return grid;
  }

  async generateMaze_DFS(sleepTime = 0) {
    let currentCell = this.startCell;
    let stack = [currentCell];

    while (stack.length > 0) {
      currentCell.visited = true;
      currentCell.isHightlight = false;

      var next = this.getRandomNeighbor(currentCell);

      if (next) {
        next.visited = true;
        stack.push(currentCell);
        this.removeWalls(currentCell, next);
        currentCell = next;
      } else if (stack.length > 0) {
        currentCell.isDone = true;
        currentCell = stack.pop();
      }

      currentCell.isHightlight = true;

      if (sleepTime) await sleep(sleepTime);
    }
  }

  async makePath(path) {}

  removeWalls(cellA, cellB) {
    var dx = cellA.col - cellB.col;
    if (dx == 1) {
      cellA.walls.left = false;
      cellB.walls.right = false;
    } else if (dx == -1) {
      cellA.walls.right = false;
      cellB.walls.left = false;
    }

    var dy = cellA.row - cellB.row;
    if (dy == 1) {
      cellA.walls.top = false;
      cellB.walls.bottom = false;
    } else if (dy == -1) {
      cellA.walls.bottom = false;
      cellB.walls.top = false;
    }
  }

  getRandomNeighbor(cell) {
    let neighbors = [];

    let x = cell.col;
    let y = cell.row;

    let top = this.grid[this.index(y - 1, x)];
    let right = this.grid[this.index(y, x + 1)];
    let bottom = this.grid[this.index(y + 1, x)];
    let left = this.grid[this.index(y, x - 1)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      var randomIndex = floor(random(0, neighbors.length));
      return neighbors[randomIndex];
    } else {
      return null;
    }
  }

  draw() {
    for (let cell of this.grid) {
      cell.draw();
    }

    this.startCell.draw("yellow");
    this.finishCell.draw("yellow");
  }
}
