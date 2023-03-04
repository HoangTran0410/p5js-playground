let vertexs = [];
let selectedFunction = null;
let graphSize = {
  x: [-5, 5],
  y: [-5, 5],
};

function setup() {
  createCanvas(500, 500);

  // create the buttons
  for (let functionName in allFunctions) {
    let button = createButton(functionName);
    button.mousePressed(() => {
      selectedFunction = functionName;
    });
  }
}

function draw() {
  background(30);

  // draw the axes
  stroke(150);
  strokeWeight(1);
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);

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

  // draw the x, y axis numbers
  noStroke();
  fill(150);
  textAlign(CENTER, CENTER);
  textSize(14);
  text("0", width / 2 - 10, height / 2 + 10);
  for (let x = graphSize.x[0]; x <= graphSize.x[1]; x++) {
    let px = map(x, graphSize.x[0], graphSize.x[1], 0, width);
    if (x === 0) continue;
    text(x, px, height / 2 + 10);
  }
  for (let y = graphSize.y[0]; y <= graphSize.y[1]; y++) {
    let py = map(y, graphSize.y[0], graphSize.y[1], height, 0);
    if (y === 0) continue;
    text(y, width / 2 - 10, py);
  }

  // calculate targetVertexs
  let targetVertexs = [];
  for (let x = graphSize.x[0]; x <= graphSize.x[1]; x += 0.01) {
    let y = allFunctions[selectedFunction]?.(x) || 0;
    let px = map(x, graphSize.x[0], graphSize.x[1], 0, width);
    let py = map(y, graphSize.y[0], graphSize.y[1], height, 0);
    targetVertexs.push({ x: px, y: py });
  }
  if (vertexs.length === 0) vertexs = targetVertexs;

  // lerp vertexs to targetVertexs
  for (let i = 0; i < vertexs.length; i++) {
    vertexs[i].x = lerp(vertexs[i].x, targetVertexs[i].x, 0.15);
    vertexs[i].y = lerp(vertexs[i].y, targetVertexs[i].y, 0.15);
  }

  // draw the vertexs
  stroke("red");
  strokeWeight(2);
  noFill();
  beginShape();
  for (let v of vertexs) {
    vertex(v.x, v.y);
  }
  endShape();

  // draw the function name
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text(selectedFunction ?? "Please select function", width / 2, 20);
}

let allFunctions = {
  step: (x) => (x >= 0 ? 1 : 0),
  sigmoid: (x) => 1 / (1 + Math.exp(-x)),
  dsigmoid: (y) => y * (1 - y),
  hyperbolicTangent: (x) => Math.tanh(x),
  silu: (x) => x / (1 + Math.exp(-x)),
  relu: (x) => Math.max(0, x),
};
