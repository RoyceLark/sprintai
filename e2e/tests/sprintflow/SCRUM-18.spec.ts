import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-18: desktop sections, navigation, content and contact links work with no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(err.message));

  await proofStep(page, 'Criterion 1: Home, About, Services, Pricing, Gallery and Contact sections exist and nav links them', async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/index.html');
    await expect(page.getByRole('heading', { name: 'Welcome to Rich Salon' })).toBeVisible();
    for (const id of ['home', 'about', 'services', 'pricing', 'gallery', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About Us' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Pricing' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Gallery' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  await proofStep(page, 'Criterion 2: Services list, pricing table, gallery images, testimonials and an offer are present', async () => {
    await expect(page.locator('#services .card')).toHaveCount(6);
    await expect(page.getByRole('heading', { name: 'Hair Styling' })).toBeVisible();
    await expect(page.locator('.offer-banner')).toContainText('20% off');
    await expect(page.locator('.pricing-table tbody tr')).toHaveCount(6);
    await expect(page.getByRole('cell', { name: 'Haircut & Styling' })).toBeVisible();
    await expect(page.locator('.gallery-item')).toHaveCount(6);
    await expect(page.locator('.testimonial')).toHaveCount(3);
    await expect(page.getByText('The best salon experience')).toBeVisible();
  });

  await proofStep(page, 'Criterion 3: clicking each nav link scrolls/jumps to the matching section', async () => {
    await page.click('a.nav-link[href="#services"]');
    await expect(page.locator('#services')).toBeInViewport();
    await page.click('a.nav-link[href="#pricing"]');
    await expect(page.locator('#pricing')).toBeInViewport();
    await page.click('a.nav-link[href="#gallery"]');
    await expect(page.locator('#gallery')).toBeInViewport();
    await page.click('a.nav-link[href="#contact"]');
    await expect(page.locator('#contact')).toBeInViewport();
  });

  await proofStep(page, 'Criterion 5: contact section shows address, phone, email as readable text with working tel/mailto links', async () => {
    await expect(page.getByText('123 Main Street, Springfield')).toBeVisible();
    const phoneLink = page.locator('.contact-info a[href^="tel:"]');
    const emailLink = page.locator('.contact-info a[href^="mailto:"]');
    await expect(phoneLink).toBeVisible();
    await expect(emailLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute('href', /^tel:/);
    await expect(emailLink).toHaveAttribute('href', /^mailto:/);
  });

  await proofStep(page, 'Criterion 7: no console errors occurred while browsing sections, gallery and nav on desktop', async () => {
    expect(errors).toEqual([]);
  });
});

test('SCRUM-18: responsive hamburger menu, pricing layout and enquiry form validation/success work on tablet and mobile', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(err.message));

  await proofStep(page, 'Criterion 6: at tablet width (~768px) the layout stacks with no horizontal overflow, pricing table stays readable', async () => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/index.html');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    await expect(page.locator('.pricing-table')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Bridal Makeup Package' })).toBeVisible();
  });

  await proofStep(page, 'Criterion 3 & 6: at mobile width (~375px) nav collapses into a hamburger menu that opens and closes, no horizontal overflow', async () => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/index.html');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    const navMenu = page.locator('#navMenu');
    const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
    await expect(toggle).toBeVisible();
    await expect(navMenu).not.toHaveClass(/open/);
    await toggle.click();
    await expect(navMenu).toHaveClass(/open/);
    await expect(navMenu.getByRole('link', { name: 'Contact' })).toBeVisible();
    await navMenu.getByRole('link', { name: 'Contact' }).click();
    await expect(navMenu).not.toHaveClass(/open/);
    await expect(page.locator('#contact')).toBeInViewport();
  });

  await proofStep(page, 'Criterion 4: submitting the enquiry form with an empty required field and an invalid email shows inline validation errors and does not submit', async () => {
    await page.click('#enquiryForm button[type="submit"]');
    await expect(page.locator('#nameError')).toHaveText(/required/i);
    await expect(page.locator('#emailError')).toHaveText(/required/i);
    await expect(page.locator('#formSuccess')).not.toHaveText(/thank you/i);

    await page.fill('#email', 'not-an-email');
    await page.click('#enquiryForm button[type="submit"]');
    await expect(page.locator('#emailError')).toHaveText(/valid email/i);
    await expect(page.locator('#formSuccess')).not.toHaveText(/thank you/i);
  });

  await proofStep(page, 'Criterion 4: filling the enquiry form with valid name, email, phone, service and date shows a success message without reload/error', async () => {
    await page.fill('#name', 'Jane Doe');
    await page.fill('#email', 'jane@example.com');
    await page.fill('#phone', '5551234567');
    await page.selectOption('#service', 'hair-styling');
    await page.fill('#date', '2026-12-01');
    await page.click('#enquiryForm button[type="submit"]');
    await expect(page.locator('#formSuccess')).toHaveText(/thank you/i);
  });

  await proofStep(page, 'Criterion 7: no console errors occurred during hamburger use, responsive resizing and form interactions', async () => {
    expect(errors).toEqual([]);
  });
});
