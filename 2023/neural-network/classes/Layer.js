export default class Layer {
  // create the layer
  constructor(numNodesIn, numNodesOut, layerName = "", showDom = true) {
    this.numNodesIn = numNodesIn;
    this.numNodesOut = numNodesOut;
    this.layerName = layerName;

    this.weights = [];
    this.biases = [];

    this.costGradientW = [];
    this.costGradientB = [];

    this.initRandomWeights();
    showDom && this.createDom();
  }

  // update the weights and biases based on the cost gradients (gradient descent)
  applyGradients(learningRate) {
    for (let nodeOut = 0; nodeOut < this.numNodesOut; nodeOut++) {
      this.biases[nodeOut] -= learningRate * this.costGradientB[nodeOut];

      for (let nodeIn = 0; nodeIn < this.numNodesIn; nodeIn++) {
        this.weights[nodeIn][nodeOut] -=
          learningRate * this.costGradientW[nodeIn][nodeOut];
      }
    }
  }

  initRandomWeights() {
    for (let nodeIn = 0; nodeIn < this.numNodesIn; nodeIn++) {
      this.weights[nodeIn] = [];
      for (let nodeOut = 0; nodeOut < this.numNodesOut; nodeOut++) {
        this.weights[nodeIn][nodeOut] =
          this.randomInNormalDistribution(0, 1) / Math.sqrt(this.numNodesIn);
      }
    }

    for (let nodeOut = 0; nodeOut < this.numNodesOut; nodeOut++) {
      this.biases[nodeOut] = 0;
    }

    this.costGradientW = this.weights.map((row) => row.map(() => 0));
    this.costGradientB = this.biases.map(() => 0);
  }

  randomInNormalDistribution(mean, standardDeviation) {
    let x1 = 1 - random();
    let x2 = 1 - random();
    let y1 = Math.sqrt(-2.0 * Math.log(x1)) * Math.cos(2.0 * Math.PI * x2);
    return y1 * standardDeviation + mean;
  }

  // calculate the output of the layer
  calculateOutput(inputs) {
    let activations = [];

    for (let nodeOut = 0; nodeOut < this.numNodesOut; nodeOut++) {
      let weightedOutput = this.biases[nodeOut];
      for (let nodeIn = 0; nodeIn < this.numNodesIn; nodeIn++) {
        weightedOutput += inputs[nodeIn] * this.weights[nodeIn][nodeOut];
      }
      activations[nodeOut] = this.activationFunction(weightedOutput);
    }
    return activations;
  }

  activationFunction(weightedInput) {
    // return weightedInput;

    // sigmoid
    return 1 / (1 + Math.exp(-weightedInput));

    // hyperbolic tangent
    // return Math.tanh(weightedInput);

    // relu
    // return weightedInput > 0 ? weightedInput : 0;

    // step
    // return weightedInput > 0 ? 1 : 0;
  }

  // activationDerivative(weightedInput) {
  //   // derivative of the activation function (sigmoid)
  //   let activation = this.activationFunction(weightedInput);
  //   return activation * (1 - activation);
  // }

  nodeCost(outputActivation, expectedOutput) {
    let error = outputActivation - expectedOutput;
    return error * error;
  }

  // nodeCostDerivative(outputActivation, expectedOutput) {
  //   return 2 * (outputActivation - expectedOutput);
  // }

  // create 2 div elements for weights and biases, each div have label and list of sliders to control the values
  createDom() {
    // create a layer container, display inlined, border, padding, margin
    let container = createDiv();
    container.style("display", "inline-block");
    container.style("border", "1px solid white");
    container.style("padding", "10px");
    container.style("margin", "10px auto");

    // create the layer title, bold, bigger font, underlined, margin bottom
    let layerTitle = createDiv(this.layerName);
    layerTitle.style("font-weight", "bold");
    layerTitle.style("font-size", "20px");
    layerTitle.style("margin-bottom", "10px");

    // create a random weights button
    let randomWeightsButton = createButton("Random");
    randomWeightsButton.mousePressed(() => {
      this.initRandomWeights();
    });

    // create the weight sliders for each nodein and nodeout
    let weightsDiv = createDiv("Weights");
    for (let nodeIn = 0; nodeIn < this.numNodesIn; nodeIn++) {
      let weightsList = createDiv();

      for (let nodeOut = 0; nodeOut < this.numNodesOut; nodeOut++) {
        let weight = this.weights[nodeIn][nodeOut];

        // slider
        let weightSlider = createSlider(-1, 1, weight, 0.01);
        weightsList.child(weightSlider);

        // label for the slider
        let label = createDiv(this.weights[nodeIn][nodeOut].toFixed(2));
        label.style("display", "inline-block");
        weightsList.child(label);

        // event listener for the slider
        weightSlider.input(() => {
          this.weights[nodeIn][nodeOut] = weightSlider.value();
          label.html(this.weights[nodeIn][nodeOut].toFixed(2));
        });

        // auto update dom interval
        setInterval(() => {
          label.html(this.weights[nodeIn][nodeOut].toFixed(2));
          weightSlider.value(this.weights[nodeIn][nodeOut]);
        }, 200);
      }
      weightsDiv.child(weightsList);
    }

    // create the bias slider for each nodeout
    let biasesDiv = createDiv("Biases");
    for (let nodeOut = 0; nodeOut < this.numNodesOut; nodeOut++) {
      let biasesList = createDiv();
      let bias = this.biases[nodeOut];

      // slider
      let biasSlider = createSlider(-1, 1, bias, 0.01);
      biasesList.child(biasSlider);
      biasesDiv.child(biasesList);

      // label for the slider
      let label = createDiv(this.biases[nodeOut].toFixed(2));
      label.style("display", "inline-block");
      biasesList.child(label);

      // event listener for the slider
      biasSlider.input(() => {
        this.biases[nodeOut] = biasSlider.value();
        label.html(this.biases[nodeOut].toFixed(2));
      });

      // auto update dom interval
      setInterval(() => {
        label.html(this.biases[nodeOut].toFixed(2));
        biasSlider.value(this.biases[nodeOut]);
      }, 200);
    }

    container.child(layerTitle);
    container.child(randomWeightsButton);
    container.child(weightsDiv);
    container.child(biasesDiv);

    if (this.divContainer) this.divContainer.remove();
    this.divContainer = container;
  }
}
