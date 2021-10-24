import Maze from "./maze.js";

let maze;

function resetMaze() {
  maze = new Maze({ row_count: 20, col_count: 20, cell_size: 20 });
  maze.generateMaze();
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
