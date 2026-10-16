const { test, expect } = require('@playwright/test');
const path = require('path');

const dashboardUrl = 'file://' + path.join(__dirname, '..', '..', 'admin-dashboard.html');
const homeUrl = 'file://' + path.join(__dirname, '..', '..', 'index.html');

test.describe('Admin dashboard page', () => {
  test('loads with title and summary cards', async ({ page }) => {
    await page.goto(dashboardUrl);

    await expect(page).toHaveTitle(/Admin Dashboard/);
    await expect(page.locator('#dashboard-title')).toHaveText('Admin Dashboard');

    await expect(page.locator('#total-bookings')).toBeVisible();
    await expect(page.locator('#active-services')).toBeVisible();
    await expect(page.locator('#revenue')).toBeVisible();
  });

  test('shows the recent bookings table with rows', async ({ page }) => {
    await page.goto(dashboardUrl);

    const table = page.locator('.bookings-table');
    await expect(table).toBeVisible();

    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(3);
  });

  test('has a link back to the main site', async ({ page }) => {
    await page.goto(dashboardUrl);

    const backLink = page.locator('a', { hasText: 'Back to Site' });
    await expect(backLink).toHaveAttribute('href', 'index.html');
  });
});

test.describe('Home page', () => {
  test('has a navigation link to the admin dashboard', async ({ page }) => {
    await page.goto(homeUrl);

    const adminLink = page.locator('a.nav-admin');
    await expect(adminLink).toBeVisible();
    await expect(adminLink).toHaveAttribute('href', 'admin-dashboard.html');
  });
});
