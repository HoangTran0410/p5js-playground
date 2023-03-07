const net = new brain.NeuralNetwork();
net.train([
  { input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 } },
  { input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 } },
  { input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 } },
]);

const output = net.run({ r: 1, g: 0.4, b: 0 });
console.log(`Prob:`, output);

let a = net.toFunction();
let b = net.toJSON();

console.log(a.toString(), b);

document.getElementById("result").innerHTML = brain.utilities.toSVG(net, {});
