import * as f from "./main.js";

for (let key in f) {
  window[key] = f[key];
}
