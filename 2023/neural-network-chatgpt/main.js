import NeuralNetwork, { ActivationFunction, LossFunction } from "./network.js";
import data from "./data.json" assert { type: "json" };

let neuralNetwork, trainingData;
let graphSize = 30;
let trainOptions = {
  epochs: 10,
  batchSize: 10,
  learningRate: 0.05,
  trainingPercentage: 0.8,
};

window.setup = () => {
  createCanvas(400, 400);
  pixelDensity(1);

  neuralNetwork = new NeuralNetwork(
    [2, 6, 2],
    ActivationFunction.Sigmoid,
    LossFunction.MeanSquaredError
  );

  trainingData = {
    inputs: data.map((d) => d.inputs),
    targets: data.map((d) => (d.label == 1 ? [0, 1] : [1, 0])),
  };

  // create an slider for the options, contains sliders
  createDiv("Training Options:");

  let learningRateLabel = createDiv(
    "Learning Rate: " + trainOptions.learningRate
  );
  let learningRateSlider = createSlider(0.01, 0.5, 0.05, 0.01);
  learningRateSlider.input(() => {
    trainOptions.learningRate = learningRateSlider.value();
    learningRateLabel.html("Learning Rate: " + trainOptions.learningRate);
  });

  let epochsLabel = createDiv("Epochs: " + trainOptions.epochs);
  let epochsSlider = createSlider(1, 1000, 100, 1);
  epochsSlider.input(() => {
    trainOptions.epochs = epochsSlider.value();
    epochsLabel.html("Epochs: " + trainOptions.epochs);
  });

  let batchSizeLabel = createDiv("Batch Size: " + trainOptions.batchSize);
  let batchSizeSlider = createSlider(1, 100, 10, 1);
  batchSizeSlider.input(() => {
    trainOptions.batchSize = batchSizeSlider.value();
    batchSizeLabel.html("Batch Size: " + trainOptions.batchSize);
  });

  let trainingPercentageLabel = createDiv(
    "Training Percentage: " + trainOptions.trainingPercentage
  );
  let trainingPercentageSlider = createSlider(0.1, 0.9, 0.8, 0.1);
  trainingPercentageSlider.input(() => {
    trainOptions.trainingPercentage = trainingPercentageSlider.value();
    trainingPercentageLabel.html(
      "Training Percentage: " + trainOptions.trainingPercentage
    );
  });
};

function classifyOutput(output) {
  return output.indexOf(Math.max(...output));
}

window.draw = () => {
  background(30);

  NeuralNetwork.train(
    trainingData.inputs,
    trainingData.targets,
    neuralNetwork,
    trainOptions
  );

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
      let output = NeuralNetwork.feedForward([graphX, graphY], neuralNetwork);
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
  let loss = NeuralNetwork.loss(
    trainingData.inputs,
    trainingData.targets,
    neuralNetwork
  );
  fill(255);
  noStroke();
  textSize(16);
  text(`Loss: ${loss.toFixed(5)}`, 10, 20);

  // draw correct count
  let correctCount = 0;
  for (let i = 0; i < trainingData.inputs.length; i++) {
    let input = trainingData.inputs[i];
    let output = NeuralNetwork.feedForward(input, neuralNetwork);

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
  text(`Correct: ${correctCount}/${trainingData.inputs.length}`, 10, 40);

  // draw the accuracy
  let accuracy = NeuralNetwork.accuracy(
    trainingData.inputs,
    trainingData.targets,
    neuralNetwork
  );
  fill(255);
  noStroke();
  textSize(16);
  text(`Accuracy: ${accuracy.toFixed(5)}`, 10, 60);
};
