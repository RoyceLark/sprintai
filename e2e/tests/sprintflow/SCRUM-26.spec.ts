import { test, expect, proofStep } from './sprintflow-proof';

const STORAGE_KEY = 'salonEnquiries';

test('SCRUM-26: admin dashboard renders enquiries using admin.js logic covered by the new unit tests', async ({ page }) => {
  await page.goto('/admin.html');

  await proofStep(page, 'Empty state: with no enquiries stored, #no-enquiries is shown and #enquiries-table is hidden', async () => {
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();

    await expect(page.locator('#no-enquiries')).toBeVisible();
    await expect(page.locator('#no-enquiries')).toHaveText('No enquiries have been submitted yet.');
    await expect(page.locator('#enquiries-table')).toBeHidden();
  });

  await proofStep(page, 'Non-empty state: one <tr> per enquiry renders with correct cell values, #no-enquiries hides, #enquiries-table shows', async () => {
    await page.evaluate(
      ({ key, data }) => localStorage.setItem(key, JSON.stringify(data)),
      {
        key: STORAGE_KEY,
        data: [
          { name: 'Jane Doe', contact: 'jane@example.com', service: 'hair', date: '2030-01-01', message: 'See you then' },
          { name: 'John Roe', contact: 'john@example.com', service: 'spa', date: '2030-02-01', message: 'Looking forward' }
        ]
      }
    );
    await page.reload();

    const rows = page.locator('#enquiries-table-body tr');
    await expect(rows).toHaveCount(2);

    const firstCells = rows.nth(0).locator('td');
    await expect(firstCells.nth(0)).toHaveText('Jane Doe');
    await expect(firstCells.nth(1)).toHaveText('jane@example.com');
    await expect(firstCells.nth(2)).toHaveText('hair');
    await expect(firstCells.nth(3)).toHaveText('2030-01-01');
    await expect(firstCells.nth(4)).toHaveText('See you then');

    await expect(page.locator('#no-enquiries')).toBeHidden();
    await expect(page.locator('#enquiries-table')).toBeVisible();
  });

  await proofStep(page, 'HTML in enquiry fields (name/message) is escaped and shown as plain text, not injected as live markup', async () => {
    await page.evaluate(
      ({ key, data }) => localStorage.setItem(key, JSON.stringify(data)),
      {
        key: STORAGE_KEY,
        data: [
          {
            name: '<img src=x onerror=alert(1)>',
            contact: 'a@example.com',
            service: 'nails',
            date: '2030-03-01',
            message: '<script>evil()</script>'
          }
        ]
      }
    );
    await page.reload();

    const body = page.locator('#enquiries-table-body');
    await expect(body.locator('img')).toHaveCount(0);
    await expect(body.locator('script')).toHaveCount(0);

    const cells = body.locator('tr').first().locator('td');
    await expect(cells.nth(0)).toHaveText('<img src=x onerror=alert(1)>');
    await expect(cells.nth(4)).toHaveText('<script>evil()</script>');
  });
});
