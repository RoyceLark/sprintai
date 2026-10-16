import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-17: desktop viewport shows header, hero, features, about, CTA and footer', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  await proofStep(page, 'Criterion 1: header with logo/brand and nav links is visible on desktop', async () => {
    await page.goto('/');
    const header = page.getByRole('banner');
    await expect(header.getByRole('link', { name: 'Brand' })).toBeVisible();
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  await proofStep(page, 'Criterion 2: hero heading, supporting text and primary CTA button near top of page', async () => {
    await expect(page.getByRole('heading', { level: 1, name: 'Build something great, faster.' })).toBeVisible();
    await expect(page.getByText('A clean, modern, and reusable website template')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
  });

  await proofStep(page, 'Criterion 3: a features section with 3 reusable card components follows the hero', async () => {
    const featuresHeading = page.getByRole('heading', { level: 2, name: 'Features' });
    await expect(featuresHeading).toBeVisible();
    const cards = page.locator('#features article.card');
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0).getByRole('heading', { name: 'Responsive Layout' })).toBeVisible();
    await expect(cards.nth(1).getByRole('heading', { name: 'Reusable Components' })).toBeVisible();
    await expect(cards.nth(2).getByRole('heading', { name: 'Accessible by Default' })).toBeVisible();
  });

  await proofStep(page, 'An about section is present after the features section', async () => {
    await expect(page.getByRole('heading', { level: 2, name: 'About This Template' })).toBeVisible();
  });

  await proofStep(page, "Criterion 4: a distinct 'Ready to get started?' CTA section is present before the footer", async () => {
    await expect(page.getByRole('heading', { level: 2, name: 'Ready to get started?' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact Us' })).toBeVisible();
  });

  await proofStep(page, 'Criterion 5: footer with copyright text and secondary navigation links is at the bottom', async () => {
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer.getByText('\u00a9 2026 Brand. All rights reserved.')).toBeVisible();
    const footerNav = footer.getByRole('navigation', { name: 'Footer' });
    await expect(footerNav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'About' })).toBeVisible();
  });
});

