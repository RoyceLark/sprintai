(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CalculatorLib = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '×':
        return firstOperand * secondOperand;
      case '÷':
        if (secondOperand === 0) {
          return 'Error';
        }
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  }

  function formatResult(value) {
    // avoid long floating point tails like 0.1 + 0.2 = 0.30000000000000004
    return `${parseFloat(value.toFixed(10))}`;
  }

  class Calculator {
    constructor() {
      this.reset();
    }

    reset() {
      this.displayValue = '0';
      this.firstOperand = null;
      this.waitingForSecondOperand = false;
      this.operator = null;
      this.error = false;
    }

    clear() {
      this.reset();
    }

    inputDigit(digit) {
      if (this.error) {
        this.reset();
      }
      if (this.waitingForSecondOperand) {
        this.displayValue = digit;
        this.waitingForSecondOperand = false;
      } else {
        this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
      }
    }

    inputDecimal() {
      if (this.error) {
        this.reset();
      }
      if (this.waitingForSecondOperand) {
        this.displayValue = '0.';
        this.waitingForSecondOperand = false;
        return;
      }
      if (!this.displayValue.includes('.')) {
        this.displayValue += '.';
      }
    }

    chooseOperator(nextOperator) {
      if (this.error) {
        return;
      }
      const inputValue = parseFloat(this.displayValue);

      if (this.operator && this.waitingForSecondOperand) {
        this.operator = nextOperator;
        return;
      }

      if (this.firstOperand === null) {
        this.firstOperand = inputValue;
      } else if (this.operator) {
        const result = calculate(this.firstOperand, inputValue, this.operator);
        if (result === 'Error') {
          this.displayValue = 'Error';
          this.error = true;
          this.firstOperand = null;
          this.operator = null;
          this.waitingForSecondOperand = false;
          return;
        }
        this.displayValue = formatResult(result);
        this.firstOperand = result;
      }

      this.waitingForSecondOperand = true;
      this.operator = nextOperator;
    }

    equals() {
      if (this.error || this.operator === null || this.waitingForSecondOperand) {
        return;
      }
      const inputValue = parseFloat(this.displayValue);
      const result = calculate(this.firstOperand, inputValue, this.operator);
      if (result === 'Error') {
        this.displayValue = 'Error';
        this.error = true;
      } else {
        this.displayValue = formatResult(result);
        this.firstOperand = result;
      }
      this.operator = null;
      this.waitingForSecondOperand = false;
    }

    toggleSign() {
      if (this.error) {
        return;
      }
      this.displayValue = formatResult(parseFloat(this.displayValue) * -1);
    }

    percent() {
      if (this.error) {
        return;
      }
      this.displayValue = formatResult(parseFloat(this.displayValue) / 100);
    }

    getDisplayValue() {
      return this.displayValue;
    }
  }

  return { Calculator, calculate };
});
