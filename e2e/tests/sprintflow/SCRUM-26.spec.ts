import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-26: admin enquiries table hides when empty, renders enquiry data, and escapes HTML', async ({ page }) => {
  await proofStep(page, 'Empty state: no enquiries stored shows the empty message and hides the table', async () => {
    await page.goto('/admin.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expect(page.locator('#no-enquiries')).toBeVisible();
    await expect(page.locator('#no-enquiries')).toHaveText('No enquiries have been submitted yet.');
    await expect(page.locator('#enquiries-table')).toBeHidden();
  });

  await proofStep(page, 'Normal rendering: stored enquiries show the table with correct row data', async () => {
    await page.evaluate(() => {
      localStorage.setItem('salonEnquiries', JSON.stringify([
        {
          name: 'Jane Doe',
          contact: '555-1234',
          service: 'Haircut',
          date: '2026-10-21',
          message: 'Looking forward to it'
        }
      ]));
    });
    await page.reload();

    await expect(page.locator('#enquiries-table')).toBeVisible();
    await expect(page.locator('#no-enquiries')).toBeHidden();

    const row = page.locator('#enquiries-table-body tr').first();
    await expect(row).toContainText('Jane Doe');
    await expect(row).toContainText('555-1234');
    await expect(row).toContainText('Haircut');
    await expect(row).toContainText('2026-10-21');
    await expect(row).toContainText('Looking forward to it');
  });

  await proofStep(page, 'HTML escaping: enquiry fields with HTML special characters are shown as text, not injected as markup', async () => {
    await page.evaluate(() => {
      localStorage.setItem('salonEnquiries', JSON.stringify([
        {
          name: '<script>alert(1)</script>',
          contact: '<img src=x onerror=alert(2)>',
          service: 'Facial',
          date: '2026-10-22',
          message: '<b>bold</b>'
        }
      ]));
    });
    await page.reload();

    // No real <script> or <img> elements must be created from the enquiry data.
    await expect(page.locator('#enquiries-table-body script')).toHaveCount(0);
    await expect(page.locator('#enquiries-table-body img')).toHaveCount(0);
    await expect(page.locator('#enquiries-table-body b')).toHaveCount(0);

    // The literal markup text is shown escaped instead.
    const body = page.locator('#enquiries-table-body');
    await expect(body).toContainText('<script>alert(1)</script>');
    await expect(body).toContainText('<img src=x onerror=alert(2)>');
    await expect(body).toContainText('<b>bold</b>');
  });
});
