const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

/** Extract the declaration block for a given CSS selector (first match). */
function ruleFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escaped + '\\s*\\{([^}]*)\\}');
  const match = css.match(re);
  return match ? match[1] : '';
}

describe('glassmorphism tokens', () => {
  test('shared glass custom properties are defined on :root', () => {
    const root = ruleFor(':root');
    ['--glass-bg:', '--glass-bg-strong:', '--glass-border:', '--glass-blur:', '--glass-shadow:', '--glass-radius:'].forEach((token) => {
      expect(root).toContain(token);
    });
  });

  test('header uses the shared glass blur and shadow tokens', () => {
    const rule = ruleFor('.site-header');
    expect(rule).toMatch(/backdrop-filter:\s*var\(--glass-blur\)/);
    expect(rule).toMatch(/box-shadow:\s*var\(--glass-shadow\)/);
  });

  test('service, price and testimonial cards share the same glass declaration block', () => {
    const re = /\.service-card,\s*\n\.price-card,\s*\n\.testimonial-card\s*\{([^}]*)\}/;
    const match = css.match(re);
    expect(match).not.toBeNull();
    const rule = match[1];
    expect(rule).toMatch(/background:\s*var\(--glass-bg\)/);
    expect(rule).toMatch(/backdrop-filter:\s*var\(--glass-blur\)/);
    expect(rule).toMatch(/box-shadow:\s*var\(--glass-shadow\)/);
  });

  test('enquiry form uses the shared glass tokens', () => {
    const rule = ruleFor('.enquiry-form');
    expect(rule).toMatch(/background:\s*var\(--glass-bg\)/);
    expect(rule).toMatch(/backdrop-filter:\s*var\(--glass-blur\)/);
    expect(rule).toMatch(/box-shadow:\s*var\(--glass-shadow\)/);
  });

  test('sections reserve scroll margin so the sticky glass header never hides content scrolled into view', () => {
    const rule = ruleFor('.section');
    expect(rule).toMatch(/scroll-margin-top:\s*\d/);
  });
});
