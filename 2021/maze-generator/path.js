export const PATH = {
  A: "6u1r1u1r1u1r1d1r1d1r3d4l1d4r3d",
};

export const DIR = {
  UP: "u",
  DOWN: "d",
  LEFT: "l",
  RIGHT: "r",
};

export function readPath(path) {
  let result = [];

  for (let i = 0; i < path.length; i += 2) {
    let count = Number.parseInt(path[i]);

    for (let c = 0; c < count; c++) {
      result.push(path[i + 1]);
    }
  }

  return result;
}

console.log(readPath(PATH.A));
