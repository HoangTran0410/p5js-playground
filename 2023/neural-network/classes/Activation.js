export class Sigmoid {
  static activate(x) {
    return 1 / (1 + Math.exp(-x));
  }

  static derivative(x) {
    return x * (1 - x);
  }
}

export class TanH {
  static activate(x) {
    let e2 = Math.exp(2 * x);
    return (e2 - 1) / (e2 + 1);
  }

  static derivative(x) {
    let e2 = Math.exp(2 * x);
    let t = (e2 - 1) / (e2 + 1);
    return 1 - t * t;
  }
}

export class ReLU {
  static activate(x) {
    return Math.max(0, x);
  }

  static derivative(x) {
    return x > 0 ? 1 : 0;
  }
}

export class SiLU {
  static activate(x) {
    return x / (1 + Math.exp(-x));
  }

  static derivative(x) {
    let sig = 1 / (1 + Math.exp(-x));
    return x * sig * (1 - sig) + sig;
  }
}
