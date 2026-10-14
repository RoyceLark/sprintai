# Calculator App

A simple, richly-styled calculator web application built with plain HTML, CSS and JavaScript.

## Features

- Basic arithmetic: addition, subtraction, multiplication and division
- Decimal input (restricted to one decimal point per number)
- Clear (`C`), sign toggle (`±`) and percent (`%`)
- Graceful handling of divide-by-zero (shows `Error` instead of `Infinity`/`NaN`)
- Chained operations evaluated left to right

## Running the app

Open `index.html` directly in a web browser - no build step or server is required.

## Install dependencies (for tests)

```bash
npm install
```

## Run tests

```bash
npm test
```

Tests (in `tests/calculator.test.js`) cover the calculator's core logic in `calculator.js`: normal operations, chained calculations, boundaries (zero, decimals) and invalid input (divide by zero).

## Project structure

- `index.html` - calculator markup
- `styles.css` - visual styling
- `calculator.js` - pure calculator logic (`Calculator` class and `calculate` function), usable from both the browser and Node.js/Jest
- `script.js` - wires the DOM buttons/display to the `Calculator` logic
- `tests/calculator.test.js` - Jest test suite
