import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-19: admin dashboard reachable from site, styled consistently, and responsive', async ({ page }) => {
  await proofStep(page, 'Criterion 1 & 2 (part 1): Open the main site and use the Admin link to reach the dashboard', async () => {
    await page.goto('/index.html');
    await expect(page.getByRole('heading', { name: 'Welcome to Bella Salon' })).toBeVisible();
    const adminLink = page.getByRole('link', { name: 'Admin' });
    await expect(adminLink).toBeVisible();
    await adminLink.click();
    await expect(page).toHaveURL(/admin-dashboard\.html$/);
  });

  await proofStep(page, 'Criterion 1: Dashboard shows key admin info - summary stats and recent bookings table', async () => {
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Total Bookings' })).toBeVisible();
    await expect(page.getByText('24', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Active Services' })).toBeVisible();
    await expect(page.getByText('4', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Revenue (This Month)' })).toBeVisible();
    await expect(page.getByText('$3,250')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recent Bookings' })).toBeVisible();
    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(table.getByRole('row', { name: /Jane Doe/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Mary Smith/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Alex Brown/ })).toBeVisible();
  });

  await proofStep(page, 'Criterion 2: Dashboard header matches the site brand and navigates back to the home page', async () => {
    await expect(page.getByRole('link', { name: 'Bella Salon' })).toBeVisible();
    const backLink = page.getByRole('link', { name: 'Back to Site' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page.getByRole('heading', { name: 'Welcome to Bella Salon' })).toBeVisible();
    await page.goto('/admin-dashboard.html');
  });

  await proofStep(page, 'Criterion 3: Dashboard renders correctly on a mobile-sized screen', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Total Bookings' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    await page.setViewportSize({ width: 1920, height: 1080 });
  });
});
