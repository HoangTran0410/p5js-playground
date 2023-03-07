import NeuralNetwork from "./network.js";

const network = new NeuralNetwork([2, 2, 1]);

for (let i = 0; i < 1; i++) {
  network.train([0, 0], [0]);
  network.train([0, 1], [1]);
  network.train([1, 0], [1]);
  network.train([1, 1], [0]);
}

console.log(network.predict([1, 1]));
// console.log(network.loss([1, 1], [0]));
