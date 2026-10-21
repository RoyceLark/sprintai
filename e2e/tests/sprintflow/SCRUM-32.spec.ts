import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-32: admin manages the service catalog and index.html reflects it', async ({ page }) => {
  // Start with a clean catalog so the seeded defaults and our changes are predictable.
  await page.goto('/admin.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await proofStep(page, 'The 4 existing services are seeded and visible in the admin service list', async () => {
    const tableBody = page.locator('#services-table-body');
    await expect(tableBody.locator('tr', { hasText: 'Hair Styling' })).toBeVisible();
    await expect(tableBody.locator('tr', { hasText: 'Facial & Skin Care' })).toBeVisible();
    await expect(tableBody.locator('tr', { hasText: 'Spa & Massage' })).toBeVisible();
    await expect(tableBody.locator('tr', { hasText: 'Nail Care' })).toBeVisible();
  });

  await proofStep(page, 'Admin fills in a new service name/duration/price and submits, and it appears in the admin list', async () => {
    await page.getByLabel('Service Name').fill('Hot Stone Therapy');
    await page.getByLabel('Duration (minutes)').fill('50');
    await page.getByLabel('Price ($)').fill('65');
    await page.getByRole('button', { name: 'Add Service' }).click();

    const newRow = page.locator('#services-table-body tr', { hasText: 'Hot Stone Therapy' });
    await expect(newRow).toBeVisible();
    await expect(newRow).toContainText('50 min');
    await expect(newRow).toContainText('$65.00');
    await expect(newRow).toContainText('Enabled');
  });

  await proofStep(page, 'After reloading index.html, the new service appears in Our Services and in the enquiry Service dropdown', async () => {
    await page.goto('/index.html');
    const card = page.locator('[data-service-id="hot-stone-therapy"]');
    await expect(card).toBeVisible();
    await expect(card.getByRole('heading', { name: 'Hot Stone Therapy' })).toBeVisible();
    await expect(page.locator('#service')).toContainText('Hot Stone Therapy');
  });

  await proofStep(page, 'Admin edits an existing service\'s name, duration and price and saves', async () => {
    await page.goto('/admin.html');
    const hairRow = page.locator('#services-table-body tr', { hasText: 'Hair Styling' });
    await hairRow.getByRole('button', { name: 'Edit' }).click();

    await page.getByLabel('Service Name').fill('Hair Styling Deluxe');
    await page.getByLabel('Duration (minutes)').fill('75');
    await page.getByLabel('Price ($)').fill('35');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    const updatedRow = page.locator('#services-table-body tr', { hasText: 'Hair Styling Deluxe' });
    await expect(updatedRow).toBeVisible();
    await expect(updatedRow).toContainText('75 min');
    await expect(updatedRow).toContainText('$35.00');
  });

  await proofStep(page, 'The edited service shows its updated name on index.html after reload', async () => {
    await page.goto('/index.html');
    const card = page.locator('[data-service-id="hair"]');
    await expect(card.getByRole('heading', { name: 'Hair Styling Deluxe' })).toBeVisible();
  });

  await proofStep(page, 'Admin disables a service: it disappears from index.html Services and the enquiry dropdown, but stays in the admin list marked Disabled', async () => {
    await page.goto('/admin.html');
    const nailsRow = page.locator('#services-table-body tr', { hasText: 'Nail Care' });
    await nailsRow.getByRole('button', { name: 'Disable' }).click();
    await expect(nailsRow).toContainText('Disabled');
    await expect(nailsRow.getByRole('button', { name: 'Enable' })).toBeVisible();

    await page.goto('/index.html');
    await expect(page.locator('[data-service-id="nails"]')).toHaveCount(0);
    await expect(page.locator('#service')).not.toContainText('Nail Care');
  });

  await proofStep(page, 'Admin re-enables the service: it reappears on index.html and in the enquiry dropdown', async () => {
    await page.goto('/admin.html');
    const nailsRow = page.locator('#services-table-body tr', { hasText: 'Nail Care' });
    await nailsRow.getByRole('button', { name: 'Enable' }).click();
    await expect(nailsRow).toContainText('Enabled');

    await page.goto('/index.html');
    await expect(page.locator('[data-service-id="nails"]')).toBeVisible();
    await expect(page.locator('#service')).toContainText('Nail Care');
  });
});
