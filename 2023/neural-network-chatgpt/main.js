import data from "./data.json" assert { type: "json" };

let neuralNetwork, trainingData;
let graphSize = 30;

window.setup = () => {
  createCanvas(400, 400);
  pixelDensity(1);

  neuralNetwork = new NeuralNetwork(
    [2, 3, 2],
    ActivationFunction.Sigmoid,
    LossFunction.MeanSquaredError
  );

  trainingData = {
    inputs: data.map((d) => d.inputs),
    targets: data.map((d) => (d.label == 1 ? [0, 1] : [1, 0])),
  };

  // train the neural network
  neuralNetwork.train(trainingData.inputs, trainingData.targets, {
    epochs: 1,
    learningRate: 0.1,
  });
};

function classifyOutput(output) {
  return output.indexOf(Math.max(...output));
}

window.draw = () => {
  background(30);

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
      let output = neuralNetwork.feedForward([graphX, graphY]);
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
  let loss = neuralNetwork.loss(trainingData.inputs, trainingData.targets);
  fill(255);
  noStroke();
  textSize(16);
  text(`Loss: ${loss.toFixed(5)}`, 10, 20);

  // // draw correct count
  let correctCount = 0;
  for (let i = 0; i < trainingData.inputs.length; i++) {
    let input = trainingData.inputs[i];
    let output = neuralNetwork.feedForward(input);

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
  text(`Correct: ${correctCount}`, 10, 40);
};

class NeuralNetwork {
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

  feedForward(inputs) {
    let outputs = inputs;
    for (const layer of this.layers) {
      outputs = layer.feedForward(outputs);
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
  constructor(numInputs, numOutputs, activationFunction) {
    this.numInputs = numInputs;
    this.numOutputs = numOutputs;
    this.activationFunction = activationFunction;

    this.weights = [];
    this.biases = [];

    this.initializeWeightsAndBiases();
  }

  initializeWeightsAndBiases() {
    for (let i = 0; i < this.numOutputs; i++) {
      this.biases[i] = 0;
      this.weights[i] = [];
      for (let j = 0; j < this.numInputs; j++) {
        this.weights[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  feedForward(inputs) {
    let outputs = [];

    for (let i = 0; i < this.numOutputs; i++) {
      let sum = 0;
      for (let j = 0; j < this.numInputs; j++) {
        sum += this.weights[i][j] * inputs[j];
      }
      sum += this.biases[i];
      outputs.push(this.activationFunction.activate(sum));
    }

    return outputs;
  }

  backpropagate(errors, learningRate, inputs) {
    // calculate the new errors
    let newErrors = [];
    for (let i = 0; i < this.numInputs; i++) {
      let sum = 0;
      for (let j = 0; j < this.numOutputs; j++) {
        sum += this.weights[j][i] * errors[j];
      }
      newErrors[i] = sum;
    }

    // update the weights and biases
    for (let i = 0; i < this.numOutputs; i++) {
      for (let j = 0; j < this.numInputs; j++) {
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

class ActivationFunction {
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

class LossFunction {
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
