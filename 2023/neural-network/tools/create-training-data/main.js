let currentLabel = 0,
  graphSize = 30,
  trainingData = [];

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(30);

  // draw the axes
  stroke(255);
  strokeWeight(1);
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);

  // draw the training data
  for (let data of trainingData) {
    let x = map(data.inputs[0], -graphSize, graphSize, 0, width);
    let y = map(data.inputs[1], -graphSize, graphSize, height, 0);
    if (data.expectedOutput === 0) {
      fill(255, 0, 0);
    } else {
      fill(0, 0, 255);
    }
    noStroke();
    ellipse(x, y, 8);
  }

  // draw circle at mouse, with color of current label
  if (currentLabel === 0) fill(255, 0, 0);
  else if (currentLabel === 1) fill(0, 0, 255);
  noStroke();
  ellipse(mouseX, mouseY, 8);
}

function mousePressed() {
  //   add training data at mouse position
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  let x = map(mouseX, 0, width, -graphSize, graphSize);
  let y = map(mouseY, 0, height, graphSize, -graphSize);
  let inputs = [x.toFixed(2), y.toFixed(2)];
  let expectedOutput = currentLabel;
  trainingData.push({ inputs, expectedOutput });
}

function keyPressed() {
  // change label when spacebar is pressed
  if (key === " ") {
    currentLabel = currentLabel === 0 ? 1 : 0;
  }
}
