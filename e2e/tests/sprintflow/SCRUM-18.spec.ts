import { test, expect, proofStep } from './sprintflow-proof';

let consoleErrors: string[] = [];

test.beforeEach(({ page }) => {
  consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });
});

test('SCRUM-18: full salon site walkthrough - navigation, sections, responsive layout, enquiry form, contact links', async ({ page }) => {
  await proofStep(page, 'Criterion 1: Home section loads with hero banner, salon name and call-to-action button', async () => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Look Good. Feel Rich.' })).toBeVisible();
    await expect(page.locator('a.logo', { hasText: 'RichSalon' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Book an Enquiry' })).toBeVisible();
  });

  await proofStep(page, 'Criterion 3: clicking the About Us nav link scrolls to the About section', async () => {
    await page.getByRole('link', { name: 'About Us' }).click();
    await expect(page.getByRole('heading', { name: 'About Us' })).toBeInViewport();
  });

  await proofStep(page, 'Criteria 2 & 3: clicking Services nav link shows services with descriptions/offers', async () => {
    await page.getByRole('link', { name: 'Services', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Our Services' })).toBeInViewport();
    await expect(page.getByRole('heading', { name: 'Hair Styling' })).toBeVisible();
    await expect(page.getByText('Cuts, coloring, styling and treatments for every hair type.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Special Offers' })).toBeVisible();
  });

  await proofStep(page, 'Criteria 2 & 3: clicking Pricing nav link shows priced services', async () => {
    await page.getByRole('link', { name: 'Pricing' }).click();
    await expect(page.getByRole('heading', { name: 'Pricing', exact: true })).toBeInViewport();
    await expect(page.getByRole('heading', { name: 'Hair Cut & Style' })).toBeVisible();
    await expect(page.getByText('$25', { exact: true })).toBeVisible();
  });

  await proofStep(page, 'Criteria 2 & 3: clicking Gallery nav link shows gallery images and customer testimonials', async () => {
    await page.getByRole('link', { name: 'Gallery' }).click();
    await expect(page.getByRole('heading', { name: 'Gallery' })).toBeInViewport();
    await expect(page.getByRole('img', { name: 'Hair styling at Rich Salon' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'What Our Clients Say' })).toBeVisible();
    await expect(page.getByText("Best salon experience I've ever had")).toBeVisible();
  });

  await proofStep(page, 'Criteria 3 & 5: clicking Contact nav link shows salon address, phone and email with tel/mailto links', async () => {
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeInViewport();
    await expect(page.getByText('12 Main Street, Downtown City')).toBeVisible();
    const phoneLink = page.locator('a[href^="tel:"]');
    const emailLink = page.locator('a[href^="mailto:"]');
    await expect(phoneLink).toBeVisible();
    await expect(emailLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute('href', /^tel:/);
    await expect(emailLink).toHaveAttribute('href', /^mailto:/);
  });

  await proofStep(page, 'Criterion 4: submitting the appointment enquiry form with empty required fields shows validation errors', async () => {
    await page.getByRole('button', { name: 'Send Enquiry' }).click();
    const nameInput = page.getByLabel('Full Name');
    await expect(nameInput).toHaveJSProperty('validity.valid', false);
    await expect(page.locator('#formSuccess')).toHaveText('');
  });

  await proofStep(page, 'Criterion 4: filling the appointment enquiry form with valid data and submitting shows a success confirmation', async () => {
    await page.getByLabel('Full Name').fill('Jamie Lee');
    await page.getByLabel('Email').fill('jamie.lee@example.com');
    await page.getByLabel('Phone').fill('5551234567');
    await page.getByLabel('Service').selectOption('Hair Styling');
    await page.getByLabel('Preferred Date').fill('2026-11-01');
    await page.getByLabel('Preferred Time').fill('14:30');
    await page.getByLabel('Message').fill('Looking forward to a cut and style.');
    await page.getByRole('button', { name: 'Send Enquiry' }).click();
    await expect(page.locator('#formSuccess')).not.toHaveText('');
    await expect(page.locator('#formSuccess')).toBeVisible();
  });

  await proofStep(page, 'Criterion 6: at mobile width (375px) the nav collapses into a hamburger menu and sections stack vertically without overflow', async () => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    const navToggle = page.locator('#navToggle');
    await expect(navToggle).toBeVisible();
    const nav = page.locator('#primaryNav');
    await expect(nav).not.toBeVisible();
    await navToggle.click();
    await expect(nav).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(376);
  });

  await proofStep(page, 'Criterion 6: at tablet width (768px) and desktop width (1200px) the layout reflows without breaking', async () => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Look Good. Feel Rich.' })).toBeVisible();
    let bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(769);

    await page.setViewportSize({ width: 1200, height: 900 });
    await page.reload();
    await expect(page.locator('.primary-nav')).toBeVisible();
    await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
    bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(1201);
  });

  await proofStep(page, 'Criterion 7: no critical console errors occurred during the walkthrough', async () => {
    expect(consoleErrors, `Console errors detected: ${consoleErrors.join('; ')}`).toEqual([]);
  });
});
