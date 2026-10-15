// Core calculator logic, kept separate from the DOM so it can be unit tested.
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Calculator = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  class Calculator {
    constructor() {
      this.clear();
    }

    clear() {
      this.currentOperand = '';
      this.previousOperand = '';
      this.operation = undefined;
    }

    delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
      number = number.toString();
      if (number === '.' && this.currentOperand.includes('.')) return;
      if (this.currentOperand === 'Error') this.currentOperand = '';
      this.currentOperand = this.currentOperand.toString() + number;
    }

    chooseOperation(operation) {
      if (this.currentOperand === '' || this.currentOperand === 'Error') return;
      if (this.previousOperand !== '') {
        this.compute();
      }
      this.operation = operation;
      this.previousOperand = this.currentOperand;
      this.currentOperand = '';
    }

    compute() {
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      if (isNaN(prev) || isNaN(current)) return;

      let result;
      switch (this.operation) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          if (current === 0) {
            this.currentOperand = 'Error';
            this.previousOperand = '';
            this.operation = undefined;
            return;
          }
          result = prev / current;
          break;
        case '%':
          result = (prev * current) / 100;
          break;
        default:
          return;
      }

      this.currentOperand = result.toString();
      this.operation = undefined;
      this.previousOperand = '';
    }
  }

  return Calculator;
});
