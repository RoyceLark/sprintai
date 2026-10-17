import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-21: Glassmorphism UI applied consistently across header, cards, enquiry form and mobile nav', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  await proofStep(page, 'Header nav is a translucent, blurred glass bar and stays legible over the hero', async () => {
    const header = page.locator('.site-header');
    await expect(header).toBeVisible();
    const styles = await header.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { backdropFilter: cs.backdropFilter || (cs as any).webkitBackdropFilter, bg: cs.backgroundColor, boxShadow: cs.boxShadow };
    });
    expect(styles.backdropFilter).toContain('blur');
    expect(styles.bg).toMatch(/rgba?\(/);
    expect(styles.boxShadow).not.toBe('none');
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  await proofStep(page, 'Service cards show glassy translucent panels with blur and soft shadow, text legible', async () => {
    await page.locator('#services').scrollIntoViewIfNeeded();
    const card = page.locator('.service-card').first();
    await expect(card).toBeVisible();
    const styles = await card.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { backdropFilter: cs.backdropFilter || (cs as any).webkitBackdropFilter, bg: cs.backgroundColor, boxShadow: cs.boxShadow, radius: cs.borderRadius };
    });
    expect(styles.backdropFilter).toContain('blur');
    expect(styles.bg).toMatch(/rgba?\(/);
    expect(styles.boxShadow).not.toBe('none');
    expect(parseFloat(styles.radius)).toBeGreaterThan(0);
    await expect(card.getByText('Hair Styling')).toBeVisible();
  });

  await proofStep(page, 'Pricing cards, including the featured one, use the same glass styling as service cards', async () => {
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    const regular = page.locator('.price-card').first();
    const featured = page.locator('.price-card--featured');
    await expect(regular).toBeVisible();
    await expect(featured).toBeVisible();
    const [regStyles, featStyles, serviceStyles] = await Promise.all([
      regular.evaluate((el) => { const cs = getComputedStyle(el); return { blur: cs.backdropFilter || (cs as any).webkitBackdropFilter, bg: cs.backgroundColor, shadow: cs.boxShadow }; }),
      featured.evaluate((el) => { const cs = getComputedStyle(el); return { blur: cs.backdropFilter || (cs as any).webkitBackdropFilter, bg: cs.backgroundColor, shadow: cs.boxShadow }; }),
      page.locator('.service-card').first().evaluate((el) => { const cs = getComputedStyle(el); return { blur: cs.backdropFilter || (cs as any).webkitBackdropFilter, bg: cs.backgroundColor, shadow: cs.boxShadow }; }),
    ]);
    expect(regStyles.blur).toContain('blur');
    expect(featStyles.blur).toContain('blur');
    expect(regStyles.bg).toBe(serviceStyles.bg);
    expect(featStyles.bg).toBe(serviceStyles.bg);
    expect(regStyles.shadow).toBe(serviceStyles.shadow);
    await expect(featured.getByText('$40')).toBeVisible();
  });

  await proofStep(page, 'Testimonial cards show the same glass treatment as other cards', async () => {
    await page.locator('#testimonials').scrollIntoViewIfNeeded();
    const testimonial = page.locator('.testimonial-card').first();
    await expect(testimonial).toBeVisible();
    const [testStyles, serviceStyles] = await Promise.all([
      testimonial.evaluate((el) => { const cs = getComputedStyle(el); return { blur: cs.backdropFilter || (cs as any).webkitBackdropFilter, bg: cs.backgroundColor, shadow: cs.boxShadow }; }),
      page.locator('.service-card').first().evaluate((el) => { const cs = getComputedStyle(el); return { blur: cs.backdropFilter || (cs as any).webkitBackdropFilter, bg: cs.backgroundColor, shadow: cs.boxShadow }; }),
    ]);
    expect(testStyles.blur).toContain('blur');
    expect(testStyles.bg).toBe(serviceStyles.bg);
    expect(testStyles.shadow).toBe(serviceStyles.shadow);
    await expect(testimonial.getByText('Priya S.')).toBeVisible();
  });

  await proofStep(page, 'Enquiry form panel has the same glass background; fields and submit button stay usable and readable', async () => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    const form = page.locator('.enquiry-form');
    await expect(form).toBeVisible();
    const styles = await form.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { blur: cs.backdropFilter || (cs as any).webkitBackdropFilter, bg: cs.backgroundColor, shadow: cs.boxShadow };
    });
    expect(styles.blur).toContain('blur');
    expect(styles.bg).toMatch(/rgba?\(/);
    expect(styles.shadow).not.toBe('none');

    const nameInput = page.getByLabel('Name');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Test User');
    await expect(nameInput).toHaveValue('Test User');
    const submit = page.getByRole('button', { name: 'Send Enquiry' });
    await expect(submit).toBeVisible();
    await expect(submit).toBeEnabled();
  });

  await proofStep(page, 'No horizontal scroll introduced on desktop by the glass styling', async () => {
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(hasHorizontalScroll).toBe(false);
  });

  let toggle = page.getByRole('button', { name: 'Toggle menu' });
  let nav = page.locator('.nav');

  await proofStep(page, 'Mobile width: nav toggle opens the menu as a glass panel, no layout breakage', async () => {
    await page.setViewportSize({ width: 375, height: 800 });
    toggle = page.getByRole('button', { name: 'Toggle menu' });
    nav = page.locator('.nav');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav).toHaveClass(/is-open/);
    const navLink = page.getByRole('link', { name: 'Services' });
    await expect(navLink).toBeVisible();

    const navStyles = await nav.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { blur: cs.backdropFilter || (cs as any).webkitBackdropFilter };
    });
    expect(navStyles.blur).toContain('blur');

    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(hasHorizontalScroll).toBe(false);
  });

  await proofStep(page, 'Mobile width: nav toggle closes the menu again cleanly', async () => {
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).not.toHaveClass(/is-open/);
  });
});
