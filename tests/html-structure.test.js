const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

describe('index.html structure', () => {
  test('has semantic header, nav, main and footer landmarks', () => {
    expect(document.querySelector('header')).not.toBeNull();
    expect(document.querySelector('nav')).not.toBeNull();
    expect(document.querySelector('main')).not.toBeNull();
    expect(document.querySelector('footer')).not.toBeNull();
  });

  test('contains all required sections with correct ids', () => {
    const ids = ['home', 'about', 'services', 'pricing', 'gallery', 'testimonials', 'contact'];
    ids.forEach((id) => {
      const section = document.getElementById(id);
      expect(section).not.toBeNull();
      expect(section.tagName.toLowerCase()).toBe('section');
    });
  });

  test('nav has a link to every section', () => {
    const ids = ['home', 'about', 'services', 'pricing', 'gallery', 'testimonials', 'contact'];
    ids.forEach((id) => {
      const link = document.querySelector(`.nav__link[href="#${id}"]`);
      expect(link).not.toBeNull();
    });
  });

  test('services section lists at least 3 services as cards', () => {
    const cards = document.querySelectorAll('#services .service-card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
    cards.forEach((card) => {
      expect(card.querySelector('h3')).not.toBeNull();
      expect(card.querySelector('p')).not.toBeNull();
      expect(card.querySelector('img')).not.toBeNull();
    });
  });

  test('pricing section lists price cards with a price', () => {
    const cards = document.querySelectorAll('#pricing .price-card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
    cards.forEach((card) => {
      expect(card.querySelector('.price-card__price')).not.toBeNull();
    });
  });

  test('gallery section shows images in a grid', () => {
    const images = document.querySelectorAll('#gallery .gallery-grid__item');
    expect(images.length).toBeGreaterThanOrEqual(4);
  });

  test('all testimonials are always-visible static cards (no hidden attribute/inline display:none)', () => {
    const cards = document.querySelectorAll('#testimonials .testimonial-card');
    expect(cards.length).toBeGreaterThanOrEqual(2);
    cards.forEach((card) => {
      expect(card.hasAttribute('hidden')).toBe(false);
      expect(card.getAttribute('style') || '').not.toMatch(/display:\s*none/);
    });
  });

  test('contact section has address, phone, email and an enquiry form with required fields', () => {
    const contact = document.getElementById('contact');
    expect(contact.querySelector('a[href^="tel:"]')).not.toBeNull();
    expect(contact.querySelector('a[href^="mailto:"]')).not.toBeNull();

    const form = document.getElementById('enquiry-form');
    expect(form).not.toBeNull();

    ['name', 'contact', 'service', 'date'].forEach((fieldName) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      expect(field).not.toBeNull();
      expect(field.hasAttribute('required')).toBe(true);

      const labelFor = fieldName === 'contact' ? 'contact-input' : fieldName;
      const label = form.querySelector(`label[for="${labelFor}"]`);
      expect(label).not.toBeNull();
    });
  });
});
