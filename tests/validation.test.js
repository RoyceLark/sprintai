const test = require('node:test');
const assert = require('node:assert/strict');
const {
  validateName,
  validateContact,
  validateService,
  validateDate,
  validateEnquiryForm
} = require('../js/validation.js');

test('validateName rejects empty or too-short names, accepts a normal name', () => {
  assert.equal(validateName(''), false);
  assert.equal(validateName('A'), false);
  assert.equal(validateName('Jane'), true);
});

test('validateContact accepts a valid email or phone, rejects garbage', () => {
  assert.equal(validateContact('jane@example.com'), true);
  assert.equal(validateContact('+1 (555) 123-4567'), true);
  assert.equal(validateContact('not-valid'), false);
  assert.equal(validateContact(''), false);
});

test('validateService requires a non-empty selection', () => {
  assert.equal(validateService(''), false);
  assert.equal(validateService('haircut'), true);
});

test('validateDate rejects empty and past dates, accepts today and future dates', () => {
  assert.equal(validateDate(''), false);
  assert.equal(validateDate('2000-01-01'), false);

  const future = new Date();
  future.setDate(future.getDate() + 7);
  const iso = future.toISOString().slice(0, 10);
  assert.equal(validateDate(iso), true);
});

test('validateEnquiryForm returns no errors for valid data, and one error per invalid field', () => {
  const future = new Date();
  future.setDate(future.getDate() + 3);
  const iso = future.toISOString().slice(0, 10);

  const okErrors = validateEnquiryForm({
    name: 'Jane',
    contactInfo: 'jane@example.com',
    service: 'haircut',
    date: iso,
    message: 'Looking forward to it.'
  });
  assert.deepEqual(okErrors, {});

  const badErrors = validateEnquiryForm({ name: '', contactInfo: '', service: '', date: '' });
  assert.equal(Object.keys(badErrors).length, 4);
  assert.ok(badErrors.name);
  assert.ok(badErrors.contactInfo);
  assert.ok(badErrors.service);
  assert.ok(badErrors.date);
});
