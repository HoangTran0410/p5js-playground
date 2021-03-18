var points = [];
var angle = 0;

function setup() {
	createCanvas(500, 500);

	points[0] = createVector(-0.5, 0.5, -0.5);
	points[1] = createVector(0.5, 0.5, -0.5);
	points[2] = createVector(0.5, -0.5, -0.5);
	points[3] = createVector(-0.5, -0.5, -0.5);

	points[4] = createVector(-0.5, 0.5, 0.5);
	points[5] = createVector(0.5, 0.5, 0.5);
	points[6] = createVector(0.5, -0.5, 0.5);
	points[7] = createVector(-0.5, -0.5, 0.5);
}

function draw() {
	background(30);

	var rX = [
		[1, 0, 0],
		[0, cos(angle), -sin(angle)],
		[0, sin(angle), cos(angle)]
	];

	var rY = [
		[cos(angle), 0, sin(angle)],
		[0, 1, 0],
		[-sin(angle), 0, cos(angle)]
	];

	var rZ = [
		[cos(angle), -sin(angle), 0],
		[sin(angle), cos(angle), 0],
		[0, 0, 1]
	];

	translate(width / 2, height / 2);

	var projected2d = [];
	var index = 0;

	for (var p of points) {
		var rotated = multMatrix(rX, vecToMatrix(p));
		rotated = multMatrix(rY, rotated);
		rotated = multMatrix(rZ, rotated);

		var dis = 1.5;
		var z = 1 / (dis - matrixToVec(rotated).z);

		var projection = [
			[z, 0, 0],
			[0, z, 0]
		];

		projected2d[index] = (matrixToVec(multMatrix(projection, rotated))).mult(100);

		stroke(255);
		strokeWeight(6);
		point(projected2d[index].x, projected2d[index].y);

		index++;
	}


	for (var i = 0; i < 4; i++) {
		connect(i, (i + 1) % 4, projected2d);
		connect(i + 4, ((i + 1) % 4) + 4, projected2d);
		connect(i, i + 4, projected2d);
	}

	angle += 0.03;
}

function connect(from, to, arr) {
	strokeWeight(2);
	line(arr[from].x, arr[from].y, arr[to].x, arr[to].y);
}

function multMatrix(m1, m2) {
	var dong1 = m1.length,
		cot1 = m1[0].length;
	var dong2 = m2.length,
		cot2 = m2[0].length;

	if (cot1 != dong2) {
		console.log('Columns of A must match rows of B');
		return;
	}

	var result = [];

	for (var i = 0; i < dong1; i++) {
		result[i] = [];
		for (var j = 0; j < cot2; j++) {
			result[i][j] = 0;
			for (var k = 0; k < cot1; k++) {
				result[i][j] += m1[i][k] * m2[k][j];
			}
		}
	}

	return result;
}

function vecToMatrix(v) {
	var m = [];
	m[0] = [];
	m[0][0] = v.x;
	m[1] = [];
	m[1][0] = v.y;
	m[2] = [];
	m[2][0] = v.z;

	return m;
}

function matrixToVec(m) {
	var x = m[0][0];
	var y = m[1][0];
	var z = ((m.length > 2) ? m[2][0] : 0);
	return createVector(x, y, z);
}