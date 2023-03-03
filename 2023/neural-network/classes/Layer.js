class Layer {
  // create the layer
  constructor(numNodesIn, numNodesOut, layerIndex = "") {
    this.numNodesIn = numNodesIn;
    this.numNodesOut = numNodesOut;
    this.layerIndex = layerIndex;

    this.weights = [];
    this.biases = [];

    this.costGradientW = [];
    this.costGradientB = [];

    this.initRandomWeights();
    this.createDom();
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
        // get random value between -1 and 1
        let rnd = random(-1, 1);
        // scale the weights to be smaller, so that the network doesn't start with too large values
        this.weights[nodeIn][nodeOut] = rnd / Math.sqrt(this.numNodesIn);
      }
    }

    for (let nodeOut = 0; nodeOut < this.numNodesOut; nodeOut++) {
      this.biases[nodeOut] = random(-1, 1);
    }

    this.costGradientW = this.weights.map((row) => row.map(() => 0));
    this.costGradientB = this.biases.map(() => 0);
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

  nodeCost(outputActivation, expectedOutput) {
    let error = outputActivation - expectedOutput;
    return error * error;
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
      `Layer ${this.layerIndex}: <br/>
          (in ${this.numNodesIn} -> out ${this.numNodesOut})`
    );
    layerTitle.style("font-weight", "bold");
    layerTitle.style("font-size", "20px");
    layerTitle.style("margin-bottom", "10px");

    // create the weight sliders for each nodein and nodeout
    let weightsDiv = createDiv("Weights");
    for (let nodeIn = 0; nodeIn < this.numNodesIn; nodeIn++) {
      let weightsList = createDiv();

      for (let nodeOut = 0; nodeOut < this.numNodesOut; nodeOut++) {
        let weight = this.weights[nodeIn][nodeOut];
        let weightSlider = createSlider(-1, 1, weight, 0.01);
        weightSlider.input(() => {
          this.weights[nodeIn][nodeOut] = weightSlider.value();
        });
        weightsList.child(weightSlider);

        // auto update dom interval
        setInterval(() => {
          weightSlider.value(this.weights[nodeIn][nodeOut]);
        }, 100);
      }
      weightsDiv.child(weightsList);
    }

    // create the bias slider for each nodeout
    let biasesDiv = createDiv("Biases");
    for (let nodeOut = 0; nodeOut < this.numNodesOut; nodeOut++) {
      let biasesList = createDiv();
      let bias = this.biases[nodeOut];
      let biasSlider = createSlider(-1, 1, bias, 0.01);
      biasSlider.input(() => {
        this.biases[nodeOut] = biasSlider.value();
      });
      biasesList.child(biasSlider);
      biasesDiv.child(biasesList);

      // auto update dom interval
      setInterval(() => {
        biasSlider.value(this.biases[nodeOut]);
      }, 100);
    }

    container.child(layerTitle);
    container.child(weightsDiv);
    container.child(biasesDiv);

    if (this.divContainer) this.divContainer.remove();
    this.divContainer = container;
  }
}
