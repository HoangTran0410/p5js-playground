// https://www.youtube.com/watch?v=hfMk-kjRv4c

// import trainingData from "./data.json";
import NeuralNetwork from "./classes/NeuralNetwork.js";
import { MeanSquaredError } from "./classes/Cost.js";

// Convert to one-hot encoding: class 0 -> [1, 0], class 1 -> [0, 1]
const trainingData = [
  { inputs: [1.95, 14.55], expectedOutput: [0, 1] },
  { inputs: [6.45, 13.95], expectedOutput: [0, 1] },
  { inputs: [10.65, 12.15], expectedOutput: [0, 1] },
  { inputs: [12.9, 9.15], expectedOutput: [0, 1] },
  { inputs: [13.95, 4.8], expectedOutput: [0, 1] },
  { inputs: [14.1, 1.2], expectedOutput: [0, 1] },
  { inputs: [5.4, 17.55], expectedOutput: [1, 0] },
  { inputs: [5.4, 21.9], expectedOutput: [1, 0] },
  { inputs: [7.95, 24], expectedOutput: [1, 0] },
  { inputs: [1.35, 26.85], expectedOutput: [1, 0] },
  { inputs: [6.45, 27.45], expectedOutput: [1, 0] },
  { inputs: [16.5, 27.75], expectedOutput: [1, 0] },
  { inputs: [9.75, 20.4], expectedOutput: [1, 0] },
  { inputs: [19.05, 19.2], expectedOutput: [1, 0] },
  { inputs: [15.9, 12.15], expectedOutput: [1, 0] },
  { inputs: [24.15, 23.25], expectedOutput: [1, 0] },
  { inputs: [15, 23.25], expectedOutput: [1, 0] },
  { inputs: [27.6, 24], expectedOutput: [1, 0] },
  { inputs: [26.25, 17.1], expectedOutput: [1, 0] },
  { inputs: [23.25, 12.45], expectedOutput: [1, 0] },
  { inputs: [21.45, 3.6], expectedOutput: [1, 0] },
  { inputs: [17.25, 7.2], expectedOutput: [1, 0] },
  { inputs: [25.65, 6.45], expectedOutput: [1, 0] },
  { inputs: [27, 9.3], expectedOutput: [1, 0] },
  { inputs: [4.95, 10.35], expectedOutput: [0, 1] },
  { inputs: [3.6, 5.1], expectedOutput: [0, 1] },
  { inputs: [2.1, 10.35], expectedOutput: [0, 1] },
  { inputs: [1.8, 5.25], expectedOutput: [0, 1] },
  { inputs: [6.6, 7.35], expectedOutput: [0, 1] },
  { inputs: [9, 9.15], expectedOutput: [0, 1] },
  { inputs: [11.1, 5.4], expectedOutput: [0, 1] },
  { inputs: [11.25, 2.1], expectedOutput: [0, 1] },
  { inputs: [8.55, 3.45], expectedOutput: [0, 1] },
  { inputs: [6.75, 3], expectedOutput: [0, 1] },
  { inputs: [3.15, 1.65], expectedOutput: [0, 1] },
  { inputs: [1.35, 2.25], expectedOutput: [0, 1] },
  { inputs: [4.2, 8.25], expectedOutput: [0, 1] },
  { inputs: [3.75, 12.75], expectedOutput: [0, 1] },
];

let neuralNetwork,
  graphSize = 30,
  learning = false,
  learnRate = 0.1;

export function setup() {
  createCanvas(400, 400);
  pixelDensity(1);

  let container = createDiv();
  container.style("padding", "10px");

  // create a learn button
  let learnButton = createButton("Start Learn");
  learnButton.style("display", "block");
  learnButton.mousePressed(() => {
    learning = !learning;
    if (learning) learnButton.html("Stop Learn");
    else learnButton.html("Start Learn");
  });
  container.child(learnButton);

  // create a learn rate slider, and label inline
  let learnRateLabel = createDiv("Learning rate: " + learnRate);
  learnRateLabel.style("display", "inline-block");

  let learnRateSlider = createSlider(0, 1, 0.1, 0.01);
  learnRateSlider.style("width", "180px");
  learnRateSlider.style("display", "inline-block");
  learnRateSlider.input(() => {
    learnRate = learnRateSlider.value();
    learnRateLabel.html("Learning rate: " + learnRate);
  });
  container.child(learnRateSlider);
  container.child(learnRateLabel);

  // create the neural network
  neuralNetwork = new NeuralNetwork([2, 2, 2], MeanSquaredError, true);

  frameRate(60);
}

export function draw() {
  background(30);

  drawGraph();
  drawAxes();
  drawTrainingData();
  drawCorrect();
  drawCost();

  if (learning) {
    learn();
  }
}

function learn(speedup = 10) {
  text("Learning...", 5, height - 45);
  for (let i = 0; i < speedup; i++) {
    neuralNetwork.learn(trainingData, learnRate);
  }
}

function drawGraph() {
  loadPixels();
  for (let x = 0; x < width; x += 4) {
    for (let y = 0; y < height; y += 4) {
      let index = (x + y * width) * 4;
      let graphX = map(x, 0, width, -graphSize, graphSize);
      let graphY = map(y, 0, height, graphSize, -graphSize);

      // draw the graph
      let classification = neuralNetwork.classify([graphX, graphY]);
      if (classification === 0) {
        pixels[index + 0] = 255;
        pixels[index + 1] = 0;
        pixels[index + 2] = 0;
        pixels[index + 3] = 255;
      } else {
        pixels[index + 0] = 0;
        pixels[index + 1] = 0;
        pixels[index + 2] = 255;
        pixels[index + 3] = 255;
      }
    }
  }
  updatePixels();
}

function drawAxes() {
  // draw the axes of the graph at zero
  stroke(255);
  strokeWeight(1);
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);
}

function drawTrainingData() {
  for (let data of trainingData) {
    let x = map(data.inputs[0], -graphSize, graphSize, 0, width);
    let y = map(data.inputs[1], -graphSize, graphSize, height, 0);
    // expectedOutput is now [1, 0] for class 0 (red) or [0, 1] for class 1 (blue)
    // Get the class by finding which index has the higher value
    let expectedClass = data.expectedOutput[0] > data.expectedOutput[1] ? 0 : 1;
    if (expectedClass === 0) {
      fill(255, 0, 0);
    } else {
      fill(0, 0, 255);
    }
    noStroke();
    ellipse(x, y, 8);
  }
}

function drawCorrect() {
  // calculate the correct, then display it
  let correct = 0;
  for (let data of trainingData) {
    let inputs = data.inputs;
    let expectedOutput = data.expectedOutput;
    // Get expected class from one-hot encoding
    let expectedClass = expectedOutput[0] > expectedOutput[1] ? 0 : 1;
    let guess = neuralNetwork.classify(inputs);
    if (guess === expectedClass) correct++;
  }
  fill(255);
  noStroke();
  text("Correct: " + correct + "/" + trainingData.length, 5, height - 5);
}

function drawCost() {
  let cost = neuralNetwork.totalCost(trainingData);
  fill(255);
  noStroke();
  text("Cost: " + cost.toFixed(7), 5, height - 25);
}
