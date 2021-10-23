// Learn from Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Part 1: https://youtu.be/aKYlikFAV4k
// Part 2: https://youtu.be/EaZxUCWAjb0
// Part 3: https://youtu.be/jwRT4PCT6RU

// How many columns and rows?
var cols = 100;
var rows = 100;

// This will be the 2D array
var grid = new Array(cols);

// Open and closed set
var openSet = [];
var closedSet = [];

// Start and end
var start;
var end;

// Width and height of each cell of grid
var w, h;

// The road taken
var path = [];

var howMuchPoint = 0.3;
var img;
var cal = false;

var brushSize = 30;

// ============ helpers ============

function makeRandomWall(p = 0.1) {
  for (let row of grid) {
    for (let cell of row) {
      if (openSet.includes(cell) || closedSet.includes(cell)) continue;
      if (random() < p) {
        cell.wall = true;
        img.fill(0);
        img.rect(cell.i * w, cell.j * h, w, h);
      }
    }
  }
}

// Function to delete element from the array
function removeFromArray(arr, elt) {
  // Could use indexOf here instead to be more efficient
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

// An educated guess of how far it is between two points
function heuristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  // var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

document.addEventListener(
  "contextmenu",
  function (evt) {
    evt.preventDefault();
  },
  false
);

// ============ p5 js ============

function setup() {
  createCanvas(600, 600);
  console.log("A*");
  pixelDensity(1);

  // Grid cell size
  w = width / cols;
  h = height / rows;

  // Making a 2D array
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  // All the neighbors
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  // Start and end
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  // openSet starts with beginning only
  openSet.push(start);

  img = createGraphics(width, height);
  img.background(200);
  img.noStroke();

  // for (var x = 0; x < cols; x++) {
  // 	for (var y = 0; y < rows; y++) {
  // 		if (grid[x][y].wall) {
  // 			img.fill(0);
  // 			img.rect(x * w, y * h, w, h);
  // 			// img.ellipse(x * w + w / 2, y * h + h / 2, w / 2, h / 2);
  // 		}
  // 	}
  // }
  makeRandomWall(0.3);
}

function reset() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].wall = false;
    }
  }

  img.background(200);

  openSet = [grid[0][0]];
  closedSet = [];

  cal = false;
}

function draw() {
  image(img, 0, 0, width, height);

  stroke("red");
  strokeWeight(3);
  fill(0, 0, 0, 100);
  circle(mouseX, mouseY, brushSize);

  // Am I still searching?
  if (cal) {
    A_star();
  }
}

function A_star() {
  if (openSet.length > 0) {
    // Best next option
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var current = openSet[winner];

    // Did I finish?
    if (current === end) {
      noLoop();
      alert("DONE!");
    }

    // Best option moves from openSet to closedSet
    removeFromArray(openSet, current);
    closedSet.push(current);

    img.noStroke();
    img.fill(255, 0, 0, 50);
    img.rect(current.i * w, current.j * h, w, h);

    // Check all the neighbors
    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      // Valid next spot?
      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + heuristic(neighbor, current);

        // Is this a better path than before?
        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        // Yes, it's a better path
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }
    // Uh oh, no solution
  } else {
    alert("no solution");
	cal = false;
    return;
  }

  // for (var i = 0; i < openSet.length; i++) {
  // 	openSet[i].show(color(0, 255, 0, 50));
  // }

  // Find the path by working backwards
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  // Drawing path as continuous line
  noFill();
  stroke(255, 255, 20);
  strokeWeight(w / 2);
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
  }
  endShape();
}

function mouseDragged() {
  var _i = floor(mouseX / w);
  var _j = floor(mouseY / h);
  var r = max(0, floor(brushSize / 2 / w));

  for (let dx = -r; dx < r; dx++)
    for (let dy = -r; dy < r; dy++) {
      let i = _i + dx;
      let j = _j + dy;
      if (
        i >= 0 &&
        i < cols &&
        j >= 0 &&
        j < rows &&
        !openSet.includes(grid[i][j]) &&
        !closedSet.includes(grid[i][j])
      ) {
        if (mouseButton == "left") {
          grid[i][j].wall = true;
          img.fill(0);
        } else {
          grid[i][j].wall = false;
          img.fill(200);
        }
        img.rect(i * w, j * h, w, h);
      }
    }
}

function mousePressed() {
  mouseDragged();
}

function keyPressed() {
  if (keyCode == 32) {
    cal = true;
  }
  if (keyCode == 67) {
    reset();
  }
  if (keyCode == 66) {
    makeRandomWall(0.1);
  }
}

function mouseWheel(event) {
  if (event.deltaY < 0) {
    brushSize += 3;
  } else if (brushSize > 3) {
    brushSize -= 3;
  }
}
// =============================================================

// An object to describe a spot in the grid
function Spot(i, j) {
  // Location
  this.i = i;
  this.j = j;

  // f, g, and h values for A*
  this.f = 0;
  this.g = 0;
  this.h = 0;

  // Neighbors
  this.neighbors = [];

  // Where did I come from?
  this.previous = undefined;

  // Am I a wall?
  this.wall = false;
  // if (random(1) < howMuchPoint) {
  // 	this.wall = true;
  // }

  // Display me
  this.show = function (col) {
    if (this.wall) {
      fill(0);
      noStroke();
      ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
      // rect(this.i * w, this.j * h, w, h);
    } else if (col) {
      noStroke();
      fill(col);
      rect(this.i * w, this.j * h, w, h);
    }
  };

  // Figure out who my neighbors are
  this.addNeighbors = function (grid) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }

    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  };
}
