import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-17: desktop dashboard shows sidebar nav, stat cards, and section navigation using shared components', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  await proofStep(page, 'Criteria 1,3,4: desktop dashboard loads with sidebar nav (Overview, Appointments, Staff, Services, Clients) and Overview stat cards', async () => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
    for (const item of ['Overview', 'Appointments', 'Staff', 'Services', 'Clients']) {
      await expect(nav.getByRole('button', { name: item })).toBeVisible();
    }
    await expect(page.getByRole('heading', { name: 'Overview', level: 1 })).toBeVisible();
    const main = page.getByRole('main');
    await expect(main.getByText('Appointments Today')).toBeVisible();
    await expect(main.getByText('Staff', { exact: true })).toBeVisible();
    await expect(main.getByText('Services', { exact: true })).toBeVisible();
    await expect(main.getByText('Clients', { exact: true })).toBeVisible();
  });

  await proofStep(page, 'Criteria 3,4: clicking Appointments nav item shows the Appointments table using the shared DataTable component', async () => {
    await page.getByRole('button', { name: 'Appointments' }).click();
    await expect(page.getByRole('heading', { name: 'Appointments', level: 1 })).toBeVisible();
    const table = page.locator('table.data-table');
    await expect(table).toBeVisible();
    await expect(table.locator('caption')).toHaveText("Today's appointments");
    await expect(table.locator('thead th').first()).toBeVisible();
    await expect(table.locator('tbody tr').first()).toBeVisible();
  });

  await proofStep(page, 'Criterion 4: Staff, Services and Clients sections also render their own data tables (consistent, reused design)', async () => {
    await page.getByRole('button', { name: 'Staff' }).click();
    await expect(page.getByRole('heading', { name: 'Staff', level: 1 })).toBeVisible();
    await expect(page.locator('table.data-table')).toBeVisible();

    await page.getByRole('button', { name: 'Services' }).click();
    await expect(page.getByRole('heading', { name: 'Services', level: 1 })).toBeVisible();
    await expect(page.locator('table.data-table')).toBeVisible();

    await page.getByRole('button', { name: 'Clients' }).click();
    await expect(page.getByRole('heading', { name: 'Clients', level: 1 })).toBeVisible();
    await expect(page.locator('table.data-table')).toBeVisible();
  });
});

test('SCRUM-17: mobile viewport collapses sidebar into a toggle menu that opens and closes without breaking layout', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');

  await proofStep(page, 'Criterion 5: at mobile width (375px) the sidebar is hidden off-screen and a menu toggle button is visible instead', async () => {
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
    await expect(toggle).toBeVisible();
    await expect(nav).not.toBeInViewport();

    // content reflows without horizontal scrolling
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    await expect(page.getByRole('heading', { name: 'Overview', level: 1 })).toBeVisible();
    await expect(page.getByText('Appointments Today')).toBeVisible();
  });

  await proofStep(page, 'Criterion 5: clicking the toggle opens the navigation as a drawer/overlay with nav items visible and content still readable', async () => {
    const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await toggle.click();
    await expect(nav).toBeInViewport();
    for (const item of ['Overview', 'Appointments', 'Staff', 'Services', 'Clients']) {
      await expect(nav.getByRole('button', { name: item })).toBeVisible();
    }
  });

  await proofStep(page, 'Criterion 5: selecting a nav item from the open mobile menu closes it and navigates without breaking the layout', async () => {
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await nav.getByRole('button', { name: 'Appointments' }).click();
    await expect(page.getByRole('heading', { name: 'Appointments', level: 1 })).toBeVisible();
    await expect(nav).not.toBeInViewport();

    const table = page.locator('table.data-table');
    await expect(table).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
