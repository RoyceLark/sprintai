import { test, expect } from '@playwright/test';

// This suite exists purely to produce visual proof screenshots for reviewers,
// demonstrating that each section, nav destination and responsive state
// actually renders as claimed (not just asserted by selectors).

test.describe('Rich Salon visual proof', () => {
  test('Criterion 1: Home hero renders on load (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/index.html');
    await page.screenshot({ path: 'screenshots/criterion1-home.png' });
    await expect(page.locator('#home')).toBeVisible();
  });

  test('Criterion 2: Services list, pricing table, gallery images, testimonials and an offer are present', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/index.html');

    await page.locator('#services').scrollIntoViewIfNeeded();
    await expect(page.locator('.offer-banner')).toBeVisible();
    await page.screenshot({ path: 'screenshots/criterion2-services.png' });

    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.locator('.pricing-table')).toBeVisible();
    await page.screenshot({ path: 'screenshots/criterion2-pricing.png' });

    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await expect(page.locator('.gallery-item').first()).toBeVisible();
    await page.screenshot({ path: 'screenshots/criterion2-gallery.png' });

    await page.locator('.testimonial-grid').scrollIntoViewIfNeeded();
    await expect(page.locator('.testimonial').first()).toBeVisible();
    await page.screenshot({ path: 'screenshots/criterion2-testimonials.png' });
  });

  test('Criterion 3: nav links reach every section (Home, About, Services, Pricing, Gallery, Contact)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/index.html');

    const sections = ['home', 'about', 'services', 'pricing', 'gallery', 'contact'];
    for (const id of sections) {
      await page.click(`a.nav-link[href="#${id}"]`);
      await expect(page.locator(`#${id}`)).toBeInViewport();
      await page.screenshot({ path: `screenshots/criterion3-nav-${id}.png` });
    }
  });

  test('Criterion 3b: Contact phone/email render as visibly styled links', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/index.html');
    await page.click('a.nav-link[href="#contact"]');
    const phoneLink = page.locator('.contact-info a[href^="tel:"]');
    const emailLink = page.locator('.contact-info a[href^="mailto:"]');
    await expect(phoneLink).toHaveCSS('text-decoration-line', 'underline');
    await expect(emailLink).toHaveCSS('text-decoration-line', 'underline');
    await page.screenshot({ path: 'screenshots/criterion3b-contact-links.png' });
  });

  test('Criterion 6a: hamburger menu opens and closes on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/index.html');
    await page.screenshot({ path: 'screenshots/criterion6a-menu-closed.png' });

    await page.click('#navToggle');
    await expect(page.locator('#navMenu')).toHaveClass(/open/);
    await page.screenshot({ path: 'screenshots/criterion6a-menu-open.png' });

    await page.click('#navToggle');
    await expect(page.locator('#navMenu')).not.toHaveClass(/open/);
    await page.screenshot({ path: 'screenshots/criterion6a-menu-closed-again.png' });
  });

  test('Criterion 6b: pricing table is readable at tablet width (~768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/index.html');
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.locator('.pricing-table')).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    await page.screenshot({ path: 'screenshots/criterion6b-pricing-tablet.png' });
  });

  test('Criterion 6c: pricing table is readable at mobile width (~375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/index.html');
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.locator('.pricing-table')).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    await page.screenshot({ path: 'screenshots/criterion6c-pricing-mobile.png' });
  });
});
