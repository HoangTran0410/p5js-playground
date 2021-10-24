export default class Cell {
  constructor({ row = 0, col = 0, size = 30 }) {
    this.row = row;
    this.col = col;
    this.size = size;

    this.visited = false;
    this.isHightlight = false;
    this.isDone = false;

    this.walls = {
      top: true,
      left: true,
      bottom: true,
      right: true,
    };
  }

  draw() {
    let x = this.col * this.size;
    let y = this.row * this.size;

    let topLeft = { x: x, y: y };
    let topRight = { x: x + this.size, y: y };
    let botLeft = { x: x, y: y + this.size };
    let botRight = { x: x + this.size, y: y + this.size };

    stroke(255);
    strokeWeight(1);
    if (this.walls.top) line(topLeft.x, topLeft.y, topRight.x, topRight.y);
    if (this.walls.bottom) line(botLeft.x, botLeft.y, botRight.x, botRight.y);
    if (this.walls.left) line(topLeft.x, topLeft.y, botLeft.x, botLeft.y);
    if (this.walls.right) line(topRight.x, topRight.y, botRight.x, botRight.y);

    if (this.visited || this.isHightlight || this.isDone) {
      fill(this.isDone ? 50 : this.isHightlight ? "red" : "purple");
      stroke(0, 0, 0, 0);
      rect(x, y, this.size, this.size);
    } else {
      noFill();
    }
  }
}
