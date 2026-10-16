const {
  isRequiredFilled,
  isValidEmailOrPhone,
  isValidDate,
  validateEnquiryForm
} = require('../js/validation.js');

describe('isRequiredFilled', () => {
  test('returns false for empty or whitespace-only string', () => {
    expect(isRequiredFilled('')).toBe(false);
    expect(isRequiredFilled('   ')).toBe(false);
  });

  test('returns true for a non-empty string', () => {
    expect(isRequiredFilled('Jane Doe')).toBe(true);
  });
});

describe('isValidEmailOrPhone', () => {
  test('accepts a valid email', () => {
    expect(isValidEmailOrPhone('jane@example.com')).toBe(true);
  });

  test('accepts a valid phone number', () => {
    expect(isValidEmailOrPhone('+1 (555) 123-4567')).toBe(true);
  });

  test('rejects an invalid value', () => {
    expect(isValidEmailOrPhone('not-valid')).toBe(false);
    expect(isValidEmailOrPhone('')).toBe(false);
  });
});

describe('isValidDate', () => {
  test('rejects an empty value', () => {
    expect(isValidDate('')).toBe(false);
  });

  test('rejects a past date', () => {
    expect(isValidDate('2000-01-01')).toBe(false);
  });

  test('accepts a future date', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const iso = future.toISOString().slice(0, 10);
    expect(isValidDate(iso)).toBe(true);
  });
});

describe('validateEnquiryForm', () => {
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);
  const futureDate = future.toISOString().slice(0, 10);

  test('passes with all valid fields', () => {
    const result = validateEnquiryForm({
      name: 'Jane Doe',
      contact: 'jane@example.com',
      service: 'hair',
      date: futureDate
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test('fails and reports errors for missing required fields', () => {
    const result = validateEnquiryForm({ name: '', contact: '', service: '', date: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.contact).toBeDefined();
    expect(result.errors.service).toBeDefined();
    expect(result.errors.date).toBeDefined();
  });

  test('fails for a past date even when other fields are valid', () => {
    const result = validateEnquiryForm({
      name: 'Jane Doe',
      contact: 'jane@example.com',
      service: 'hair',
      date: '2000-01-01'
    });
    expect(result.valid).toBe(false);
    expect(result.errors.date).toBeDefined();
  });
});
