var DAMPING = 0.8,
    GRAVITY = {x: 50, y:50},
    MOUSE_SIZE = 30,
    SPEED = 1;

var balls = [];

function setup() {
	createCanvas(windowWidth, windowHeight).position(0, 0);

	MOUSE_SIZE = width/12;

	for(var i = 0; i < 30; i++)
		add_ball(random(width), random(height), random(10, 15));
}

function draw() {
	update();

	if(mouseIsPressed){
		GRAVITY = {x: mouseX, y: mouseY};
	}

	fill(255);
	ellipse(GRAVITY.x, GRAVITY.y, 16, 16);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight, true);
}

window.oncontextmenu = function(e) {

    e.preventDefault();
    return false;
};


// =============    Ball    =================
var Ball = function(x, y, radius) {

	this.x = x;
	this.y = y;

	this.px = x;
	this.py = y;

	this.fx = 0;
	this.fy = 0;

	this.radius = radius;
};

Ball.prototype.apply_force = function(delta) {

	delta *= delta;
	
	// this.fx += GRAVITY.x;
	// this.fy += GRAVITY.y;

	var gx = map((GRAVITY.x-this.x), -width, width, -1, 1);
	var gy = map((GRAVITY.y-this.y), -height, height, -1, 1);

	this.fx += gx;
	this.fy += gy;

	this.x += this.fx * delta;
	this.y += this.fy * delta;

	this.fx = this.fy = 0;
};

Ball.prototype.verlet = function() {

	var nx = (this.x * 2) - this.px;
	var ny = (this.y * 2) - this.py;

	this.px = this.x;
	this.py = this.y;

	this.x = nx;
	this.y = ny;
};

Ball.prototype.draw = function() {

	fill(200, 200, 20);
	ellipse(this.x, this.y, this.radius*2, this.radius*2);
};

//==================================

var resolve_collisions = function(ip) {

	var i = balls.length;

	while (i--) {

		var ball_1 = balls[i];

		if (true) {

			var diff_x = ball_1.x - mouseX;
			var diff_y = ball_1.y - mouseY;
			var dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
			var real_dist = dist - (ball_1.radius + MOUSE_SIZE);

			if (real_dist < 0) {

				var depth_x = diff_x * (real_dist / dist);
				var depth_y = diff_y * (real_dist / dist);

				ball_1.x -= depth_x * 0.005;
				ball_1.y -= depth_y * 0.005;
			}
		}

		var n = balls.length;

		while (n--) {

			if (n == i) continue;

			var ball_2 = balls[n];

			var diff_x = ball_1.x - ball_2.x;
			var diff_y = ball_1.y - ball_2.y;

			var length = diff_x * diff_x + diff_y * diff_y;
			var dist = Math.sqrt(length);
			var real_dist = dist - (ball_1.radius + ball_2.radius);

			if (real_dist < 0) {

				var vel_x1 = ball_1.x - ball_1.px;
				var vel_y1 = ball_1.y - ball_1.py;
				var vel_x2 = ball_2.x - ball_2.px;
				var vel_y2 = ball_2.y - ball_2.py;

				var depth_x = diff_x * (real_dist / dist);
				var depth_y = diff_y * (real_dist / dist);

				ball_1.x -= depth_x * 0.5;
				ball_1.y -= depth_y * 0.5;

				ball_2.x += depth_x * 0.5;
				ball_2.y += depth_y * 0.5;

				if (ip) {

					var pr1 = DAMPING * (diff_x * vel_x1 + diff_y * vel_y1) / length,
						pr2 = DAMPING * (diff_x * vel_x2 + diff_y * vel_y2) / length;

					vel_x1 += pr2 * diff_x - pr1 * diff_x;
					vel_x2 += pr1 * diff_x - pr2 * diff_x;

					vel_y1 += pr2 * diff_y - pr1 * diff_y;
					vel_y2 += pr1 * diff_y - pr2 * diff_y;

					ball_1.px = ball_1.x - vel_x1;
					ball_1.py = ball_1.y - vel_y1;

					ball_2.px = ball_2.x - vel_x2;
					ball_2.py = ball_2.y - vel_y2;
				}
			}
		}
	}
};

var check_walls = function() {

	var i = balls.length;

	while (i--) {

		var ball = balls[i];

		if (ball.x < ball.radius) {

			var vel_x = ball.px - ball.x;
			ball.x = ball.radius;
			ball.px = ball.x - vel_x * DAMPING;

		} else if (ball.x + ball.radius > width) {

			var vel_x = ball.px - ball.x;
			ball.x = width - ball.radius;
			ball.px = ball.x - vel_x * DAMPING;
		}

		if (ball.y < ball.radius) {

			var vel_y = ball.py - ball.y;
			ball.y = ball.radius;
			ball.py = ball.y - vel_y * DAMPING;

		} else if (ball.y + ball.radius > height) {

			var vel_y = ball.py - ball.y;
			ball.y = height - ball.radius;
			ball.py = ball.y - vel_y * DAMPING;
		}
	}
};

var update = function() {

	//var time = new Date().getTime();

	var iter = 6;

	var delta = SPEED / iter;

	while (iter--) {

		var i = balls.length;

		while (i--) {

			balls[i].apply_force(delta);
			balls[i].verlet();
		}

		// resolve_collisions();
		// check_walls();

		// var i = balls.length;
		// while (i--) balls[i].verlet();

		resolve_collisions();
		check_walls();
	}

	background(51, 170);
	
	fill(27, 155, 244, 0.3);

	var i = balls.length;
	while (i--) balls[i].draw();

	if (true) {

		fill(255, 255, 255, 50)
		stroke(0, 0, 0, 100);

		ellipse(mouseX, mouseY, MOUSE_SIZE*2, MOUSE_SIZE*2);
	}
};

var add_ball = function(x, y, r) {

	var x = x || Math.random() * (width - 60) + 30,
		y = y || Math.random() * (height - 60) + 30,
		r = r || 10 + Math.random() * 20,
		s = true,
		i = balls.length;

	while (i--) {

		var ball = balls[i];
		var diff_x = ball.x - x;
		var diff_y = ball.y - y;
		var dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

		if (dist < ball.radius + r) {
			s = false;
			break;
		}
	}

	if (s) balls.push(new Ball(x, y, r));
};
