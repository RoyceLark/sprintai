import { test, expect, proofStep } from './sprintflow-proof';

function parseRgba(color: string): { a: number } {
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (!m) return { a: 1 };
  const parts = m[1].split(',').map((p) => parseFloat(p.trim()));
  return { a: parts.length === 4 ? parts[3] : 1 };
}

test('SCRUM-33: glassmorphism treatment, responsive layout, hover transitions and admin panels', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/index.html');

  await proofStep(page, 'Desktop: header/nav shows a frosted-glass look (translucent, blurred background, soft shadow)', async () => {
    const header = page.locator('.site-header');
    await expect(header).toBeVisible();
    const style = await header.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { backdropFilter: cs.backdropFilter || (cs as any).webkitBackdropFilter, background: cs.backgroundColor, boxShadow: cs.boxShadow };
    });
    expect(style.backdropFilter).toContain('blur');
    expect(parseRgba(style.background).a).toBeLessThan(1);
    expect(style.boxShadow).not.toBe('none');
  });

  await proofStep(page, 'Service, price and testimonial cards show translucent blurred glass panels with soft border/shadow and rounded corners', async () => {
    for (const sel of ['.service-card', '.price-card', '.testimonial-card']) {
      const card = page.locator(sel).first();
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
      const style = await card.evaluate((el) => {
        const cs = getComputedStyle(el);
        return {
          backdropFilter: cs.backdropFilter || (cs as any).webkitBackdropFilter,
          background: cs.backgroundColor,
          boxShadow: cs.boxShadow,
          borderRadius: cs.borderRadius,
          borderWidth: cs.borderTopWidth,
        };
      });
      expect(style.backdropFilter).toContain('blur');
      expect(parseRgba(style.background).a).toBeLessThan(1);
      expect(style.boxShadow).not.toBe('none');
      expect(parseFloat(style.borderRadius)).toBeGreaterThan(0);
      expect(parseFloat(style.borderWidth)).toBeGreaterThan(0);
    }
  });

  await proofStep(page, 'Gallery items and the enquiry form show the glass treatment and remain readable (dark text on light panel)', async () => {
    const gallery = page.locator('.gallery-grid__item').first();
    await gallery.scrollIntoViewIfNeeded();
    await expect(gallery).toBeVisible();
    const galleryStyle = await gallery.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { boxShadow: cs.boxShadow, borderRadius: cs.borderRadius };
    });
    expect(galleryStyle.boxShadow).not.toBe('none');
    expect(parseFloat(galleryStyle.borderRadius)).toBeGreaterThan(0);

    const form = page.locator('.enquiry-form');
    await form.scrollIntoViewIfNeeded();
    await expect(form).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Book an Appointment' })).toBeVisible();
    const formStyle = await form.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { backdropFilter: cs.backdropFilter || (cs as any).webkitBackdropFilter, background: cs.backgroundColor, color: cs.color, boxShadow: cs.boxShadow };
    });
    expect(formStyle.backdropFilter).toContain('blur');
    expect(parseRgba(formStyle.background).a).toBeLessThan(1);
    expect(formStyle.boxShadow).not.toBe('none');
  });

  await proofStep(page, 'Hover a nav link and a service card: a smooth CSS transition is declared (not an instant change) and the hover state visibly changes shadow/color', async () => {
    const navLink = page.getByRole('link', { name: 'Services' });
    const navTransition = await navLink.evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(navTransition).not.toBe('0s');
    const colorBefore = await navLink.evaluate((el) => getComputedStyle(el).color);
    await navLink.hover();
    await expect.poll(async () => navLink.evaluate((el) => getComputedStyle(el).color)).not.toBe(colorBefore);

    const card = page.locator('.service-card').first();
    await card.scrollIntoViewIfNeeded();
    const cardTransition = await card.evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(cardTransition).not.toBe('0s');
    const shadowBefore = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    await card.hover();
    await expect.poll(async () => card.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe(shadowBefore);

    await navLink.focus();
    await expect(navLink).toBeFocused();
    const outline = await navLink.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe('none');
  });

  await proofStep(page, 'Tablet width: sections reflow (2-column card grid) with glass styling intact and readable', async () => {
    await page.setViewportSize({ width: 700, height: 900 });
    const cardGrid = page.locator('#services .card-grid');
    await cardGrid.scrollIntoViewIfNeeded();
    const columns = await cardGrid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(2);
    const card = page.locator('.service-card').first();
    await expect(card).toBeVisible();
    const cardBackdrop = await card.evaluate((el) => getComputedStyle(el).backdropFilter || (getComputedStyle(el) as any).webkitBackdropFilter);
    expect(cardBackdrop).toContain('blur');
  });

  await proofStep(page, 'Mobile width: layout reflows to single column and the nav toggle opens a visible menu panel', async () => {
    await page.setViewportSize({ width: 375, height: 800 });
    const cardGrid = page.locator('#services .card-grid');
    const columns = await cardGrid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(1);

    const toggle = page.getByRole('button', { name: 'Toggle menu' });
    await expect(toggle).toBeVisible();
    await toggle.click();
    const nav = page.locator('.nav');
    await expect(nav).toBeVisible();
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });

  await proofStep(page, 'Admin page: header and the enquiries panel (table/empty-state) show the same glass treatment and remain readable', async () => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/admin.html');
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
    const header = page.locator('.site-header');
    const headerStyle = await header.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { backdropFilter: cs.backdropFilter || (cs as any).webkitBackdropFilter, background: cs.backgroundColor };
    });
    expect(headerStyle.backdropFilter).toContain('blur');
    expect(parseRgba(headerStyle.background).a).toBeLessThan(1);

    const panel = page.locator('#no-enquiries, #enquiries-table').first();
    await expect(panel).toBeVisible();
    const panelStyle = await panel.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        backdropFilter: cs.backdropFilter || (cs as any).webkitBackdropFilter,
        background: cs.backgroundColor,
        boxShadow: cs.boxShadow,
        borderRadius: cs.borderRadius,
        color: cs.color,
      };
    });
    expect(panelStyle.backdropFilter).toContain('blur');
    expect(parseRgba(panelStyle.background).a).toBeLessThan(1);
    expect(panelStyle.boxShadow).not.toBe('none');
    expect(parseFloat(panelStyle.borderRadius)).toBeGreaterThan(0);
  });
});