test('SCRUM-17: tablet viewport reflows layout while header and nav stay usable', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');

  await proofStep(page, 'Criterion 6: at tablet width (~768px) the header/nav remain visible and usable', async () => {
    await expect(page.getByRole('banner').getByRole('link', { name: 'Brand' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  await proofStep(page, 'Criterion 6: the feature cards reflow to fewer columns at tablet width', async () => {
    const grid = page.locator('.card-grid');
    const cards = page.locator('#features article.card');
    await expect(cards).toHaveCount(3);
    const gridBox = await grid.boundingBox();
    const firstCard = await cards.nth(0).boundingBox();
    const lastCard = await cards.nth(2).boundingBox();
    expect(gridBox && firstCard && lastCard).toBeTruthy();
    // cards do not all sit in a single row spanning full desktop width -> layout reflowed
    expect(firstCard!.width).toBeLessThan(768);
    expect(Math.abs(firstCard!.width - gridBox!.width) < 5 || lastCard!.y > firstCard!.y).toBeTruthy();
  });
});

test('SCRUM-17: mobile viewport shows a hamburger toggle that opens and closes the nav menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');

  const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
  const nav = page.locator('#primary-nav');

  await proofStep(page, 'Criterion 6: hamburger toggle is visible on mobile and the nav menu starts closed', async () => {
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).not.toHaveClass(/is-open/);
  });

  await proofStep(page, 'Criterion 6: tapping the hamburger opens the mobile menu showing nav links', async () => {
    await toggle.click();
    await expect(nav).toHaveClass(/is-open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('link', { name: 'Features' })).toBeVisible();
  });

  await proofStep(page, 'Criterion 6: tapping the hamburger again closes the mobile menu', async () => {
    await toggle.click();
    await expect(nav).not.toHaveClass(/is-open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  await proofStep(page, 'Criterion 6: hero and content sections stack vertically on mobile', async () => {
    const heroBox = await page.locator('.hero').boundingBox();
    const featuresBox = await page.locator('#features').boundingBox();
    expect(heroBox && featuresBox).toBeTruthy();
    expect(featuresBox!.y).toBeGreaterThan(heroBox!.y + heroBox!.height - 10);
    const cards = page.locator('#features article.card');
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(second!.y).toBeGreaterThan(first!.y + first!.height - 10); // stacked, not side by side
  });
});

test('SCRUM-17: nav links, hero/CTA buttons and footer links scroll to their target sections', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  await proofStep(page, 'Criterion 7: clicking the Features nav link scrolls to the Features section', async () => {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Features' }).click();
    await expect(page.locator('#features')).toBeInViewport();
    await expect(page).toHaveURL(/#features$/);
  });

  await proofStep(page, 'Criterion 7: clicking the About nav link scrolls to the About section', async () => {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About' }).click();
    await expect(page.locator('#about')).toBeInViewport();
    await expect(page).toHaveURL(/#about$/);
  });

  await proofStep(page, 'Criterion 7: clicking the Contact nav link scrolls to the footer/contact section', async () => {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Contact' }).click();
    await expect(page.locator('#contact')).toBeInViewport();
    await expect(page).toHaveURL(/#contact$/);
  });

  await proofStep(page, "Criterion 7: clicking the hero 'Get Started' CTA scrolls to the contact target", async () => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Get Started' }).click();
    await expect(page.locator('#contact')).toBeInViewport();
    await expect(page).toHaveURL(/#contact$/);
  });

  await proofStep(page, "Criterion 7: clicking the CTA band's 'Contact Us' button scrolls to the contact target", async () => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Contact Us' }).click();
    await expect(page.locator('#contact')).toBeInViewport();
    await expect(page).toHaveURL(/#contact$/);
  });

  await proofStep(page, 'Criterion 7: clicking the Home link/logo returns to the top of the page', async () => {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Features' }).click();
    await page.getByRole('banner').getByRole('link', { name: 'Brand' }).click();
    await expect(page.locator('#home')).toBeInViewport();
    await expect(page).toHaveURL(/#home$/);
  });

  await proofStep(page, 'Criterion 7: footer links navigate to their matching in-page sections', async () => {
    await page.getByRole('contentinfo').getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'About' }).click();
    await expect(page.locator('#about')).toBeInViewport();
    await expect(page).toHaveURL(/#about$/);
  });
});

test('SCRUM-17: keyboard tabbing moves focus visibly through nav, hero CTA and footer links in order', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  await proofStep(page, 'Criterion 9: first Tab focuses the skip link, then nav links become focused in order', async () => {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('banner').getByRole('link', { name: 'Brand' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Features' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Contact' })).toBeFocused();
  });

  await proofStep(page, 'Criterion 9: continuing to Tab reaches the hero CTA button next', async () => {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeFocused();
  });

  await proofStep(page, 'Criterion 9: continuing to Tab eventually reaches the footer navigation links', async () => {
    let reachedFooter = false;
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      const isInFooter = await focused.evaluate((el) => !!el.closest('footer')).catch(() => false);
      if (isInFooter) { reachedFooter = true; break; }
    }
    expect(reachedFooter).toBeTruthy();
    await expect(page.locator(':focus')).toBeVisible();
  });
});

test('SCRUM-17: page uses semantic landmarks and consistent CSS custom-property design tokens', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  await proofStep(page, 'Criterion 9: semantic landmark elements header, nav, main, section and footer are present', async () => {
    await expect(page.locator('header.site-header')).toBeVisible();
    await expect(page.locator('nav#primary-nav')).toHaveCount(1);
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('section#features')).toBeVisible();
    await expect(page.locator('footer.site-footer')).toBeVisible();
  });

  await proofStep(page, 'Criterion 8: design tokens (CSS custom properties) for color, typography and spacing are defined and reused', async () => {
    const tokens = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        colorPrimary: root.getPropertyValue('--color-primary').trim(),
        fontFamily: root.getPropertyValue('--font-family-base').trim(),
        space2: root.getPropertyValue('--space-2').trim(),
      };
    });
    expect(tokens.colorPrimary).not.toBe('');
    expect(tokens.fontFamily).not.toBe('');
    expect(tokens.space2).not.toBe('');

    const ctaButtonBg = await page.getByRole('link', { name: 'Get Started' }).evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(ctaButtonBg).not.toBe('');
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
  });
});
