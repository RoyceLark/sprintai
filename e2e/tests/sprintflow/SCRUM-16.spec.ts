import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-16: styled calculator with display and buttons is visible', async ({ page }) => {
  await proofStep(page, 'Open index.html and see a styled calculator with display and button grid', async () => {
    await page.goto('/index.html');
    const display = page.locator('[data-current-operand]');
    await expect(display).toBeVisible();
    await expect(display).toHaveText('0');

    // Verify a polished, non-default visual theme is applied (not plain unstyled HTML).
    const bodyBgImage = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);
    expect(bodyBgImage).toContain('gradient');

    const calculatorGrid = page.locator('.calculator-grid');
    await expect(calculatorGrid).toBeVisible();
    const gridBg = await calculatorGrid.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(gridBg).not.toBe('rgba(0, 0, 0, 0)');

    const button5 = page.getByRole('button', { name: '5', exact: true });
    await expect(button5).toBeVisible();
    const buttonBg = await button5.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(buttonBg).not.toBe('rgba(0, 0, 0, 0)');
  });
});

test('SCRUM-16: addition of 5 + 3 equals 8', async ({ page }) => {
  await page.goto('/index.html');
  const display = page.locator('[data-current-operand]');

  await proofStep(page, "Click '5', '+', '3', '=' and see the display show 8", async () => {
    await page.getByRole('button', { name: '5', exact: true }).click();
    await page.getByRole('button', { name: '+', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await expect(display).toHaveText('8');
  });
});

test('SCRUM-16: dividing by zero shows an error instead of Infinity/NaN', async ({ page }) => {
  await page.goto('/index.html');
  const display = page.locator('[data-current-operand]');

  await proofStep(page, "Click '7', '/', '0', '=' and see a clear error message, not Infinity/NaN", async () => {
    await page.getByRole('button', { name: '7', exact: true }).click();
    await page.getByRole('button', { name: '/', exact: true }).click();
    await page.getByRole('button', { name: '0', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();
    await expect(display).toHaveText('Error');
    await expect(display).not.toHaveText('Infinity');
    await expect(display).not.toHaveText('NaN');
  });
});

test('SCRUM-16: clear (C) resets the display to its initial state', async ({ page }) => {
  await page.goto('/index.html');
  const display = page.locator('[data-current-operand]');

  await proofStep(page, "Click some digits, then 'C', and see the display reset to 0", async () => {
    await page.getByRole('button', { name: '1', exact: true }).click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await expect(display).toHaveText('123');

    await page.getByRole('button', { name: 'C', exact: true }).click();
    await expect(display).toHaveText('0');
  });
});

test('SCRUM-16: backspace removes the last entered digit', async ({ page }) => {
  await page.goto('/index.html');
  const display = page.locator('[data-current-operand]');

  await proofStep(page, "Click digits then the backspace button, and see the last digit removed", async () => {
    await page.getByRole('button', { name: '1', exact: true }).click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await expect(display).toHaveText('123');

    await page.getByRole('button', { name: 'DEL', exact: true }).click();
    await expect(display).toHaveText('12');
  });
});
