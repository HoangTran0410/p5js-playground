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
};

window.draw = () => {
  background(30);

  // draw training data
  stroke(255);
  strokeWeight(1);
  for (let i = 0; i < trainingData.inputs.length; i++) {
    let x = map(trainingData.inputs[i][0], -graphSize, graphSize, 0, width);
    let y = map(trainingData.inputs[i][1], -graphSize, graphSize, height, 0);
    if (trainingData.targets[i] === 0) {
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
  text(`Loss: ${loss}`, 10, 20);

  // // draw correct count
  let correctCount = 0;
  for (let i = 0; i < trainingData.inputs.length; i++) {
    let predicted = neuralNetwork.classify(trainingData.inputs[i]);
    let expected = trainingData.targets[i];
    if (predicted == expected) {
      correctCount++;
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

    this.outputsCache = null;
  }

  feedForward(inputs) {
    let outputs = inputs;
    for (const layer of this.layers) {
      outputs = layer.feedForward(outputs);
    }
    return outputs;
  }

  classify(inputs) {
    let outputs = this.feedForward(inputs);
    return outputs.indexOf(Math.max(...outputs));
  }

  loss(inputs, targets) {
    let loss = 0;
    for (let i = 0; i < inputs.length; i++) {
      let outputs = this.feedForward(inputs[i]);
      loss += this.lossFunction.activate(outputs, targets[i]);
    }
    return loss / inputs.length;
  }
}

class Layer {
  constructor(numInputs, numOutputs, activationFunction) {
    this.numInputs = numInputs;
    this.numOutputs = numOutputs;
    this.activationFunction = activationFunction;

    this.weights = [];
    this.biases = [];

    // initialize the weights and biases
    for (let i = 0; i < numOutputs; i++) {
      this.weights.push([]);
      for (let j = 0; j < numInputs; j++) {
        this.weights[i].push(random(-1, 1));
      }
      this.biases.push(random(-1, 1));
    }
  }

  feedForward(inputs) {
    this.inputs = inputs;
    this.outputs = [];

    for (let i = 0; i < this.numOutputs; i++) {
      let sum = 0;
      for (let j = 0; j < this.numInputs; j++) {
        sum += this.weights[i][j] * inputs[j];
      }
      sum += this.biases[i];
      this.outputs.push(this.activationFunction.activate(sum));
    }

    return this.outputs;
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
      const sigmoidX = ActivationFunction.sigmoid.activate(x);
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
      const tanhX = ActivationFunction.tanh.activate(x);
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
      const softmaxX = ActivationFunction.softmax.activate(x);
      return softmaxX.map((val) => val * (1 - val));
    },
  };
}

class LossFunction {
  // Mean Squared Error (MSE): This loss function is used for regression problems,
  // where the output is a continuous value. The MSE computes the average of
  // the squared differences between the predicted output and the actual output.
  static MeanSquaredError = {
    activate: (predicted, actual) => {
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
    activate: (predicted, actual) => {
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
    activate: (predicted, actual) => {
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
    activate: (predicted, actual) => {
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
