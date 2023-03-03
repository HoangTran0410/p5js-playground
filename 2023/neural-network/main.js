let neuralNetwork;

function setup() {
  createCanvas(400, 400);

  // create the neural network
  neuralNetwork = new NeuralNetwork(2, 3, 2);
}

function draw() {
  //   console.log(weight_1_1);
  background(30);

  // draw the graph
  stroke(255);
  strokeWeight(1);
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);

  loadPixels();
  for (let x = 0; x < width; x += 2) {
    for (let y = 0; y < height; y += 2) {
      let index = (x + y * width) * 4;
      let graphX = map(x, 0, width, -1, 1);
      let graphY = map(y, 0, height, 1, -1);

      // draw the graph
      let classification = 0; //classify(graphX, graphY);
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

class Layer {
  // create the layer
  constructor(numNodesIn, numNodesOut, layerIndex = "") {
    this.numNodesIn = numNodesIn;
    this.numNodesOut = numNodesOut;
    this.layerIndex = layerIndex;

    this.weights = [];
    this.biases = [];

    this.createDom();
  }

  // create 2 div elements for weights and biases, each div have label and list of sliders to control the values
  createDom() {
    // create a layer container, display inlined, border, padding, margin
    let container = createDiv();
    container.style("display", "inline-block");
    container.style("border", "1px solid white");
    container.style("padding", "10px");
    container.style("margin", "10px auto");

    // create the layer title, bold, bigger font, underlined, margin bottom
    let layerTitle = createDiv(
      "Layer " +
        this.layerIndex +
        ": " +
        this.numNodesIn +
        " -> " +
        this.numNodesOut
    );
    layerTitle.style("font-weight", "bold");
    layerTitle.style("font-size", "20px");
    layerTitle.style("margin-bottom", "10px");

    let weightsDiv = createDiv("Weights");
    let biasesDiv = createDiv("Biases");

    for (let nodeIn = 0; nodeIn < this.numNodesIn; nodeIn++) {
      let weightsList = createDiv();
      let biasesList = createDiv();

      for (let nodeOut = 0; nodeOut < this.numNodesOut; nodeOut++) {
        let weight = random(-1, 1);
        let bias = random(-1, 1);

        this.weights[nodeIn] = this.weights[nodeIn] || [];
        this.weights[nodeIn][nodeOut] = weight;

        this.biases[nodeOut] = bias;

        let weightSlider = createSlider(-1, 1, weight, 0.01);
        let biasSlider = createSlider(-1, 1, bias, 0.01);

        weightSlider.input(() => {
          this.weights[nodeIn][nodeOut] = weightSlider.value();
        });

        biasSlider.input(() => {
          this.biases[nodeOut] = biasSlider.value();
        });

        weightsList.child(weightSlider);
        biasesList.child(biasSlider);
      }

      weightsDiv.child(weightsList);
      biasesDiv.child(biasesList);
    }

    container.child(layerTitle);
    container.child(weightsDiv);
    container.child(biasesDiv);
  }

  // calculate the output of the layer
  calculateOutput(inputs) {
    let weightedInputs = [];

    for (let nodeOut = 0; nodeOut < this.numNodesOut; nodeOut++) {
      let weightedOutput = this.biases[nodeOut];
      for (let nodeIn = 0; nodeIn < this.numNodesIn; nodeIn++) {
        weightedOutput += inputs[nodeIn] * this.weights[nodeIn][nodeOut];
      }
      weightedInputs[nodeOut] = weightedOutput;
    }
    return weightedInputs;
  }
}

class NeuralNetwork {
  // create the neural network
  constructor(...layerSizes) {
    this.layers = [];
    for (let i = 0; i < layerSizes.length - 1; i++) {
      this.layers.push(
        new Layer(
          layerSizes[i],
          layerSizes[i + 1],
          i === layerSizes.length - 2 ? "output" : i + 1
        )
      );
    }
  }

  //   run the input values through the neural network to calculate the output values
  calculateOutput(inputs) {
    let outputs = inputs;
    for (let layer of this.layers) {
      outputs = layer.calculateOutput(outputs);
    }
    return outputs;
  }

  // run the inputs through the network and calculate which output node has the highest value
  classify(inputs) {
    let outputs = this.calculateOutput(inputs);
    return outputs.indexOf(Math.max(...outputs));
  }
}
