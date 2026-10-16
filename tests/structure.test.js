import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('page structure', () => {
  beforeAll(() => {
    const html = readFileSync(resolve(__dirname, '../index.html'), 'utf-8');
    document.documentElement.innerHTML = html.split('<body')[1]
      ? html.substring(html.indexOf('<body'))
      : html;
    document.body.innerHTML = html;
  });

  it('has a header with a logo link and primary navigation', () => {
    const header = document.querySelector('header.site-header');
    expect(header).not.toBeNull();
    expect(header.querySelector('.logo')).not.toBeNull();

    const nav = document.getElementById('primary-nav');
    expect(nav).not.toBeNull();
    const links = nav.querySelectorAll('a');
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  it('has a mobile nav toggle wired to the primary nav', () => {
    const toggle = document.getElementById('nav-toggle');
    expect(toggle).not.toBeNull();
    expect(toggle.getAttribute('aria-controls')).toBe('primary-nav');
  });

  it('has a hero section with a heading and a call-to-action link', () => {
    const hero = document.querySelector('.hero');
    expect(hero).not.toBeNull();
    expect(hero.querySelector('h1')).not.toBeNull();
    expect(hero.querySelector('.btn')).not.toBeNull();
  });

  it('has at least one content section with reusable cards', () => {
    const cards = document.querySelectorAll('.card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('has a distinct call-to-action section with an anchorable id', () => {
    const cta = document.querySelector('.cta');
    expect(cta).not.toBeNull();
    expect(cta.id).toBe('cta');
    expect(cta.querySelector('.btn')).not.toBeNull();
  });

  it('has a footer with links', () => {
    const footer = document.querySelector('footer.site-footer');
    expect(footer).not.toBeNull();
    expect(footer.querySelectorAll('a').length).toBeGreaterThan(0);
  });

  it('has no dead placeholder links (every href is a real in-page anchor)', () => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    expect(anchors.length).toBeGreaterThan(0);
    anchors.forEach((a) => {
      const href = a.getAttribute('href');
      expect(href).not.toBe('#');
      expect(href.startsWith('#')).toBe(true);
      const targetId = href.slice(1);
      expect(document.getElementById(targetId)).not.toBeNull();
    });
  });
});
