import * as f from "./js/main.js";

for (let key in f) {
  window[key] = f[key];
}
