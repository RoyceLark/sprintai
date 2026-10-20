import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-26: Admin dashboard rendering logic - empty state, enquiry rows, and HTML escaping', async ({ page }) => {
  await page.goto('/admin.html');

  await proofStep(page, 'With no stored enquiries, the admin dashboard shows the empty-state message and hides the table', async () => {
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await expect(page.getByText('No enquiries have been submitted yet.')).toBeVisible();
    await expect(page.locator('#enquiries-table')).toBeHidden();
    await expect(page.locator('#enquiries-table-body tr')).toHaveCount(0);
  });

  await proofStep(page, 'When enquiries exist, the table is shown, the empty-state is hidden, and rows reflect the enquiry data', async () => {
    await page.evaluate(() => {
      window.localStorage.setItem(
        'salonEnquiries',
        JSON.stringify([
          { name: 'Jane Doe', contact: 'jane@example.com', service: 'hair', date: '2030-01-01', message: 'See you then' }
        ])
      );
    });
    await page.reload();

    await expect(page.locator('#enquiries-table')).toBeVisible();
    await expect(page.locator('#no-enquiries')).toBeHidden();

    const row = page.locator('#enquiries-table-body tr').first();
    await expect(row.locator('td').nth(0)).toHaveText('Jane Doe');
    await expect(row.locator('td').nth(1)).toHaveText('jane@example.com');
    await expect(row.locator('td').nth(2)).toHaveText('hair');
    await expect(row.locator('td').nth(3)).toHaveText('2030-01-01');
    await expect(row.locator('td').nth(4)).toHaveText('See you then');
  });

  await proofStep(page, 'HTML special characters in enquiry fields are escaped - shown as visible text, never injected as markup', async () => {
    await page.evaluate(() => {
      window.localStorage.setItem(
        'salonEnquiries',
        JSON.stringify([
          {
            name: '<script>alert(1)</script>',
            contact: 'a@example.com',
            service: 'hair',
            date: '2030-01-01',
            message: '<img src=x onerror=alert(1)>'
          }
        ])
      );
    });
    await page.reload();

    const tableBody = page.locator('#enquiries-table-body');
    await expect(tableBody.locator('script')).toHaveCount(0);
    await expect(tableBody.locator('img')).toHaveCount(0);

    const cells = tableBody.locator('tr').first().locator('td');
    await expect(cells.nth(0)).toHaveText('<script>alert(1)</script>');
    await expect(cells.nth(4)).toHaveText('<img src=x onerror=alert(1)>');
  });
});
