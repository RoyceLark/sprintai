const Calculator = require('../calculator');

describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  test('starts cleared', () => {
    expect(calculator.currentOperand).toBe('');
    expect(calculator.previousOperand).toBe('');
    expect(calculator.operation).toBeUndefined();
  });

  test('appends numbers to the current operand', () => {
    calculator.appendNumber('5');
    calculator.appendNumber('3');
    expect(calculator.currentOperand).toBe('53');
  });

  test('does not allow more than one decimal point', () => {
    calculator.appendNumber('1');
    calculator.appendNumber('.');
    calculator.appendNumber('2');
    calculator.appendNumber('.');
    calculator.appendNumber('5');
    expect(calculator.currentOperand).toBe('1.25');
  });

  test('adds two numbers', () => {
    calculator.appendNumber('5');
    calculator.chooseOperation('+');
    calculator.appendNumber('3');
    calculator.compute();
    expect(calculator.currentOperand).toBe('8');
  });

  test('subtracts two numbers', () => {
    calculator.appendNumber('10');
    calculator.chooseOperation('-');
    calculator.appendNumber('4');
    calculator.compute();
    expect(calculator.currentOperand).toBe('6');
  });

  test('multiplies two numbers', () => {
    calculator.appendNumber('6');
    calculator.chooseOperation('*');
    calculator.appendNumber('7');
    calculator.compute();
    expect(calculator.currentOperand).toBe('42');
  });

  test('divides two numbers', () => {
    calculator.appendNumber('9');
    calculator.chooseOperation('/');
    calculator.appendNumber('3');
    calculator.compute();
    expect(calculator.currentOperand).toBe('3');
  });

  test('handles decimal division results', () => {
    calculator.appendNumber('1');
    calculator.chooseOperation('/');
    calculator.appendNumber('4');
    calculator.compute();
    expect(calculator.currentOperand).toBe('0.25');
  });

  test('shows an error on divide by zero instead of Infinity/NaN', () => {
    calculator.appendNumber('5');
    calculator.chooseOperation('/');
    calculator.appendNumber('0');
    calculator.compute();
    expect(calculator.currentOperand).toBe('Error');
    expect(calculator.previousOperand).toBe('');
    expect(calculator.operation).toBeUndefined();
  });

  test('computes chained operations left to right', () => {
    calculator.appendNumber('5');
    calculator.chooseOperation('+');
    calculator.appendNumber('3');
    calculator.chooseOperation('*');
    calculator.appendNumber('2');
    calculator.compute();
    expect(calculator.currentOperand).toBe('16');
  });

  test('delete removes the last character of the current operand', () => {
    calculator.appendNumber('1');
    calculator.appendNumber('2');
    calculator.appendNumber('3');
    calculator.delete();
    expect(calculator.currentOperand).toBe('12');
  });

  test('clear resets all state', () => {
    calculator.appendNumber('9');
    calculator.chooseOperation('+');
    calculator.appendNumber('1');
    calculator.clear();
    expect(calculator.currentOperand).toBe('');
    expect(calculator.previousOperand).toBe('');
    expect(calculator.operation).toBeUndefined();
  });

  test('typing a number after an error starts a fresh entry', () => {
    calculator.appendNumber('5');
    calculator.chooseOperation('/');
    calculator.appendNumber('0');
    calculator.compute();
    calculator.appendNumber('7');
    expect(calculator.currentOperand).toBe('7');
  });
});
