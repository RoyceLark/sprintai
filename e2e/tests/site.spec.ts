import { test, expect } from '@playwright/test';

test.describe('Rich Salon website', () => {
  test('all required sections are present', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#home')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#services')).toBeVisible();
    await expect(page.locator('#pricing')).toBeVisible();
    await expect(page.locator('#gallery')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('services, pricing, gallery and testimonials have content', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#services .card')).toHaveCount(6);
    await expect(page.locator('.pricing-table tbody tr')).toHaveCount(6);
    await expect(page.locator('.gallery-item')).toHaveCount(6);
    await expect(page.locator('.testimonial')).toHaveCount(3);
    await expect(page.locator('.offer-banner')).toBeVisible();
  });

  test('nav links scroll to the correct section', async ({ page }) => {
    await page.goto('/index.html');
    await page.click('a.nav-link[href="#pricing"]');
    await expect(page.locator('#pricing')).toBeInViewport();
  });

  test('mobile hamburger menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/index.html');
    const navMenu = page.locator('#navMenu');
    await expect(navMenu).not.toHaveClass(/open/);
    await page.click('#navToggle');
    await expect(navMenu).toHaveClass(/open/);
    await page.click('a.nav-link[href="#contact"]');
    await expect(navMenu).not.toHaveClass(/open/);
  });

  test('layout is responsive at tablet and mobile widths with no horizontal overflow', async ({ page }) => {
    for (const size of [{ width: 768, height: 1024 }, { width: 375, height: 812 }]) {
      await page.setViewportSize(size);
      await page.goto('/index.html');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    }
  });

  test('enquiry form shows validation errors for empty/invalid input', async ({ page }) => {
    await page.goto('/index.html');
    await page.click('#enquiryForm button[type="submit"]');
    await expect(page.locator('#nameError')).toHaveText(/required/i);
    await expect(page.locator('#emailError')).toHaveText(/required/i);

    await page.fill('#email', 'not-an-email');
    await page.click('#enquiryForm button[type="submit"]');
    await expect(page.locator('#emailError')).toHaveText(/valid email/i);
  });

  test('enquiry form shows success message on valid submission', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#name', 'Jane Doe');
    await page.fill('#email', 'jane@example.com');
    await page.fill('#phone', '+1 555 123 4567');
    await page.selectOption('#service', 'hair-styling');
    await page.fill('#date', '2026-12-01');
    await page.click('#enquiryForm button[type="submit"]');
    await expect(page.locator('#formSuccess')).toHaveText(/thank you/i);
  });

  test('contact section exposes usable phone and email links', async ({ page }) => {
    await page.goto('/index.html');
    const phoneLink = page.locator('.contact-info a[href^="tel:"]');
    const emailLink = page.locator('.contact-info a[href^="mailto:"]');
    await expect(phoneLink).toBeVisible();
    await expect(emailLink).toBeVisible();

    const phoneHref = await phoneLink.getAttribute('href');
    const phoneText = (await phoneLink.textContent())?.trim();
    expect(phoneHref).toBe('tel:' + phoneText);

    const emailHref = await emailLink.getAttribute('href');
    const emailText = (await emailLink.textContent())?.trim();
    expect(emailHref).toBe('mailto:' + emailText);
  });

  test('nav link highlights the section currently in view', async ({ page }) => {
    await page.goto('/index.html');
    await page.click('a.nav-link[href="#pricing"]');
    await expect(page.locator('a.nav-link[href="#pricing"]')).toHaveClass(/active/);
    await page.click('a.nav-link[href="#contact"]');
    await expect(page.locator('a.nav-link[href="#contact"]')).toHaveClass(/active/);
  });

  test('no console errors on load, navigation, gallery and form interaction', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/index.html');
    await page.click('a.nav-link[href="#gallery"]');
    await page.click('a.nav-link[href="#contact"]');
    await page.fill('#name', 'Test User');
    await page.click('#enquiryForm button[type="submit"]');

    expect(errors).toEqual([]);
  });
});
