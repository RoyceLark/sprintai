// Appointment enquiry form validation.
// Exposed as pure functions so they can be unit tested (Node) and used in the browser.

function validateName(value) {
  return typeof value === 'string' && value.trim().length >= 2;
}

function validateContact(value) {
  if (typeof value !== 'string') return false;
  var v = value.trim();
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var phoneRe = /^[0-9+\-\s()]{7,}$/;
  return emailRe.test(v) || phoneRe.test(v);
}

function validateService(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateDate(value) {
  if (!value) return false;
  var selected = new Date(value);
  if (isNaN(selected.getTime())) return false;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected >= today;
}

function validateEnquiryForm(data) {
  data = data || {};
  var errors = {};
  if (!validateName(data.name)) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }
  if (!validateContact(data.contactInfo)) {
    errors.contactInfo = 'Enter a valid email address or phone number.';
  }
  if (!validateService(data.service)) {
    errors.service = 'Please select a service.';
  }
  if (!validateDate(data.date)) {
    errors.date = 'Please choose a valid, upcoming date.';
  }
  return errors;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateName: validateName,
    validateContact: validateContact,
    validateService: validateService,
    validateDate: validateDate,
    validateEnquiryForm: validateEnquiryForm
  };
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('enquiryForm');
    if (!form) return;

    var successEl = document.getElementById('formSuccess');
    var fields = ['name', 'contactInfo', 'service', 'date'];

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var data = {
        name: form.name.value,
        contactInfo: form.contactInfo.value,
        service: form.service.value,
        date: form.date.value,
        message: form.message.value
      };

      var errors = validateEnquiryForm(data);

      fields.forEach(function (field) {
        var errEl = document.getElementById(field + 'Error');
        if (errEl) {
          errEl.textContent = errors[field] || '';
        }
      });

      if (Object.keys(errors).length === 0) {
        if (successEl) successEl.hidden = false;
        form.reset();
      } else if (successEl) {
        successEl.hidden = true;
      }
    });
  });
}
