// Calculator module

class Calculator {
  constructor() {
    this.result = 0;
    this.history = [];
  }

  add(a, b) {
    const result = a + b;
    this.history.push(`${a} + ${b} = ${result}`);
    return result;
  }

  subtract(a, b) {
    const result = a - b;
    this.history.push(`${a} - ${b} = ${result}`);
    return result;
  }

  multiply(a, b) {
    const result = a * b;
    this.history.push(`${a} * ${b} = ${result}`);
    return result;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    const result = a / b;
    this.history.push(`${a} / ${b} = ${result}`);
    return result;
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}

module.exports = Calculator;
