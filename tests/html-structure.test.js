const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('all required sections exist with the right ids', () => {
  ['id="home"', 'id="about"', 'id="services"', 'id="pricing"', 'id="gallery"', 'id="testimonials"', 'id="contact"'].forEach((id) => {
    assert.ok(html.includes(id), `missing section ${id}`);
  });
});

test('page uses semantic landmark elements', () => {
  ['<header', '<nav', '<main', '<section', '<footer'].forEach((tag) => {
    assert.ok(html.includes(tag), `missing ${tag} element`);
  });
});

test('nav links point to each section anchor', () => {
  ['#home', '#about', '#services', '#pricing', '#gallery', '#testimonials', '#contact'].forEach((anchor) => {
    assert.ok(html.includes(`href="${anchor}"`), `missing nav link to ${anchor}`);
  });
});

test('every enquiry form field has an associated label (for/id pair)', () => {
  ['name', 'contactInfo', 'service', 'date'].forEach((id) => {
    assert.ok(html.includes(`for="${id}"`), `missing <label for="${id}">`);
    assert.ok(html.includes(`id="${id}"`), `missing input/select with id="${id}"`);
  });
});

test('testimonials are static always-visible cards, not a hidden slider', () => {
  assert.ok(html.includes('testimonial-card'));
  assert.ok(!/testimonial[\s\S]{0,80}(display:\s*none|hidden="hidden")/i.test(html));
});

test('services and gallery sections render actual images, not text placeholders', () => {
  const servicesSection = html.slice(html.indexOf('id="services"'), html.indexOf('id="pricing"'));
  const galleryImgCount = (html.slice(html.indexOf('id="gallery"'), html.indexOf('id="testimonials"')).match(/<img\b/g) || []).length;
  const serviceImgCount = (servicesSection.match(/<img\b/g) || []).length;
  assert.ok(serviceImgCount >= 4, 'expected at least 4 <img> elements in the services section');
  assert.ok(galleryImgCount >= 4, 'expected at least 4 <img> elements in the gallery section');
});

test('mobile nav toggle button exists with accessible attributes', () => {
  assert.ok(html.includes('id="navToggle"'));
  assert.ok(html.includes('aria-controls="navList"'));
});
