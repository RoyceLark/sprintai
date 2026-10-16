/**
 * Validation helpers for the Rich Salon appointment enquiry form.
 * Exposed on `window.SalonValidation` for use in the browser and
 * exported via `module.exports` for unit tests (Node/CommonJS).
 */
(function (root) {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^[0-9+()\-\s]{7,}$/;

  function isRequiredFilled(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function isValidEmailOrPhone(value) {
    if (!isRequiredFilled(value)) return false;
    var v = value.trim();
    return EMAIL_RE.test(v) || PHONE_RE.test(v);
  }

  function isValidDate(value) {
    if (!isRequiredFilled(value)) return false;
    var date = new Date(value);
    if (isNaN(date.getTime())) return false;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  /**
   * Validate the enquiry form fields.
   * @param {{name:string, contact:string, service:string, date:string}} fields
   * @returns {{valid: boolean, errors: Object.<string,string>}}
   */
  function validateEnquiryForm(fields) {
    fields = fields || {};
    var errors = {};

    if (!isRequiredFilled(fields.name)) {
      errors.name = 'Please enter your name.';
    }

    if (!isValidEmailOrPhone(fields.contact)) {
      errors.contact = 'Please enter a valid email address or phone number.';
    }

    if (!isRequiredFilled(fields.service)) {
      errors.service = 'Please select a service.';
    }

    if (!isValidDate(fields.date)) {
      errors.date = 'Please choose a valid, upcoming date.';
    }

    return { valid: Object.keys(errors).length === 0, errors: errors };
  }

  var api = {
    isRequiredFilled: isRequiredFilled,
    isValidEmailOrPhone: isValidEmailOrPhone,
    isValidDate: isValidDate,
    validateEnquiryForm: validateEnquiryForm
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SalonValidation = api;
  }
})(typeof window !== 'undefined' ? window : this);
