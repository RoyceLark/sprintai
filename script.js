// DOM wiring for the calculator UI. Core logic lives in calculator.js.
(function () {
  const numberButtons = document.querySelectorAll('[data-number]');
  const operationButtons = document.querySelectorAll('[data-operation]');
  const equalsButton = document.querySelector('[data-equals]');
  const deleteButton = document.querySelector('[data-delete]');
  const allClearButton = document.querySelector('[data-all-clear]');
  const previousOperandTextElement = document.querySelector('[data-previous-operand]');
  const currentOperandTextElement = document.querySelector('[data-current-operand]');

  const calculator = new Calculator();

  function updateDisplay() {
    currentOperandTextElement.innerText = calculator.currentOperand || '0';
    if (calculator.operation != null) {
      previousOperandTextElement.innerText = `${calculator.previousOperand} ${calculator.operation}`;
    } else {
      previousOperandTextElement.innerText = calculator.previousOperand;
    }
  }

  numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText);
      updateDisplay();
    });
  });

  operationButtons.forEach((button) => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText);
      updateDisplay();
    });
  });

  equalsButton.addEventListener('click', () => {
    calculator.compute();
    updateDisplay();
  });

  allClearButton.addEventListener('click', () => {
    calculator.clear();
    updateDisplay();
  });

  deleteButton.addEventListener('click', () => {
    calculator.delete();
    updateDisplay();
  });
})();
