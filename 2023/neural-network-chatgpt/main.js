import NeuralNetwork, { ActivationFunction, LossFunction } from "./network.js";
import data from "./data.json" assert { type: "json" };

let neuralNetwork, trainingData;
let graphSize = 30;

window.setup = () => {
  createCanvas(400, 400);
  pixelDensity(1);

  neuralNetwork = new NeuralNetwork(
    [2, 3, 2],
    ActivationFunction.Sigmoid,
    LossFunction.MeanSquaredError
  );

  trainingData = {
    inputs: data.map((d) => d.inputs),
    targets: data.map((d) => (d.label == 1 ? [0, 1] : [1, 0])),
  };

  // train the neural network
  neuralNetwork.train(trainingData.inputs, trainingData.targets, {
    epochs: 1,
    learningRate: 0.1,
  });
};

function classifyOutput(output) {
  return output.indexOf(Math.max(...output));
}

window.draw = () => {
  background(30);

  // draw training data
  noStroke();
  for (let i = 0; i < trainingData.inputs.length; i++) {
    let x = map(trainingData.inputs[i][0], -graphSize, graphSize, 0, width);
    let y = map(trainingData.inputs[i][1], -graphSize, graphSize, height, 0);
    let classification = classifyOutput(trainingData.targets[i]);
    if (classification === 0) {
      fill(255, 0, 0);
    } else {
      fill(0, 0, 255);
    }
    ellipse(x, y, 8);
  }

  // draw the graph
  loadPixels();
  for (let x = 0; x < width; x += 4) {
    for (let y = 0; y < height; y += 4) {
      let index = (x + y * width) * 4;
      let graphX = map(x, 0, width, -graphSize, graphSize);
      let graphY = map(y, 0, height, graphSize, -graphSize);

      // draw the graph
      let output = neuralNetwork.feedForward([graphX, graphY]);
      let predicted = classifyOutput(output);
      if (predicted === 0) {
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

  // draw the axes of the graph at zero
  stroke(255);
  strokeWeight(1);
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);

  // draw the loss
  let loss = neuralNetwork.loss(trainingData.inputs, trainingData.targets);
  fill(255);
  noStroke();
  textSize(16);
  text(`Loss: ${loss.toFixed(5)}`, 10, 20);

  // // draw correct count
  let correctCount = 0;
  for (let i = 0; i < trainingData.inputs.length; i++) {
    let input = trainingData.inputs[i];
    let output = neuralNetwork.feedForward(input);

    let predicted = classifyOutput(output);
    let expected = classifyOutput(trainingData.targets[i]);

    if (predicted === expected) {
      correctCount++;

      // highlight the correct ones
      let x = map(input[0], -graphSize, graphSize, 0, width);
      let y = map(input[1], -graphSize, graphSize, height, 0);
      stroke(0, 255, 0);
      strokeWeight(2);
      noFill();
      ellipse(x, y, 8);
    }
  }
  fill(255);
  noStroke();
  textSize(16);
  text(`Correct: ${correctCount}`, 10, 40);
};
