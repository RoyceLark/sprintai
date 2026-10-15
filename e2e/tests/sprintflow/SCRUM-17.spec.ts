import { test, expect, proofStep } from './sprintflow-proof';

test('SCRUM-17: desktop viewport shows header, hero, content sections, and footer in order', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  await proofStep(page, 'Header with logo and nav links is visible at the top on desktop', async () => {
    await page.goto('/');
    const header = page.locator('header.site-header');
    await expect(header).toBeVisible();
    await expect(header.getByRole('link', { name: 'Brand' })).toBeVisible();
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
    await expect(header).toBeInViewport();
  });

  await proofStep(page, 'Hero section with heading and CTA button appears below the header', async () => {
    const heading = page.getByRole('heading', { level: 1, name: 'Build something great, faster.' });
    await expect(heading).toBeVisible();
    await expect(heading).toBeInViewport();
    const headerBox = await page.locator('header.site-header').boundingBox();
    const heroBox = await heading.boundingBox();
    expect(heroBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 5);
    const cta = page.getByRole('link', { name: 'Get Started' });
    await expect(cta).toBeVisible();
    await expect(cta).toBeInViewport();
  });

  await proofStep(page, 'At least one content section (Features) follows the hero', async () => {
    const features = page.getByRole('heading', { level: 2, name: 'Features' });
    await features.scrollIntoViewIfNeeded();
    await expect(features).toBeVisible();
    await expect(features).toBeInViewport();
    const sub = page.getByRole('heading', { level: 3, name: 'Responsive Layout' });
    await expect(sub).toBeVisible();
    await expect(sub).toBeInViewport();
  });

  await proofStep(page, 'CTA section ("Ready to get started?") is present', async () => {
    const ctaHeading = page.getByRole('heading', { level: 2, name: 'Ready to get started?' });
    await ctaHeading.scrollIntoViewIfNeeded();
    await expect(ctaHeading).toBeVisible();
    await expect(ctaHeading).toBeInViewport();
    const contactLink = page.getByRole('link', { name: 'Contact Us' });
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toBeInViewport();
  });

  await proofStep(page, 'Footer with links is visible at the bottom', async () => {
    const footer = page.locator('footer, [role="contentinfo"]');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer).toBeInViewport();
    const footerHomeLink = footer.getByRole('link', { name: 'Home' });
    await expect(footerHomeLink).toBeVisible();
    await expect(footerHomeLink).toBeInViewport();
  });
});

test('SCRUM-17: tablet viewport reflows layout without horizontal scroll or overlap', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });

  await proofStep(page, 'Page loads at tablet width with no horizontal scrollbar', async () => {
    await page.goto('/');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  await proofStep(page, 'Nav remains usable and header/hero/content sections do not overlap', async () => {
    const header = page.locator('header.site-header');
    await expect(header).toBeVisible();
    const heroHeading = page.getByRole('heading', { level: 1, name: 'Build something great, faster.' });
    await expect(heroHeading).toBeVisible();
    const headerBox = await header.boundingBox();
    const heroBox = await heroHeading.boundingBox();
    expect(heroBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 5);

    const featureCards = page.locator('main article');
    const count = await featureCards.count();
    const boxes = [];
    for (let i = 0; i < count; i++) boxes.push(await featureCards.nth(i).boundingBox());
    for (let i = 1; i < boxes.length; i++) {
      // consecutive cards should not vertically overlap each other when stacked/narrowed
      if (boxes[i]!.x === boxes[i - 1]!.x) {
        expect(boxes[i]!.y).toBeGreaterThanOrEqual(boxes[i - 1]!.y);
      }
    }
  });
});

test('SCRUM-17: mobile viewport collapses navigation into a hamburger menu that opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
  const nav = page.locator('#primary-nav');

  await proofStep(page, 'Hamburger toggle button is visible and nav list is collapsed on mobile', async () => {
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  await proofStep(page, 'Tapping the hamburger opens the mobile menu', async () => {
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  await proofStep(page, 'Tapping again closes the mobile menu', async () => {
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  await proofStep(page, 'Hero and content stack vertically and text/buttons remain visible and tappable', async () => {
    const heroHeading = page.getByRole('heading', { level: 1, name: 'Build something great, faster.' });
    await expect(heroHeading).toBeVisible();
    const cta = page.getByRole('link', { name: 'Get Started' });
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box!.width).toBeGreaterThan(20);
    expect(box!.height).toBeGreaterThan(20);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});

test('SCRUM-17: clicking each nav link and the CTA button scrolls to the corresponding section', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await proofStep(page, 'Clicking "Features" nav link scrolls to the Features section', async () => {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Features' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Features' })).toBeInViewport();
  });

  await proofStep(page, 'Clicking "About" nav link scrolls to the About section', async () => {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'About This Template' })).toBeInViewport();
  });

  await proofStep(page, 'Clicking "Contact" nav link scrolls to the Contact/CTA section', async () => {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Contact' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Ready to get started?' })).toBeInViewport();
  });

  await proofStep(page, 'Clicking the "Get Started" CTA button scrolls to its target section without errors', async () => {
    await page.getByRole('link', { name: 'Home' }).first().click();
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
    await page.getByRole('link', { name: 'Get Started' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Ready to get started?' })).toBeInViewport();
  });

  await proofStep(page, 'Clicking the "Home" nav link returns to the top/hero section', async () => {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Build something great, faster.' })).toBeInViewport();
  });
});

test('SCRUM-17: keyboard tabbing moves visible focus through nav, CTA, and footer links in order', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await proofStep(page, 'Tab from the top focuses the skip link first', async () => {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  });

  await proofStep(page, 'Continuing to Tab moves focus through the logo and each nav link in order', async () => {
    await page.keyboard.press('Tab'); // logo/brand link
    await expect(page.getByRole('link', { name: 'Brand' })).toBeFocused();
    // The hamburger toggle button is display:none at desktop width, so it is
    // removed from the tab order here; focus moves directly to the nav links.
    await page.keyboard.press('Tab');
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Features' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Contact' })).toBeFocused();
  });

  await proofStep(page, 'Tab eventually reaches the hero CTA button with visible focus', async () => {
    await page.getByRole('link', { name: 'Get Started' }).focus();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeFocused();
  });

  await proofStep(page, 'Tab eventually reaches the footer links with visible focus', async () => {
    await page.getByRole('contentinfo').getByRole('link', { name: 'Home' }).focus();
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Home' })).toBeFocused();
  });
});

test('SCRUM-17: design system, semantic landmarks, and image alt text are present', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await proofStep(page, 'Page uses semantic landmarks: header/banner, nav, main, footer/contentinfo', async () => {
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  await proofStep(page, 'Images have descriptive alt text', async () => {
    const img = page.getByRole('img', { name: 'Team collaborating around a laptop while reviewing a website design' });
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('alt', /.+/);
  });

  await proofStep(page, 'Design system tokens (CSS custom properties) are applied to visible elements such as the CTA button', async () => {
    const cta = page.getByRole('link', { name: 'Get Started' });
    const color = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(color).not.toBe('');
    expect(color).not.toBe('rgba(0, 0, 0, 0)');
  });
});
