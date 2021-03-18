var cols, rows, w;
var stack = [];
var cells = [];
var currentCell;

var player;
var coins = [];
var img;
var imgPlayer;
var imgChest;
var imgCoin;

var winSize;
var startPoint, endPoint;


function setup() {
	winSize = windowHeight - 10
	createCanvas(winSize, winSize);
	strokeWeight(3);
	frameRate(30);
	imageMode(CENTER);
	pixelDensity(1);
	imgPlayer = loadImage("image/Pac-Man-PNG-Clipart.png");
	imgChest = loadImage("image/treasure.png");
	imgCoin = loadImage("image/coin.png");

	cols = 5;
	rows = 5;
	reset(cols, rows, floor(cols * 1.5));
}

function draw() {
	if (player.pos.x == endPoint % cols && player.pos.y == floor(endPoint / cols) &&
		coins.length == 0) {
		cols += 2;
		rows += 2;
		reset(cols, rows, floor(cols * 1.5));
	}

	image(img, winSize / 2, winSize / 2, winSize, winSize);
	if (imgChest) {

		image(imgChest, (endPoint % cols) * w + w / 2, floor(endPoint / cols) * w + w / 2, w, w)
	} else {
		noStroke();
		fill(random(255), random(255), random(255));
		rect((cols - 1) * w + w / 8, (rows - 1) * w + w / 8, w * 3 / 4, w * 3 / 4);
	}
	player.show();
	if(!player.auto)
		player.move();

	checkCoin(player.pos.x, player.pos.y);

	for (var i = 0; i < coins.length; i++) {
		coins[i].show();
	}

	var m = atMouse();
	if (m.x < cols && m.y < rows && m.x >= 0 && m.y >= 0) {
		noStroke();
		fill(242, 239, 58, 35);
		rect(m.x * w, m.y * w, w, w);
	}
}

function keyPressed() {
	if (keyCode == LEFT_ARROW) {
		player.direc = dir.left;

	} else if (keyCode == RIGHT_ARROW) {
		player.direc = dir.right;

	} else if (keyCode == UP_ARROW) {
		player.direc = dir.up;

	} else if (keyCode == DOWN_ARROW) {
		player.direc = dir.down;

	} else if (keyCode == 13) {
		reset(cols, rows, floor(cols * 1.5));

	} else if (keyCode == 27) {
		var a = prompt("Level: ");
		cols = Number(a) || cols;
		rows = Number(a) || rows;
		reset(cols, rows, floor(cols * 1.5));

	} else if (keyCode == 123 || keyCode == 73) {
		imgPlayer = null;
		return false;

	} else if (keyCode == 65) {
		player.auto = !player.auto;
	}
}

function mousePressed() {
	var m = atMouse();

	if (!paths.includes(cells[m.x + m.y * cols])) {
		if (m.x < cols && m.y < rows && m.x >= 0 && m.y >= 0) {
			reset_Astart(cells[player.pos.x + player.pos.y * cols]);
			A_star(cells[m.x + m.y * cols]);
		}
	} else {
		var found = paths.findIndex(function(ele) {
			return ele == cells[m.x + m.y * cols];
		});

		paths.splice(0, found);
		drawPaths();
	}
}

function mouseDragged() {
	mousePressed();
}

function atMouse() {
	return {
		x: floor(mouseX / w),
		y: floor(mouseY / w)
	};
}

function calculateMaze() {
	while (stack.length > 0) {
		currentCell.visited = true;

		var next = currentCell.checkNeighbors();

		if (next) {
			next.visited = true;
			stack.push(currentCell);
			removeWalls(currentCell, next);
			currentCell = next;
		} else if (stack.length > 0) {
			currentCell = stack.pop();
		}
	}

	for (var i = 0; i < cells.length; i++) {
		cells[i].show();
	}
}

