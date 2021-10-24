import Maze from "./maze.js";
import { PATH_STR, readPathStr } from "./path.js";

let maze;

function resetMaze() {
  maze = new Maze({
    row_count: 20,
    col_count: 20,
    cell_size: 20,
    // startCell: { row: ~~random(0, 5), col: ~~random(0, 5) },
    // finishCell: { row: ~~random(15, 20), col: ~~random(15, 20) },
  });
  // maze.makePath(readPathStr(PATH_STR.C));
  // maze.makePathFromText("ab", 1);
  maze.generateMaze_DFS({
    sleepTime: 50,
  });
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
