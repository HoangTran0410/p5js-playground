export default class NeuralNetwork {
  constructor(layerSizes, activationFunction, lossFunction) {
    this.activationFunction = activationFunction;
    this.lossFunction = lossFunction;

    this.layers = [];
    for (let i = 0; i < layerSizes.length - 1; i++) {
      this.layers.push(
        new Layer(layerSizes[i], layerSizes[i + 1], activationFunction)
      );
    }
  }

  static feedForward(inputs, network) {
    let outputs = inputs;
    for (const layer of network.layers) {
      outputs = Layer.feedForward(outputs, layer);
    }
    return outputs;
  }

  loss(inputs, targets) {
    let loss = 0;
    for (let i = 0; i < inputs.length; i++) {
      let outputs = this.feedForward(inputs[i]);
      loss += this.lossFunction.calculate(outputs, targets[i]);
    }
    return loss / inputs.length;
  }

  static splitTrainTest(inputs, targets, trainPercentage) {
    let trainingData = {
      inputs: [],
      targets: [],
    };
    let testingData = {
      inputs: [],
      targets: [],
    };

    for (let i = 0; i < inputs.length; i++) {
      if (random() < trainPercentage) {
        trainingData.inputs.push(inputs[i]);
        trainingData.targets.push(targets[i]);
      } else {
        testingData.inputs.push(inputs[i]);
        testingData.targets.push(targets[i]);
      }
    }

    return [trainingData, testingData];
  }

  trainBatch(inputs, targets, learningRate) {
    let outputs = this.feedForward(inputs);

    for (let layer of this.layers) {
    }
  }

  train(inputs, targets, options) {
    options = {
      learningRate: 0.1,
      epochs: 1,
      batchSize: 1,
      trainPercentage: 0.8,
      ...options,
    };

    let [trainingData, testingData] = NeuralNetwork.splitTrainTest(
      inputs,
      targets,
      options.trainPercentage
    );

    for (let epoch = 0; epoch < options.epochs; epoch++) {
      for (let i = 0; i < trainingData.inputs.length; i += options.batchSize) {
        let inputsBatch = trainingData.inputs.slice(i, i + options.batchSize);
        let targetsBatch = trainingData.targets.slice(i, i + options.batchSize);

        this.trainBatch(inputsBatch, targetsBatch, options.learningRate);
      }

      let loss = this.loss(testingData.inputs, testingData.targets);
      console.log(`Epoch ${epoch}: loss = ${loss}`);
    }
  }
}

class Layer {
  constructor(inputCount, outputCount, activationFunction) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.activationFunction = activationFunction;

    this.weights = new Array(outputCount);
    this.biases = new Array(outputCount);

    Layer.randomize(this);
  }

  static randomize(layer) {
    for (let i = 0; i < layer.outputs.length; i++) {
      layer.biases[i] = 0;
      layer.weights[i] = new Array(layer.inputs.length);
      for (let j = 0; j < layer.inputs.length; j++) {
        layer.weights[i][j] = Math.random() * 2 - 1;
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

  backpropagate(errors, learningRate, inputs) {
    // calculate the new errors
    let newErrors = [];
    for (let i = 0; i < this.inputCount; i++) {
      let sum = 0;
      for (let j = 0; j < this.outputCount; j++) {
        sum += this.weights[j][i] * errors[j];
      }
      newErrors[i] = sum;
    }

    // update the weights and biases
    for (let i = 0; i < this.outputCount; i++) {
      for (let j = 0; j < this.inputCount; j++) {
        this.weights[i][j] -=
          learningRate *
          errors[i] *
          this.activationFunction.derivative(inputs[j]);
      }
      this.biases[i] -= learningRate * errors[i];
    }

    return newErrors;
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
      let sum = 0;
      for (let i = 0; i < predicted.length; i++) {
        sum += Math.pow(predicted[i] - actual[i], 2);
      }
      return sum / predicted.length;
    },
    derivative: (predicted, actual) => {
      let sum = 0;
      for (let i = 0; i < predicted.length; i++) {
        sum += 2 * (predicted[i] - actual[i]);
      }
      return sum / predicted.length;
    },
  };

  // Cross-Entropy Loss: This loss function is commonly used in classification problems,
  // where the output is a probability distribution over several classes.
  // The cross-entropy loss measures the difference between the predicted
  // probability distribution and the actual distribution.
  static CrossEntropyLoss = {
    calculate: (predicted, actual) => {
      let loss = 0;
      for (let i = 0; i < predicted.length; i++) {
        loss += actual[i] * Math.log(predicted[i]);
      }
      return -loss;
    },
    derivative: (predicted, actual) => {
      let loss = 0;
      for (let i = 0; i < predicted.length; i++) {
        loss += actual[i] / predicted[i] - (1 - actual[i]) / (1 - predicted[i]);
      }
      return loss;
    },
  };

  // Binary Cross-Entropy Loss: This is a special case of the cross-entropy loss
  // used for binary classification problems, where the output is either 0 or 1.
  static BinaryCrossEntropyLoss = {
    calculate: (predicted, actual) => {
      return (
        -actual * Math.log(predicted) - (1 - actual) * Math.log(1 - predicted)
      );
    },
    derivative: (predicted, actual) => {
      return (predicted - actual) / (predicted * (1 - predicted));
    },
  };

  // Categorical Cross-Entropy Loss: This is a variant of the cross-entropy loss
  // used for multiclass classification problems, where the output is a probability distribution over several classes.
  static CategoricalCrossEntropyLoss = {
    calculate: (predicted, actual) => {
      let loss = 0;
      for (let i = 0; i < predicted.length; i++) {
        loss += actual[i] * Math.log(predicted[i]);
      }
      return -loss;
    },
    derivative: (predicted, actual) => {
      let loss = 0;
      for (let i = 0; i < predicted.length; i++) {
        loss += actual[i] / predicted[i];
      }
      return -loss;
    },
  };
}