function reset(collum, row, numCoin) {
	img = createGraphics(winSize, winSize);
	img.pixelDensity(1);

	cols = collum;
	rows = row;
	w = width / cols;
	startPoint = floor(random(cols * rows));
	endPoint = floor(random(rows * rows));

	cells = [];
	stack = [];
	coins = [];
	for (var y = 0; y < rows; y++) {
		for (var x = 0; x < cols; x++) {
			cells.push(new Cell(x, y));
		}
	}

	currentCell = cells[startPoint];
	stack.push(currentCell);

	player = new Player(startPoint % cols, floor(startPoint / cols));
	for (var i = 0; i < numCoin; i++) {
		coins.push(new Coin(floor(random(cols)), floor(random(rows))));
	}
	clear();

	calculateMaze();

	for (var i = 0; i < cells.length; i++)
		cells[i].addNeighbors();

	reset_Astart(cells[startPoint]);

	if (!imgPlayer)
		imgPlayer = loadImage("image/Pac-Man-PNG-Clipart.png");
}

function index(x, y) {
	if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1)
		return -1;
	return x + y * cols;
}

function Cell(x, y) {
	this.x = x;
	this.y = y;
	this.walls = {
		top: true,
		right: true,
		bottom: true,
		left: true
	}; // top right bottom left
	this.visited = false;

	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.previous = undefined;

	this.checkNeighbors = function() {
		var neighbors = [];

		var top = cells[index(x, y - 1)];
		var right = cells[index(x + 1, y)];
		var bottom = cells[index(x, y + 1)];
		var left = cells[index(x - 1, y)];

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
			var r = floor(random(0, neighbors.length))
			return neighbors[r];
		} else {
			return null;
		}
	}

	this.addNeighbors = function() {
		this.neighbors = [];

		var top = cells[index(x, y - 1)];
		var right = cells[index(x + 1, y)];
		var bottom = cells[index(x, y + 1)];
		var left = cells[index(x - 1, y)];

		if (top && !this.walls.top) {
			this.neighbors.push(top);
		}
		if (right && !this.walls.right) {
			this.neighbors.push(right);
		}
		if (bottom && !this.walls.bottom) {
			this.neighbors.push(bottom);
		}
		if (left && !this.walls.left) {
			this.neighbors.push(left);
		}
	}

	this.show = function() {
		var posx = this.x * w;
		var posy = this.y * w;

		img.stroke(0);
		img.strokeWeight(3);
		if (this.walls.top) {
			img.line(posx, posy, posx + w, posy)
		}
		if (this.walls.right) {
			img.line(posx + w, posy, posx + w, posy + w)
		}
		if (this.walls.bottom) {
			img.line(posx + w, posy + w, posx, posy + w)
		}
		if (this.walls.left) {
			img.line(posx, posy + w, posx, posy);
		}
	}
}

function removeWalls(a, b) {
	var x = a.x - b.x;
	if (x == 1) {
		a.walls.left = false;
		b.walls.right = false;
	} else if (x == -1) {
		a.walls.right = false;
		b.walls.left = false;
	}

	var y = a.y - b.y;
	if (y == 1) {
		a.walls.top = false;
		b.walls.bottom = false;
	} else if (y == -1) {
		a.walls.bottom = false;
		b.walls.top = false;
	}
}

function drawMap() {
	img.background(100, 100, 150);
	for (var i = 0; i < cells.length; i++) {
		cells[i].previous = undefined;
		cells[i].show();
	}
}


// ==============================================

var dir = {
	up: 1,
	down: 2,
	left: 3,
	right: 4,
	none: 0
};

