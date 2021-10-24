export const PATH_STR = {
  A: "6u1r1u1r1u1r1d1r1d1r3d4l1d4r3d",
};

export const DIR = {
  UP: "u",
  DOWN: "d",
  LEFT: "l",
  RIGHT: "r",
};

export function readPathStr(pathStr) {
  let result = [];

  for (let i = 0; i < pathStr.length; i += 2) {
    let count = Number.parseInt(pathStr[i]);

    for (let c = 0; c < count; c++) {
      result.push(pathStr[i + 1]);
    }
  }

  return result;
}

console.log(readPathStr(PATH_STR.A));
