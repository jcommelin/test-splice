// Example JavaScript file
function greet(name) {
  console.log("Hello, " + name);
}

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// New feature: subtract
function subtract(a, b) {
  return a - b;
}

// New feature: divide
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

module.exports = { greet, add, multiply, subtract, divide };
