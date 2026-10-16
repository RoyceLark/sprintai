import { describe, it, expect, beforeEach } from 'vitest';
import { initNavToggle } from '../src/js/nav.js';

function setupDom() {
  document.body.innerHTML = `
    <button id="nav-toggle" aria-expanded="false" aria-controls="primary-nav"></button>
    <nav id="primary-nav">
      <ul class="nav-list">
        <li><a href="#home">Home</a></li>
        <li><a href="#features">Features</a></li>
      </ul>
    </nav>
  `;
}

describe('nav toggle', () => {
  beforeEach(() => {
    setupDom();
    initNavToggle(document);
  });

  it('opens the mobile menu on first click', () => {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('primary-nav');

    toggle.click();

    expect(nav.classList.contains('is-open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes the mobile menu on second click', () => {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('primary-nav');

    toggle.click();
    toggle.click();

    expect(nav.classList.contains('is-open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the menu when a nav link is clicked', () => {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('primary-nav');
    const link = nav.querySelector('a');

    toggle.click();
    expect(nav.classList.contains('is-open')).toBe(true);

    link.click();

    expect(nav.classList.contains('is-open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('does nothing and does not throw when the toggle or nav is missing', () => {
    document.body.innerHTML = '';
    expect(() => initNavToggle(document)).not.toThrow();
  });
});
