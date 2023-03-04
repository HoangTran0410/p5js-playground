// https://www.youtube.com/watch?v=hfMk-kjRv4c

import trainingData from "./data.json" assert { type: "json" };
import NeuralNetwork from "./classes/NeuralNetwork.js";
import { MeanSquaredError } from "./classes/Cost.js";

let neuralNetwork,
  graphSize = 30,
  learning = false,
  learnRate = 0.1;

export function setup() {
  createCanvas(400, 400);

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
    if (data.expectedOutput === 0) {
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
    let guess = neuralNetwork.classify(inputs);
    if (guess === expectedOutput) correct++;
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
