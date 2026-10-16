import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-18: Rich Salon single-page site - sections, nav, content, responsive, form', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.setViewportSize({ width: 1280, height: 900 });

  await proofStep(page, 'Home page loads at desktop width showing hero and nav bar with all links', async () => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome to Rich Salon' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Book an Appointment' })).toBeVisible();
    const nav = page.getByRole('navigation', { name: 'Primary' });
    for (const label of ['Home', 'About Us', 'Services', 'Pricing', 'Gallery', 'Testimonials', 'Contact']) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
  });

  await proofStep(page, 'Clicking nav links scrolls to matching section and highlights it as active, no console errors', async () => {
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await nav.getByRole('link', { name: 'Services', exact: true }).click();
    await expect(page.locator('#services')).toBeInViewport();
    await expect(nav.getByRole('link', { name: 'Services', exact: true })).toHaveClass(/is-active/);

    await nav.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page.locator('section#contact')).toBeInViewport();
    await expect(nav.getByRole('link', { name: 'Contact', exact: true })).toHaveClass(/is-active/);

    expect(consoleErrors, `console errors: ${consoleErrors.join('; ')}`).toEqual([]);
  });

  await proofStep(page, 'Services section shows cards with name/description/icon; Pricing shows card layout with prices', async () => {
    const services = page.locator('#services article.service-card');
    await expect(services).toHaveCount(4);
    await expect(services.first().getByRole('heading', { name: 'Hair Styling' })).toBeVisible();
    await expect(services.first().getByRole('img', { name: 'Hair styling icon' })).toBeVisible();
    await expect(services.first().getByText('Cuts, coloring and styling tailored to your look.')).toBeVisible();

    const prices = page.locator('#pricing article.price-card');
    await expect(prices).toHaveCount(4);
    await expect(prices.first().getByRole('heading', { name: 'Haircut & Styling' })).toBeVisible();
    await expect(prices.first().getByText('$25')).toBeVisible();
  });

  await proofStep(page, 'Gallery section shows salon images in a responsive grid', async () => {
    const items = page.locator('#gallery .gallery-grid__item');
    await expect(items).toHaveCount(6);
    await expect(items.first()).toBeVisible();
  });

  await proofStep(page, 'Testimonials render as always-visible static cards, none hidden', async () => {
    const cards = page.locator('#testimonials .testimonial-card');
    const count = await cards.count();
    expect(count).toBe(3);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }
  });

  await proofStep(page, 'Contact section shows address/phone/email and accessible form; empty submit shows validation', async () => {
    await page.locator('nav a[href="#contact"]').click();
    await expect(page.getByText('123 Beauty Lane, Springfield')).toBeVisible();
    await expect(page.locator('#contact a[href^="tel:"]')).toBeVisible();
    await expect(page.locator('#contact a[href^="mailto:"]')).toBeVisible();

    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email or Phone')).toBeVisible();
    await expect(page.getByLabel('Service')).toBeVisible();
    await expect(page.getByLabel('Preferred Date')).toBeVisible();
    await expect(page.getByLabel('Message')).toBeVisible();

    await page.getByRole('button', { name: 'Send Enquiry' }).click();
    await expect(page.locator('#name-error')).not.toBeEmpty();
    await expect(page.locator('#contact-error')).not.toBeEmpty();
    await expect(page.locator('#service-error')).not.toBeEmpty();
    await expect(page.locator('#date-error')).not.toBeEmpty();
    await expect(page.locator('#form-success')).toBeHidden();
  });

  await proofStep(page, 'Filling the form validly and submitting shows a visible success message', async () => {
    await page.getByLabel('Name').fill('Jane Doe');
    await page.getByLabel('Email or Phone').fill('jane@example.com');
    await page.getByLabel('Service').selectOption('hair');
    await page.getByLabel('Preferred Date').fill('2026-11-01');
    await page.getByLabel('Message').fill('Looking forward to my appointment.');
    await page.getByRole('button', { name: 'Send Enquiry' }).click();
    await expect(page.locator('#form-success')).toBeVisible();
    await expect(page.locator('#form-success')).toContainText('Thank you');

    expect(consoleErrors, `console errors: ${consoleErrors.join('; ')}`).toEqual([]);
  });

  await proofStep(page, 'Resizing to tablet (~768px) shows reflowed grids', async () => {
    await page.goto('/');
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('#services .card-grid')).toBeVisible();
  });

  await proofStep(page, 'Resizing to mobile (<=480px) collapses nav into hamburger menu that toggles open/closed', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    const toggle = page.locator('#nav-toggle');
    await expect(toggle).toBeVisible();
    const navList = page.locator('#nav-list');
    await expect(navList).toBeHidden();
    await toggle.click();
    await expect(navList).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await toggle.click();
    await expect(navList).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    expect(consoleErrors, `console errors: ${consoleErrors.join('; ')}`).toEqual([]);
  });
});
