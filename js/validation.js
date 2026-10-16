// Pure validation helpers - no DOM dependency so they can be unit tested with Jest (Node/CommonJS)
// and also used directly in the browser via <script> (falls back gracefully if `module` is undefined).

function isValidName(value) {
  return typeof value === "string" && value.trim().length >= 2;
}

function isValidEmail(value) {
  if (typeof value !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value.trim());
}

function isValidPhone(value) {
  if (typeof value !== "string") return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function isValidService(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDate(value) {
  if (typeof value !== "string" || value.trim().length === 0) return false;
  const date = new Date(value + "T00:00:00");
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() >= today.getTime();
}

function isValidTime(value) {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value.trim());
}

function validateEnquiry(data) {
  const errors = {};

  if (!isValidName(data.name)) {
    errors.name = "Please enter your full name (at least 2 characters).";
  }
  if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!isValidPhone(data.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!isValidService(data.service)) {
    errors.service = "Please select a service.";
  }
  if (!isValidDate(data.date)) {
    errors.date = "Please choose a valid date (today or later).";
  }
  if (!isValidTime(data.time)) {
    errors.time = "Please choose a preferred time.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    isValidName,
    isValidEmail,
    isValidPhone,
    isValidService,
    isValidDate,
    isValidTime,
    validateEnquiry,
  };
}
