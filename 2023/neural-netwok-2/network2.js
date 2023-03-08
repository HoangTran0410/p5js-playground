class Layer {
  constructor(inputNodes, outputNodes, activationFunction) {
    this.inputNodes = inputNodes;
    this.outputNodes = outputNodes;
    this.activationFunction = activationFunction;

    this.weightMatrix = math.random([outputNodes, inputNodes]);
    this.biasMatrix = math.random([outputNodes, 1]);
  }

  forwardPropagation(inputMatrix) {
    this.inputMatrix = inputMatrix;
    this.weightedSumMatrix = math.add(
      math.multiply(this.weightMatrix, this.inputMatrix),
      this.biasMatrix
    );
    this.outputMatrix = math.map(
      this.weightedSumMatrix,
      this.activationFunction
    );
    return this.outputMatrix;
  }

  backwardPropagation(outputErrorMatrix, learningRate) {
    const gradientMatrix = math.map(
      this.weightedSumMatrix,
      this.activationFunction.derivative
    );
    const deltaMatrix = math.dotMultiply(outputErrorMatrix, gradientMatrix);
    const inputMatrixTransposed = math.transpose(this.inputMatrix);
    const weightDeltaMatrix = math.multiply(deltaMatrix, inputMatrixTransposed);
    const biasDeltaMatrix = deltaMatrix;

    const outputErrorMatrixTransposed = math.transpose(outputErrorMatrix);
    const weightMatrixTransposed = math.transpose(this.weightMatrix);
    const inputErrorMatrix = math.multiply(weightMatrixTransposed, deltaMatrix);

    this.weightMatrix = math.subtract(
      this.weightMatrix,
      math.multiply(learningRate, weightDeltaMatrix)
    );
    this.biasMatrix = math.subtract(
      this.biasMatrix,
      math.multiply(learningRate, biasDeltaMatrix)
    );

    return inputErrorMatrix;
  }
}

export default class NeuralNetwork {
  constructor(layerSizes, learningRate, activationFunction) {
    this.learningRate = learningRate;

    this.layers = [];
    for (let i = 0; i < layerSizes.length - 1; i++) {
      const layer = new Layer(
        layerSizes[i],
        layerSizes[i + 1],
        activationFunction
      );
      this.layers.push(layer);
    }
  }

  predict(inputArray) {
    let inputMatrix = math.matrix(inputArray);

    for (let i = 0; i < this.layers.length; i++) {
      inputMatrix = this.layers[i].forwardPropagation(inputMatrix);
    }

    return inputMatrix.toArray();
  }

  train(inputArray, targetArray) {
    let inputMatrix = math.matrix(inputArray);
    let targetMatrix = math.matrix(targetArray);

    let outputMatrix = inputMatrix;
    let outputMatrices = [outputMatrix];

    for (let i = 0; i < this.layers.length; i++) {
      outputMatrix = this.layers[i].forwardPropagation(outputMatrix);
      outputMatrices.push(outputMatrix);
    }

    let errorMatrix = math.subtract(targetMatrix, outputMatrix);
    let errorMatrices = [errorMatrix];

    for (let i = this.layers.length - 1; i >= 0; i--) {
      errorMatrix = this.layers[i].backwardPropagation(
        errorMatrix,
        this.learningRate
      );
      errorMatrices.push(errorMatrix);
    }

    errorMatrices.pop();

    return {
      error: errorMatrix.toArray(),
      output: outputMatrix.toArray(),
      outputMatrices: outputMatrices.map((matrix) => matrix.toArray()),
      errorMatrices: errorMatrices.map((matrix) => matrix.toArray()),
    };
  }
}
