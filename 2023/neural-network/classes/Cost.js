export class MeanSquaredError {
  static costFunction(predictedOutputs, expectedOutputs) {
    // cost is sum (for all x,y pairs) of: 0.5 * (x-y)^2
    let cost = 0;
    for (let i = 0; i < predictedOutputs.length; i++) {
      let error = predictedOutputs[i] - expectedOutputs[i];
      cost += error * error;
    }
    return 0.5 * cost;
  }

  static costDerivative(predictedOutput, expectedOutput) {
    return predictedOutput - expectedOutput;
  }
}

export class CrossEntropy {
  // Note: expected outputs are expected to all be either 0 or 1
  static CostFunction(predictedOutputs, expectedOutputs) {
    let cost = 0;
    for (let i = 0; i < predictedOutputs.length; i++) {
      let x = predictedOutputs[i];
      let y = expectedOutputs[i];
      let v = y == 1 ? -Math.log(x) : -Math.log(1 - x);
      cost += isNaN(v) ? 0 : v;
    }
    return cost;
  }

  static CostDerivative(predictedOutput, expectedOutput) {
    let x = predictedOutput;
    let y = expectedOutput;
    if (x == 0 || x == 1) {
      return 0;
    }
    return (-x + y) / (x * (x - 1));
  }
}
