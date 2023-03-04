// https://www.youtube.com/watch?v=hfMk-kjRv4c

let neuralNetwork,
  graphSize = 30,
  learning = false;

function setup() {
  createCanvas(400, 400);

  // create a learn button
  let learnButton = createButton("Learn");
  learnButton.style("display", "block");
  learnButton.mousePressed(() => {
    learning = !learning;
    if (learning) learnButton.html("Stop");
    else learnButton.html("Learn");
  });

  // create the neural network
  neuralNetwork = new NeuralNetwork(2, 3, 2);

  frameRate(60);
}

function draw() {
  background(30);

  // draw graph
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

  // calculate the cost, then display it
  let cost = neuralNetwork.totalCost(trainingData);
  fill(255);
  noStroke();
  text("Cost: " + cost.toFixed(7), 5, height - 25);

  // if learning, then learn
  if (learning) {
    text("Learning...", 5, height - 45);
    for (let i = 0; i < 10; i++) {
      neuralNetwork.learn(trainingData, 0.1);
    }
  }
}
