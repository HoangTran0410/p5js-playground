let randColors = [];

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 10; i++) {
    randColors.push(color(random(255), random(255), random(255)));
  }
}

function draw() {
  // draw the graph
  stroke(255);
  strokeWeight(1);
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);

  // draw the function
  let i = 0;
  for (let functionName in allFunctions) {
    let func = allFunctions[functionName];
    stroke(randColors[i++]);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let x = -1; x <= 1; x += 0.01) {
      let y = func(x);
      let px = map(x, -1, 1, 0, width);
      let py = map(y, -1, 1, height, 0);
      vertex(px, py);
    }
    endShape();
  }
}

let allFunctions = {
  sigmoid: (x) => 1 / (1 + Math.exp(-x)),
  dsigmoid: (y) => y * (1 - y),
  tanh: (x) => Math.tanh(x),
  hyperbolicTangent: (x) => Math.tanh(x),
  silu: (x) => x / (1 + Math.exp(-x)),
  relu: (x) => Math.max(0, x),
};
