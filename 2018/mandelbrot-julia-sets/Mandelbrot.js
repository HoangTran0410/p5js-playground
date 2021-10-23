var cRe = 0.285,
	cIm = 0.01,
	newRe, newIm, oldRe, oldIm,
	tamRe, tamIm,
	moveX = 0,
	moveY = 0,
	range = 2.5,
	range_tam = 2.5,
	speedChange = 0.001,
	detail = 10,

	maxIterations = 150,
	modeColor = 1,
	MandelMode = true,

	ColorRainbow = [
		[225, 0, 0], //Red
		[225, 127, 0], //Orance
		[225, 225, 0], //Yellow
		[0, 225, 0], //Green
		[0, 0, 225], //Blue
		[75, 0, 130], //Indigo
		[143, 0, 225] //Violet
	];

var prePosX, prePosY, timeCount = 0;

function swap(a, b){
	var temp = a;
	a = b;
	b = temp;
}

function calculateColor(x, y, i) {
	var r, g, b;

	if (modeColor == 1) {
		var t = i / maxIterations;

		r = (9 * (1 - t) * t * t * t * 255);
		g = (15 * (1 - t) * (1 - t) * t * t * 255);
		b = (8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);

	} else if (modeColor == 2) {
		var bright = map(i, 0, maxIterations, 0, 255);
		if (i == maxIterations || (bright < 2))
			bright = 0;
		r = map(bright * bright, 0, 6502, 0, 255);
		g = bright;
		b = map(sqrt(bright), 0, sqrt(255), 0, 255);

	} else if (modeColor == 3) {
		if (i == maxIterations) {
			r = 0;
			g = 0;
			b = 0;
		} else {
			var bright = 6 - i % 7;
			r = ColorRainbow[bright][1];
			g = ColorRainbow[bright][2];
			b = ColorRainbow[bright][3];
		}

	} else {
		r = 0, g = 0, b = 0;
		var iterations = i;

		if (iterations == -1) {
			// nothing to do
		} else if (iterations == 0) {
			//r = 255;
			// g = 0;
			// b = 0;
		} else {
			// colour gradient:      Red -> Blue -> Green -> Red -> Black
			// corresponding values:  0  ->  16  ->  32   -> 64  ->  127 (or -1)
			if (iterations < 16) {
				r = 16 * (16 - iterations);
				// g = 0;
				b = 16 * iterations - 1;
			} else if (iterations < 32) {
				// r = 0;
				g = 16 * (iterations - 16);
				b = 16 * (32 - iterations) - 1;
			} else if (iterations < 64) {
				r = 8 * (iterations - 32);
				g = 8 * (64 - iterations) - 1;
				// b = 0;
			} else { // range is 64 - 127
				r = 255 - (iterations - 64) * 4;
				//g = 0;
				//b = 0;
			}
		}
	}

	return {
		r,
		g,
		b
	};
}

function SetColor(x, y, col) {
	var pix = (x + y * width) << 2; // multi by 4
	pixels[pix + 0] = col.r;
	pixels[pix + 1] = col.g;
	pixels[pix + 2] = col.b;
	pixels[pix + 3] = 255;
}

function smoothColor(Tr, Ti, i) {
	// Some constants
	var logBase = 1.0 / Math.log(2.0);
	var logHalfBase = Math.log(0.5) * logBase;
	// ...
	return 5 + i - logHalfBase - Math.log(Math.log(Tr + Ti)) * logBase;
}

function Calculate_OnePixel(x, y) {
	newRe = map(x, 0, width, moveX - range, moveX + range);
	newIm = map(y, 0, height, moveY - range, moveY + range);

	if (MandelMode) {
		tamRe = newRe,
			tamIm = newIm;
	}

	for (iteration = 0; iteration < maxIterations; iteration++) {
		//remember value of previous iteration
		oldRe = newRe;
		oldIm = newIm;
		//the actual iteration, the real and imaginary part are calculated               
		newRe = oldRe * oldRe - oldIm * oldIm + (MandelMode ? tamRe : cRe);
		newIm = 2 * oldRe * oldIm + (MandelMode ? tamIm : cIm);
		//if the point is outside the circle with radius 2: stop
		if ((newRe * newRe + newIm * newIm) > 4.0) break;
	}
	//draw the pixel
	var col = calculateColor(x, y, iteration);
	if (detail == 1)
		SetColor(x, y, col);
	else {
		for (var k = x; k < x + detail; k++)
			for (var j = y; j < y + detail; j++)
				SetColor(k, j, col);
	}
}

function drawSet(detailSet) {
	detail = detailSet;
	pixelDensity(1);

	loadPixels();
	for (var y = 0; y < height; y += detail)
		for (var x = 0; x < width; x += detail)
			Calculate_OnePixel(x, y, detail);
	updatePixels();
	timeCount = millis();
}

function setup() {
	createCanvas(600, 600);
	background(51);
	drawSet(1);
}

function draw() {
	if (millis() - timeCount > 1000 && detail != 1) {
		drawSet(1);
	}
}

function keyPressed() {
	switch (keyCode) {

		case 32: MandelMode = !MandelMode;
					drawSet(5);
			break;
	}
}

function mouseWheel(event) {
	if (event.delta > 0)
		range += range / 2.5;
	else range -= range / 5;
	drawSet(5);
}

function mousePressed() {
	prePosX = mouseX;
	prePosY = mouseY;
}

function mouseDragged() {
	moveX += (prePosX - mouseX) * (range / width * 1.5);
	moveY += (prePosY - mouseY) * (range / height * 1.5);
	drawSet(5);
	prePosX = mouseX;
	prePosY = mouseY;
}