class NeuralNetwork {
  constructor(
    inputNodes,
    hiddenNodes,
    outputNodes,
    learningRate,
    epochs,
    hiddenLayers
  ) {
    this.inputNodes = inputNodes;
    this.hiddenNodes = hiddenNodes;
    this.outputNodes = outputNodes;
    this.learningRate = learningRate;
    this.epochs = epochs;
    this.hiddenLayers = hiddenLayers;
    this.inputMatrix = math.zeros(inputNodes, 1);
    this.outputMatrix = math.zeros(outputNodes, 1);
    this.weightMatrices = [];

    // initialize weight matrices for each hidden layer
    for (let i = 0; i < hiddenLayers.length; i++) {
      const inputSize = hiddenLayers[i - 1] || inputNodes;
      const outputSize = hiddenLayers[i];
      const weightMatrix = math.random([outputSize, inputSize], -1, 1);
      this.weightMatrices.push(weightMatrix);
    }

    // initialize weight matrix for output layer
    const outputWeightMatrix = math.random(
      [outputNodes, hiddenLayers[hiddenLayers.length - 1]],
      -1,
      1
    );
    this.weightMatrices.push(outputWeightMatrix);
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  forwardPropagation() {
    let hiddenMatrix = this.inputMatrix;

    // calculate hidden layers
    for (let i = 0; i < this.weightMatrices.length - 1; i++) {
      hiddenMatrix = math.multiply(this.weightMatrices[i], hiddenMatrix);
      hiddenMatrix = math.map(hiddenMatrix, this.sigmoid);
    }

    // calculate output layer
    this.outputMatrix = math.multiply(
      this.weightMatrices[this.weightMatrices.length - 1],
      hiddenMatrix
    );
    this.outputMatrix = math.map(this.outputMatrix, this.sigmoid);
  }

  backPropagation(target) {
    let hiddenMatrices = [this.inputMatrix];

    // calculate hidden layers
    for (let i = 0; i < this.weightMatrices.length - 1; i++) {
      const hiddenMatrix = math.multiply(
        this.weightMatrices[i],
        hiddenMatrices[i]
      );
      const sigmoidMatrix = math.map(hiddenMatrix, this.sigmoid);
      hiddenMatrices.push(sigmoidMatrix);
    }

    // calculate output layer
    const outputError = math.subtract(target, this.outputMatrix);
    const outputDelta = math.dotMultiply(
      outputError,
      math.dotMultiply(this.outputMatrix, math.subtract(1, this.outputMatrix))
    );
    const hiddenError = math.multiply(
      math.transpose(this.weightMatrices[this.weightMatrices.length - 1]),
      outputDelta
    );
    let hiddenDeltas = [hiddenError];

    // calculate hidden deltas

    for (let i = this.weightMatrices.length - 2; i >= 0; i--) {
      const delta = math.dotMultiply(
        hiddenDeltas[hiddenDeltas.length - 1],
        math.dotMultiply(
          hiddenMatrices[i + 1],
          math.subtract(1, hiddenMatrices[i + 1])
        )
      );
      const hiddenDelta = math.multiply(
        math.transpose(this.weightMatrices[i]),
        delta
      );
      hiddenDeltas.push(hiddenDelta);
    }

    // update weight matrices
    for (let i = this.weightMatrices.length - 1; i >= 0; i--) {
      const gradient = math.multiply(
        outputDelta,
        math.transpose(hiddenMatrices[hiddenMatrices.length - 1])
      );
      const weightDelta = math.multiply(this.learningRate, gradient);
      this.weightMatrices[i] = math.add(this.weightMatrices[i], weightDelta);
    }

    for (let i = this.weightMatrices.length - 2; i >= 0; i--) {
      const gradient = math.multiply(
        hiddenDeltas[hiddenDeltas.length - 1 - i],
        math.transpose(hiddenMatrices[hiddenMatrices.length - 2 - i])
      );
      const weightDelta = math.multiply(this.learningRate, gradient);
      this.weightMatrices[i] = math.add(this.weightMatrices[i], weightDelta);
    }
  }

  train(inputData, targetData) {
    for (let i = 0; i < this.epochs; i++) {
      for (let j = 0; j < inputData.length; j++) {
        this.inputMatrix = math.reshape(inputData[j], [this.inputNodes, 1]);
        const targetMatrix = math.reshape(targetData[j], [this.outputNodes, 1]);
        this.forwardPropagation();
        this.backPropagation(targetMatrix);
      }
    }
  }

  predict(inputData) {
    const prediction = [];
    for (let i = 0; i < inputData.length; i++) {
      const inputMatrix = math.reshape(inputData[i], [this.inputNodes, 1]);
      this.inputMatrix = inputMatrix;
      this.forwardPropagation();
      prediction.push(this.outputMatrix.toArray());
    }
    return prediction;
  }
}
