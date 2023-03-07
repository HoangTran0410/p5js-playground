export default class NeuralNetwork {
  constructor(layerSizes, activationFunction, lossFunction) {
    this.layerSizes = layerSizes;
    this.lossFunction = lossFunction;
    this.activationFunction = activationFunction;

    this.layers = [];
    for (let i = 0; i < layerSizes.length - 1; i++) {
      this.layers.push(
        new Layer(layerSizes[i], layerSizes[i + 1], activationFunction)
      );
    }
  }

  static classify(inputs, network) {
    let outputs = NeuralNetwork.feedForward(inputs, network);
    return {
      predicted: outputs.indexOf(Math.max(...outputs)),
      outputs: outputs,
    };
  }

  static randomize(network) {
    for (const layer of network.layers) {
      Layer.randomize(layer);
    }
  }

  static feedForward(inputs, network) {
    let outputs = inputs;
    for (const layer of network.layers) {
      outputs = Layer.feedForward(outputs, layer);
    }
    return outputs;
  }

  learn(inputs, targets, network, learningRate) {}

  static loss(inputs, targets, network) {
    let loss = 0;
    for (let i = 0; i < inputs.length; i++) {
      let outputs = NeuralNetwork.feedForward(inputs[i], network);
      for (let j = 0; j < outputs.length; j++) {
        loss += network.lossFunction.calculate(outputs[j], targets[i][j]);
      }
    }
    return loss / inputs.length;
  }
}

class Layer {
  constructor(inputCount, outputCount, activationFunction) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);

    this.weights = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.activationFunction = activationFunction;

    Layer.randomize(this);
  }

  static randomize(layer) {
    for (let i = 0; i < layer.outputs.length; i++) {
      layer.biases[i] = 0;
      layer.weights[i] = new Array(layer.inputs.length);
      for (let j = 0; j < layer.inputs.length; j++) {
        layer.weights[i][j] =
          (Math.random() * 2 - 1) / Math.sqrt(layer.inputs.length);
      }
    }
  }

  static feedForward(inputs, layer) {
    for (let i = 0; i < layer.inputs.length; i++) {
      layer.inputs[i] = inputs[i];
    }

    for (let i = 0; i < layer.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < layer.inputs.length; j++) {
        sum += layer.weights[i][j] * layer.inputs[j];
      }
      sum += layer.biases[i];
      layer.outputs[i] = layer.activationFunction.activate(sum);
    }

    return layer.outputs;
  }
}

export class ActivationFunction {
  // Sigmoid function:
  // The sigmoid function maps any input value to a value between 0 and 1,
  // which makes it useful for binary classification tasks.
  static Sigmoid = {
    activate: (x) => {
      return 1 / (1 + Math.exp(-x));
    },
    derivative: (x) => {
      const sigmoidX = ActivationFunction.Sigmoid.activate(x);
      return sigmoidX * (1 - sigmoidX);
    },
  };

  // Hyperbolic tangent (tanh) function:
  // The tanh function maps any input value to a value between -1 and 1,
  // which makes it useful for tasks where negative values are important.
  static Tanh = {
    activate: (x) => {
      return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
    },
    derivative: (x) => {
      const tanhX = ActivationFunction.Tanh.activate(x);
      return 1 - tanhX * tanhX;
    },
  };

  // Rectified Linear Unit (ReLU) function:
  // The ReLU function maps any negative input value to 0, while preserving positive input values.
  // This makes it computationally efficient and effective in deep neural networks.
  static ReLU = {
    activate: (x) => {
      return Math.max(0, x);
    },
    derivative: (x) => {
      return x < 0 ? 0 : 1;
    },
  };

  // Leaky ReLU function:
  // The Leaky ReLU function is a modified version of the ReLU function that allows for
  // small negative input values to be preserved. This can improve the performance of deep neural networks.
  static LeakyReLU = {
    activate: (x, alpha) => {
      return x < 0 ? alpha * x : x;
    },
    derivative: (x, alpha) => {
      return x < 0 ? alpha : 1;
    },
  };

  // Softmax function:
  // The softmax function is used to map a vector of values to a probability distribution.
  // This is useful for classification tasks, where the output is a probability distribution over several classes.
  static Softmax = {
    activate: (x) => {
      const exps = x.map(Math.exp);
      const sumExps = exps.reduce((acc, val) => acc + val, 0);
      return exps.map((val) => val / sumExps);
    },
    derivative: (x) => {
      const softmaxX = ActivationFunction.Softmax.activate(x);
      return softmaxX.map((val) => val * (1 - val));
    },
  };
}

export class LossFunction {
  // Mean Squared Error (MSE): This loss function is used for regression problems,
  // where the output is a continuous value. The MSE computes the average of
  // the squared differences between the predicted output and the actual output.
  static MeanSquaredError = {
    calculate: (predicted, actual) => {
      return Math.pow(predicted - actual, 2);
    },
    derivative: (predicted, actual) => {
      return 2 * (predicted - actual);
    },
  };
}
