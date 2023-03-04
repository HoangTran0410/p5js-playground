import Layer from "./Layer.js";

export default class NeuralNetwork {
  constructor(neuronCounts) {
    this.layers = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.layers.push(new Layer(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(network, inputs) {
    let outputs = Layer.feedForward(network.layers[0], inputs);
    for (let i = 1; i < network.layers.length; i++) {
      outputs = Layer.feedForward(network.layers[i], outputs);
    }
    return outputs;
  }
}
