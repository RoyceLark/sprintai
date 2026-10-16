import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-19: Admin nav link, empty state, enquiry submission shown in dashboard, and back link', async ({ page }) => {
  // Start clean: no enquiries persisted yet.
  await page.goto('/admin.html');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await proofStep(page, 'Admin dashboard with no enquiries shows an empty-state message, not an empty/broken table', async () => {
    await expect(page.getByText('No enquiries have been submitted yet.')).toBeVisible();
    await expect(page.locator('#enquiries-table')).toBeHidden();
  });

  await proofStep(page, "Main site header nav shows a separate 'Admin' link alongside Home/About/Services etc.", async () => {
    await page.goto('/index.html');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Admin' }).getByRole('link', { name: 'Admin' })).toBeVisible();
  });

  await proofStep(page, "Clicking the 'Admin' link navigates to the admin dashboard page (admin.html)", async () => {
    await page.getByRole('navigation', { name: 'Admin' }).getByRole('link', { name: 'Admin' }).click();
    await expect(page).toHaveURL(/admin\.html$/);
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
  });

  await proofStep(page, "Submitting the booking form on the main site with valid data succeeds", async () => {
    await page.goto('/index.html');
    await page.getByLabel('Name').fill('Jane Doe');
    await page.getByLabel('Email or Phone').fill('jane@example.com');
    await page.getByLabel('Service').selectOption('hair');
    await page.locator('#date').fill('2026-12-01');
    await page.getByLabel('Message').fill('Looking forward to a haircut.');
    await page.getByRole('button', { name: 'Send Enquiry' }).click();
    await expect(page.getByText('Thank you! Your enquiry has been sent.')).toBeVisible();
  });

  await proofStep(page, 'The submitted enquiry appears in the Admin dashboard table with Name, Contact, Service, Date, Message', async () => {
    await page.goto('/admin.html');
    const row = page.locator('#enquiries-table-body tr').first();
    await expect(row).toBeVisible();
    await expect(row.locator('td').nth(0)).toHaveText('Jane Doe');
    await expect(row.locator('td').nth(1)).toHaveText('jane@example.com');
    await expect(row.locator('td').nth(2)).toHaveText('hair');
    await expect(row.locator('td').nth(3)).toHaveText('2026-12-01');
    await expect(row.locator('td').nth(4)).toHaveText('Looking forward to a haircut.');
    await expect(page.locator('#no-enquiries')).toBeHidden();
  });

  await proofStep(page, "A 'Back to site' link on the Admin dashboard returns to index.html", async () => {
    await page.getByRole('link', { name: 'Back to site' }).click();
    await expect(page).toHaveURL(/index\.html$/);
    await expect(page.getByRole('heading', { name: 'Welcome to Rich Salon' })).toBeVisible();
  });
});
