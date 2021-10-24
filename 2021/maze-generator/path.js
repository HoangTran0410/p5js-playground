export const PATH_STR = {
  " ": "2r",
  A: "6u1r1u1r1u1r1d1r1d1r3d4l1d4r2d",
  B: "1r1u1l7u4r1d1r1d1l1d3l1d3r1d1r1d1l1d2l1d3r",
  C: "3r1u2l1u1l5u1r1u4r1d3l1d1l3d1r1d3r1d1l1d1r",
  L: "8u1r7d3r1d",
  O: "2r1u1l1u1l5u1r1u3r1d1r5d1l1d1l1d2r",
  V: "2r2u1l2u1l4u1r3d1r2d1r2u1r3u1r4d1l2d1l2d2r",
  E: "1r1u1l7u4r1d3l2d2r1d2l2d3r1d2l1d3r"
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
