// Calculator module
// Version 2.0 - Enhanced with new operations

class Calculator {
  constructor(precision = 2) {
    this.result = 0;
    this.history = [];
    this.precision = precision;
  }

  add(a, b) {
    const result = a + b;
    this.history.push(`${a} + ${b} = ${result}`);
    this.result = result;
    return result;
  }

  subtract(a, b) {
    const result = a - b;
    this.history.push(`${a} - ${b} = ${result}`);
    this.result = result;
    return result;
  }

  multiply(a, b) {
    const result = a * b;
    this.history.push(`${a} * ${b} = ${result}`);
    this.result = result;
    return result;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    const result = Number((a / b).toFixed(this.precision));
    this.history.push(`${a} / ${b} = ${result}`);
    this.result = result;
    return result;
  }

  // New: Power operation
  power(base, exponent) {
    const result = Math.pow(base, exponent);
    this.history.push(`${base} ^ ${exponent} = ${result}`);
    this.result = result;
    return result;
  }

  // New: Square root
  sqrt(n) {
    if (n < 0) {
      throw new Error("Cannot calculate square root of negative number");
    }
    const result = Number(Math.sqrt(n).toFixed(this.precision));
    this.history.push(`√${n} = ${result}`);
    this.result = result;
    return result;
  }

  getHistory() {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
    this.result = 0;
  }

  getLastResult() {
    return this.result;
  }
}

module.exports = Calculator;
