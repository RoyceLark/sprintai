const { Calculator, calculate } = require('../calculator.js');

describe('calculate', () => {
  test('adds two numbers', () => {
    expect(calculate(2, 3, '+')).toBe(5);
  });

  test('subtracts two numbers', () => {
    expect(calculate(5, 3, '-')).toBe(2);
  });

  test('multiplies two numbers', () => {
    expect(calculate(4, 3, '×')).toBe(12);
  });

  test('divides two numbers', () => {
    expect(calculate(10, 2, '÷')).toBe(5);
  });

  test('returns Error when dividing by zero', () => {
    expect(calculate(10, 0, '÷')).toBe('Error');
  });

  test('handles zero as first operand', () => {
    expect(calculate(0, 5, '+')).toBe(5);
  });
});

describe('Calculator', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  test('starts with display 0', () => {
    expect(calc.getDisplayValue()).toBe('0');
  });

  test('inputs digits and builds a number', () => {
    calc.inputDigit('5');
    calc.inputDigit('2');
    expect(calc.getDisplayValue()).toBe('52');
  });

  test('computes simple addition: 5 + 3 = 8', () => {
    calc.inputDigit('5');
    calc.chooseOperator('+');
    calc.inputDigit('3');
    calc.equals();
    expect(calc.getDisplayValue()).toBe('8');
  });

  test('computes simple subtraction: 9 - 4 = 5', () => {
    calc.inputDigit('9');
    calc.chooseOperator('-');
    calc.inputDigit('4');
    calc.equals();
    expect(calc.getDisplayValue()).toBe('5');
  });

  test('computes simple multiplication: 6 × 7 = 42', () => {
    calc.inputDigit('6');
    calc.chooseOperator('×');
    calc.inputDigit('7');
    calc.equals();
    expect(calc.getDisplayValue()).toBe('42');
  });

  test('chained operations resolve left to right: 2 + 3 × 4 = 20', () => {
    calc.inputDigit('2');
    calc.chooseOperator('+');
    calc.inputDigit('3');
    calc.chooseOperator('×');
    calc.inputDigit('4');
    calc.equals();
    expect(calc.getDisplayValue()).toBe('20');
  });

  test('clear resets display to 0', () => {
    calc.inputDigit('9');
    calc.clear();
    expect(calc.getDisplayValue()).toBe('0');
  });

  test('divide by zero shows Error instead of Infinity/NaN', () => {
    calc.inputDigit('9');
    calc.chooseOperator('÷');
    calc.inputDigit('0');
    calc.equals();
    expect(calc.getDisplayValue()).toBe('Error');
  });

  test('entering a digit after an error resets the calculator', () => {
    calc.inputDigit('9');
    calc.chooseOperator('÷');
    calc.inputDigit('0');
    calc.equals();
    calc.inputDigit('5');
    expect(calc.getDisplayValue()).toBe('5');
  });

  test('restricts input to one decimal point: 1.2.3 becomes 1.23', () => {
    calc.inputDigit('1');
    calc.inputDecimal();
    calc.inputDigit('2');
    calc.inputDecimal();
    calc.inputDigit('3');
    expect(calc.getDisplayValue()).toBe('1.23');
  });

  test('toggles the sign of the current value', () => {
    calc.inputDigit('5');
    calc.toggleSign();
    expect(calc.getDisplayValue()).toBe('-5');
    calc.toggleSign();
    expect(calc.getDisplayValue()).toBe('5');
  });

  test('percent converts the current value to a fraction', () => {
    calc.inputDigit('5');
    calc.inputDigit('0');
    calc.percent();
    expect(calc.getDisplayValue()).toBe('0.5');
  });

  test('changing operator before entering second operand replaces it', () => {
    calc.inputDigit('5');
    calc.chooseOperator('+');
    calc.chooseOperator('-');
    calc.inputDigit('2');
    calc.equals();
    expect(calc.getDisplayValue()).toBe('3');
  });
});
