let graphSize = {
  x: [-3, 3],
  y: [-1, 5],
};
let inputValue,
  learnHistory = [],
  isLearning = false,
  learnRate = 0.1;

function setup() {
  createCanvas(500, 500);

  inputValue = random(graphSize.x[0], graphSize.x[1]);

  // create slider for learning rate, and label
  let label = createDiv("Learning rate: " + learnRate);
  let slider = createSlider(0.01, 0.5, 0.1, 0.01);
  slider.style("width", "80px");
  slider.input(() => {
    learnRate = slider.value();
    label.html("Learning rate: " + learnRate);
  });

  // create reset button, to reset the input value
  let resetButton = createButton("Reset");
  resetButton.mousePressed(() => {
    inputValue = random(graphSize.x[0], graphSize.x[1]);
    learnHistory = [];
    isLearning = false;
  });

  // create a learn button
  let learnButton = createButton("Learn");
  learnButton.mousePressed(() => {
    isLearning = true;
  });
}

function draw() {
  background(30);

  // draw the axes at zero
  stroke(150);
  strokeWeight(2);
  let x0 = map(0, graphSize.x[0], graphSize.x[1], 0, width);
  let y0 = map(0, graphSize.y[0], graphSize.y[1], height, 0);
  line(x0, 0, x0, height);
  line(0, y0, width, y0);

  // draw the grid lines
  stroke(100, 150);
  strokeWeight(1);
  for (let x = graphSize.x[0]; x <= graphSize.x[1]; x++) {
    let px = map(x, graphSize.x[0], graphSize.x[1], 0, width);
    line(px, 0, px, height);
  }
  for (let y = graphSize.y[0]; y <= graphSize.y[1]; y++) {
    let py = map(y, graphSize.y[0], graphSize.y[1], height, 0);
    line(0, py, width, py);
  }

  // draw the x, y axis numbers on the axes
  noStroke();
  fill(150);
  textAlign(CENTER, CENTER);
  textSize(14);
  for (let x = graphSize.x[0]; x <= graphSize.x[1]; x++) {
    let px = map(x, graphSize.x[0], graphSize.x[1], 0, width);
    text(x, px, y0 + 15);
  }
  for (let y = graphSize.y[0]; y <= graphSize.y[1]; y++) {
    let py = map(y, graphSize.y[0], graphSize.y[1], height, 0);
    text(y, x0 + 15, py);
  }

  // draw the function
  stroke("blue");
  strokeWeight(2);
  noFill();
  beginShape();
  for (let x = graphSize.x[0]; x <= graphSize.x[1]; x += 0.01) {
    let y = TheFunction(x);
    let px = map(x, graphSize.x[0], graphSize.x[1], 0, width);
    let py = map(y, graphSize.y[0], graphSize.y[1], height, 0);
    vertex(px, py);
  }
  endShape();

  // draw all point of the learning history
  stroke(0);
  strokeWeight(1);
  fill(255);
  for (let x of learnHistory) {
    let y = TheFunction(x);
    let px = map(x, graphSize.x[0], graphSize.x[1], 0, width);
    let py = map(y, graphSize.y[0], graphSize.y[1], height, 0);
    ellipse(px, py, 5);
  }

  // draw the current input value
  stroke(0);
  strokeWeight(1);
  fill(255);
  let px = map(inputValue, graphSize.x[0], graphSize.x[1], 0, width);
  let py = map(
    TheFunction(inputValue),
    graphSize.y[0],
    graphSize.y[1],
    height,
    0
  );
  ellipse(px, py, 10);

  if (isLearning) {
    // draw the slope at the input value
    drawSlope(inputValue);

    // learn
    learn(learnRate);
  } else {
    // draw the slope at mouseX position
    drawSlope(map(mouseX, 0, width, graphSize.x[0], graphSize.x[1]));
  }

  // text info
  if (isLearning) {
    noStroke();
    fill(255);
    textAlign(LEFT, TOP);
    textSize(14);
    text("Learning...", 10, 10);
  }
}

function TheFunction(x) {
  return 0.2 * pow(x, 4) + 0.1 * pow(x, 3) - pow(x, 2) + 2;
}

function learn(learnRate) {
  let slope = calculateSlope(inputValue);
  inputValue -= slope * learnRate;

  // keep track of the learning history
  learnHistory.push(inputValue);
}

function calculateSlope(x) {
  let h = 0.00001;
  let deltaOutput = TheFunction(x + h) - TheFunction(x);
  let slope = deltaOutput / h;
  return slope;
}

function drawSlope(x) {
  let slope = calculateSlope(x);

  // draw the slope line
  let slopeDirection = createVector(1, slope).normalize();
  let point = createVector(x, TheFunction(x));

  let start = point.copy().sub(slopeDirection);
  let end = point.copy().add(slopeDirection);
  stroke("red");
  strokeWeight(3);
  let px1 = map(start.x, graphSize.x[0], graphSize.x[1], 0, width);
  let py1 = map(start.y, graphSize.y[0], graphSize.y[1], height, 0);
  let px2 = map(end.x, graphSize.x[0], graphSize.x[1], 0, width);
  let py2 = map(end.y, graphSize.y[0], graphSize.y[1], height, 0);
  line(px1, py1, px2, py2);

  // draw the slope point
  noStroke();
  fill("white");
  let px = map(point.x, graphSize.x[0], graphSize.x[1], 0, width);
  let py = map(point.y, graphSize.y[0], graphSize.y[1], height, 0);
  ellipse(px, py, 5);

  // draw the slope value at top of line, not overlapping the graph
  noStroke();
  fill("white");
  textAlign(CENTER, CENTER);
  textSize(14);
  let textX = map(point.x, graphSize.x[0], graphSize.x[1], 0, width);
  let textY = map(point.y, graphSize.y[0], graphSize.y[1], height, 0);
  if (textY < 20) {
    textY = 20;
  }
  text(slope.toFixed(2), textX, textY - 10);
}
