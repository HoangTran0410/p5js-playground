import Matrix from "./matrix.js";

export default class NeuralNetwork {
  constructor(layerSizes) {
    this.layers = [];
    for (let i = 1; i < layerSizes.length; i++) {
      this.layers.push(new Layer(layerSizes[i - 1], layerSizes[i]));
    }
  }

  predict(input) {
    const output = this.feedForward(input);
    return output.toArray();
  }

  feedForward(input) {
    let output = Matrix.fromArray(input);
    for (let layer of this.layers) {
      output = layer.feedForward(output);
    }
    return output;
  }

  train(input, target, learningRate = 0.1) {
    const output = this.feedForward(input);
    let error = Matrix.fromArray(target).subtract(output);

    for (let i = this.layers.length - 1; i >= 0; i--) {
      error = this.layers[i].backpropagate(error, learningRate);
    }
  }

  static sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  static sigmoidDerivative(x) {
    return x * (1 - x);
  }
}

class Layer {
  constructor(inputSize, outputSize) {
    this.weights = new Matrix(outputSize, inputSize).randomize(-1, 1);
    this.biases = new Matrix(outputSize, 1);

    this.input = null;
    this.output = null;
  }

  feedForward(input) {
    this.output = this.weights
      .multiply(input)
      .add(this.biases)
      .map(NeuralNetwork.sigmoid);

    this.input = input.clone();
    return this.output.clone();
  }

  backpropagate(error, learningRate) {
    let gradient = this.output
      .clone()
      .map(NeuralNetwork.sigmoidDerivative)
      .multiply(learningRate);

    let delta = gradient.multiply(error);

    this.weights = this.weights.add(delta.multiply(this.input.transpose()));
  }
}
