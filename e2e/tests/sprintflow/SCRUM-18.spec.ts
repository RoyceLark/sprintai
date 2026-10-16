import { test, expect, proofStep } from './sprintflow-proof';

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

async function columnCount(page: import('@playwright/test').Page, selector: string): Promise<number> {
  const value = await page.locator(selector).evaluate((el) => getComputedStyle(el as Element).gridTemplateColumns);
  return value.trim().split(/\s+/).length;
}

test('SCRUM-18: Rich Salon one-page site - full flow', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  await proofStep(page, 'Criterion 1: Home page loads at desktop width with semantic sections and full nav bar', async () => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome to Rich Salon' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Book an Appointment' })).toBeVisible();
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    for (const name of ['Home', 'About Us', 'Services', 'Pricing', 'Gallery', 'Testimonials', 'Contact']) {
      await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name })).toBeVisible();
    }
  });

  await proofStep(page, 'Criterion 2: clicking each nav link scrolls to the matching section and highlights it as active', async () => {
    const nav = page.getByRole('navigation', { name: 'Primary' });
    const sections: [string, string][] = [
      ['Services', 'services'],
      ['Pricing', 'pricing'],
      ['Gallery', 'gallery'],
      ['Testimonials', 'testimonials'],
      ['Contact', 'contact'],
    ];
    for (const [label, id] of sections) {
      await nav.getByRole('link', { name: label }).click();
      await expect(page.locator(`#${id}`)).toBeInViewport();
      await page.waitForTimeout(600);
      await expect(nav.getByRole('link', { name: label })).toHaveClass(/nav__link--active/, { timeout: 10000 });
    }
  });

  await proofStep(page, 'Criterion 3: Services section lists 4+ services with name/description/image, Pricing shows price cards', async () => {
    const serviceCards = page.locator('#services .card');
    await expect(serviceCards).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      const card = serviceCards.nth(i);
      await expect(card.locator('img')).toBeVisible();
      await expect(card.locator('h3')).toBeVisible();
      await expect(card.locator('p')).toBeVisible();
    }
    const priceCards = page.locator('#pricing .price-card');
    await expect(priceCards).toHaveCount(4);
    await expect(priceCards.first().locator('.price-card__price')).toContainText('$');
  });

  await proofStep(page, 'Criterion 4 & 7: Gallery shows a responsive image grid that reduces columns on a narrower viewport', async () => {
    const galleryImages = page.locator('#gallery .gallery__item');
    await expect(galleryImages.first()).toBeVisible();
    const countBefore = await galleryImages.count();
    expect(countBefore).toBeGreaterThanOrEqual(4);
    const desktopCols = await columnCount(page, '.gallery__grid');
    expect(desktopCols).toBeGreaterThanOrEqual(3);
  });

  await proofStep(page, 'Criterion 5: Testimonials render as always-visible static cards, all visible at once', async () => {
    const cards = page.locator('#testimonials .testimonial-card');
    await expect(cards).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }
  });

  await proofStep(page, 'Criterion 6: Contact section shows address/phone/email and a form with accessible labels', async () => {
    const contact = page.locator('#contact');
    await expect(contact.getByText('123 Beauty Lane, Springfield')).toBeVisible();
    await expect(contact.locator('a[href^="tel:"]')).toBeVisible();
    await expect(contact.locator('a[href^="mailto:"]')).toBeVisible();
    await expect(page.getByLabel('Name', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Email or Phone')).toBeVisible();
    await expect(page.getByLabel('Service')).toBeVisible();
    await expect(page.getByLabel('Preferred Date')).toBeVisible();
    await expect(page.getByLabel('Message')).toBeVisible();
  });

  await proofStep(page, 'Criterion 6: submitting the empty form shows inline validation errors', async () => {
    await page.getByRole('button', { name: 'Send Enquiry' }).click();
    await expect(page.locator('#nameError')).not.toBeEmpty();
    await expect(page.locator('#contactInfoError')).not.toBeEmpty();
    await expect(page.locator('#serviceError')).not.toBeEmpty();
    await expect(page.locator('#dateError')).not.toBeEmpty();
    await expect(page.locator('#formSuccess')).toBeHidden();
  });

  await proofStep(page, 'Criterion 6: filling the form correctly and submitting shows a visible success message', async () => {
    await page.getByLabel('Name', { exact: true }).fill('Jane Smith');
    await page.getByLabel('Email or Phone').fill('jane.smith@example.com');
    await page.getByLabel('Service').selectOption('haircut');
    await page.getByLabel('Preferred Date').fill(tomorrowISO());
    await page.getByLabel('Message').fill('Looking forward to my appointment.');
    await page.getByRole('button', { name: 'Send Enquiry' }).click();
    await expect(page.locator('#formSuccess')).toBeVisible();
    await expect(page.locator('#formSuccess')).toContainText('Thank you');
  });

  await proofStep(page, 'Criterion 7: at tablet width (~768px) the nav collapses into a mobile menu that opens and closes on tap, and grids reduce columns', async () => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const toggle = page.getByRole('button', { name: 'Toggle menu' });
    await expect(toggle).toBeVisible();
    const navList = page.locator('#navList');
    await expect(navList).toBeHidden();
    await toggle.click();
    await expect(navList).toBeVisible();
    await expect(navList.getByRole('link', { name: 'About Us' })).toBeVisible();
    await toggle.click();
    await expect(navList).toBeHidden();
    const tabletCols = await columnCount(page, '#services .card-grid');
    expect(tabletCols).toBe(2);
  });

  await proofStep(page, 'Criterion 7: at mobile width (<=480px) the nav stays collapsed and the mobile menu toggle opens it, navigating to a section', async () => {
    await page.setViewportSize({ width: 420, height: 800 });
    const toggle = page.getByRole('button', { name: 'Toggle menu' });
    const navList = page.locator('#navList');
    await expect(navList).toBeHidden();
    await toggle.click();
    await expect(navList).toBeVisible();
    await navList.getByRole('link', { name: 'Services' }).click();
    await expect(page.locator('#services')).toBeInViewport();
    await expect(navList).toBeHidden();
    const mobileCols = await columnCount(page, '.gallery__grid');
    expect(mobileCols).toBe(1);
  });

  await proofStep(page, 'Criterion 8: no critical console errors occurred across load, nav, mobile menu and form interactions', async () => {
    expect(consoleErrors, `Console errors: ${consoleErrors.join('; ')}`).toEqual([]);
  });
});
