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
    for (let layer of this.layers) {
      inputs = layer.calculateOutput(inputs);
    }
    return inputs;
  }

  // run the inputs through the network and calculate which output node has the highest value
  classify(inputs) {
    let outputs = this.calculateOutput(inputs);
    return outputs.indexOf(Math.max(...outputs));
  }

  // also often called the Loss function
  cost({ inputs, expectedOutput }) {
    let outputs = this.calculateOutput(inputs);
    let outputLayer = this.layers[this.layers.length - 1];
    let cost = 0;

    for (let output of outputs) {
      cost += outputLayer.nodeCost(output, expectedOutput);
    }

    return cost;
  }

  totalCost(data) {
    let totalCost = 0;
    for (let dataPoint of data) {
      totalCost += this.cost(dataPoint);
    }
    return totalCost / data.length;
  }

  applyAllGradients(learningRate) {
    for (let layer of this.layers) {
      layer.applyGradients(learningRate);
    }
  }

  learn(trainingData, learningRate) {
    let h = 0.0001;
    let originalCost = this.totalCost(trainingData);

    for (let layer of this.layers) {
      // calculate the cost gradient for the current weights
      for (let nodeIn = 0; nodeIn < layer.numNodesIn; nodeIn++) {
        for (let nodeOut = 0; nodeOut < layer.numNodesOut; nodeOut++) {
          layer.weights[nodeIn][nodeOut] += h;
          let detailCost = this.totalCost(trainingData) - originalCost;
          layer.weights[nodeIn][nodeOut] -= h;
          layer.costGradientW[nodeIn][nodeOut] = detailCost / h;
        }
      }

      // calculate the cost gradient for the current biases
      for (let biasIndex = 0; biasIndex < layer.numNodesOut; biasIndex++) {
        layer.biases[biasIndex] += h;
        let detailCost = this.totalCost(trainingData) - originalCost;
        layer.biases[biasIndex] -= h;
        layer.costGradientB[biasIndex] = detailCost / h;
      }
    }

    this.applyAllGradients(learningRate);
  }
}
