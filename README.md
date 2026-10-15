# Rich Calculator

A multi-operation calculator web application built with plain HTML, CSS and JavaScript.

## Features

- Addition, subtraction, multiplication, division and percent operations
- Decimal point input, backspace/delete and clear (reset) buttons
- Graceful handling of divide-by-zero (shows `Error` instead of `Infinity`/`NaN`)
- Rich, styled UI with a gradient background and themed buttons

## Install

```
npm install
```

## Run

Open `index.html` in a browser (no server required).

## Test

```
npm test
```

Runs the Jest test suite in `tests/calculator.test.js`, which covers the core calculation
logic in `calculator.js`: basic operations, decimals, chained operations, divide-by-zero,
delete and clear.
