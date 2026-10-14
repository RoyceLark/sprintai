document.addEventListener('DOMContentLoaded', () => {
  const calculator = new CalculatorLib.Calculator();
  const display = document.querySelector('.display');
  const buttons = document.querySelectorAll('.key');
  const operators = ['+', '-', '×', '÷'];

  function updateDisplay() {
    display.textContent = calculator.getDisplayValue();
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const { digit, action } = button.dataset;

      if (digit !== undefined) {
        calculator.inputDigit(digit);
      } else if (action === 'decimal') {
        calculator.inputDecimal();
      } else if (action === 'clear') {
        calculator.clear();
      } else if (action === 'equals') {
        calculator.equals();
      } else if (action === 'sign') {
        calculator.toggleSign();
      } else if (action === 'percent') {
        calculator.percent();
      } else if (operators.includes(action)) {
        calculator.chooseOperator(action);
      }

      updateDisplay();
    });
  });

  updateDisplay();
});
