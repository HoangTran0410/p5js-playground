import Maze from "./maze.js";

let maze;

function resetMaze() {
  maze = new Maze({
    row_count: 20,
    col_count: 20,
    cell_size: 20,
    startCell: { row: ~~random(0, 5), col: ~~random(0, 5) },
    finishCell: { row: ~~random(15, 20), col: ~~random(15, 20) },
  });
  maze.generateMaze_DFS(50);
}

window.setup = () => {
  createCanvas(400, 400);
  resetMaze();
};

window.draw = () => {
  background(50);
  maze.draw();
};

window.keyPressed = () => {
  if (keyCode == 13) {
    resetMaze();
  }
};