function Player(x, y) {
	this.pos = createVector(x, y);
	this.direc = dir.none;
	this.score = 0;
	this.ro = 0;
	this.auto = false;

	this.show = function() {
		if (imgPlayer) {
			push();
			translate(this.pos.x * w + w / 2, this.pos.y * w + w / 2);
			if (this.direc == dir.up) this.ro = -90;
			else if (this.direc == dir.down) this.ro = 90;
			else if (this.direc == dir.left) this.ro = 180;
			else if (this.direc == dir.right) this.ro = 0;

			rotate(radians(this.ro));
			image(imgPlayer, 0, 0, w, w);
			pop();
		} else {
			noStroke();
			fill(242, 239, 58);
			ellipse(this.pos.x * w + w / 2, this.pos.y * w + w / 2, w, w);
			fill(0, 255, 150);
			ellipse(this.pos.x * w + w / 4 + w / 16, this.pos.y * w + w / 3, w / 4, w / 6);
			ellipse(this.pos.x * w + w * 3 / 4 - w / 16, this.pos.y * w + w / 3, w / 4, w / 6);
			fill(0);
			ellipse(this.pos.x * w + w / 2, this.pos.y * w + w * 3 / 4, w * 2 / 4, w / 6);
		}

		if (this.auto) {
			if (paths.length > 0) {
				var next = paths[paths.length - 1];

				if (this.pos.x < next.x) this.direc = dir.right;
				else if (this.pos.x > next.x) this.direc = dir.left;
				if (this.pos.y < next.y) this.direc = dir.down;
				else if (this.pos.y > next.y) this.direc = dir.up;

				// this.pos = createVector(next.x, next.y);
				paths.pop();
				this.move();
				drawMap();
				drawPaths();
			} else {
				this.direc = dir.none;
				this.auto = false;
			}
		}
	}

	this.move = function() {
		if (this.direc == dir.up &&
			!cells[this.pos.x + this.pos.y * cols].walls.top) {
			this.pos.y--;

		} else if (this.direc == dir.down &&
			!cells[this.pos.x + this.pos.y * cols].walls.bottom) {
			this.pos.y++;

		} else if (this.direc == dir.left &&
			!cells[this.pos.x + this.pos.y * cols].walls.left) {
			this.pos.x--;

		} else if (this.direc == dir.right &&
			!cells[this.pos.x + this.pos.y * cols].walls.right) {
			this.pos.x++;
		}
		if (countWalls(cells[this.pos.x + this.pos.y * cols]) <= 1)
			this.direc = dir.none;
	}
}

function Coin(x, y) {
	this.x = x;
	this.y = y;
	this.frames = (random(5));
	this.timeCount = 0;

	this.show = function() {
		if (imgCoin)
			image(imgCoin, this.x * w + w / 2, this.y * w + w / 2, w / 2 / this.frames, w / 2);
		else {
			fill(242, 239, 58);
			ellipse(this.x * w + w / 2, this.y * w + w / 2, w / 2 / this.frames, w / 2);
		}

		if (millis() - this.timeCount > 50) {
			this.timeCount = millis();
			this.frames = (this.frames + 0.1) % 5;
			if (this.frames < 1) this.frames = 1;
		}
	}
}

function checkCoin(x, y) {
	for (var i = 0; i < coins.length; i++) {
		if (x == coins[i].x && y == coins[i].y) {
			player.score++;
			coins.splice(i, 1);
			return;
		}
	}
}

function countWalls(cell) {
	var count = 0;
	if (cell.walls.top) count++;
	if (cell.walls.bottom) count++;
	if (cell.walls.left) count++;
	if (cell.walls.right) count++;
	return count;
}



// Open and closed set
var openSet = [];
var closedSet = [];
var paths = [];

function A_star(end) {
	while (openSet.length > 0) {
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
			openSet = [];

			addToPaths(current);
			drawPaths();

			break;
		}

		// Best option moves from openSet to closedSet
		removeFromArray(openSet, current);
		closedSet.push(current);

		// Check all the neighbors
		var neighbors = current.neighbors;
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];

			// Valid next spot?
			if (!closedSet.includes(neighbor)) {
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
	}
}

function reset_Astart(start) {
	openSet = [];
	closedSet = [];
	paths = [];
	openSet.push(start);

	drawMap();
}

function addToPaths(ele) {
	paths = [];
	paths.push(ele);
	while (ele.previous) {
		paths.push(ele.previous);
		ele = ele.previous;
	}
}

function drawPaths() {
	drawMap();
	img.noFill();
	img.stroke(150, 255, 20, 100);
	img.strokeWeight(w / 4);
	img.beginShape();
	for (var i = 0; i < paths.length; i++) {
		img.vertex(paths[i].x * w + w / 2, paths[i].y * w + w / 2);
	}
	img.endShape();
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

function heuristic(a, b) {
	var d = dist(a.i, a.j, b.i, b.j);
	// var d = abs(a.i - b.i) + abs(a.j - b.j);
	return d;
}

window.oncontextmenu = function() {
	player.auto = true;
	return false;
}
