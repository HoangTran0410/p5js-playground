export default class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(rows)
      .fill()
      .map(() => Array(cols).fill(0));
  }

  static fromArray(arr) {
    const m = new Matrix(arr.length, 1);
    for (let i = 0; i < arr.length; i++) {
      m.data[i][0] = arr[i];
    }
    return m;
  }

  toArray() {
    const arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize(min, max) {
    return this.map(() => Math.random() * (max - min) + min);
  }

  map(func) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = func(this.data[i][j], i, j);
      }
    }
    return this;
  }

  add(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        throw new Error("Cannot add matrices of different sizes");
      }
      return this.map((el, i, j) => el + n.data[i][j]);
    } else {
      return this.map((el) => el + n);
    }
  }

  subtract(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        throw new Error("Cannot subtract matrices of different sizes");
      }
      return this.map((el, i, j) => el - n.data[i][j]);
    } else {
      return this.map((el) => el - n);
    }
  }

  // dot
  multiply(n) {
    if (n instanceof Matrix) {
      if (this.cols !== n.rows) {
        throw new Error("Cannot multiply matrices of different sizes");
      }
      const result = new Matrix(this.rows, n.cols);
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < n.cols; j++) {
          let sum = 0;
          for (let k = 0; k < this.cols; k++) {
            sum += this.data[i][k] * n.data[k][j];
          }
          result.data[i][j] = sum;
        }
      }
      return result;
    } else {
      return this.map((el) => el * n);
    }
  }

  transpose() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < i; j++) {
        const temp = this.data[i][j];
        this.data[i][j] = this.data[j][i];
        this.data[j][i] = temp;
      }
    }
  }

  clone() {
    return new Matrix(this.rows, this.cols).map((_, i, j) => this.data[i][j]);
  }
}
