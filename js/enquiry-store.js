/**
 * Client-side persistence for submitted appointment enquiries.
 * Stores enquiries in localStorage so the admin dashboard (admin.html)
 * can list them. Exposed on `window.SalonEnquiryStore` for the browser
 * and exported via `module.exports` for unit tests (Node/CommonJS).
 */
(function (root) {
  'use strict';

  var STORAGE_KEY = 'salonEnquiries';

  function getStorage() {
    try {
      return root && root.localStorage ? root.localStorage : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * @returns {Array<Object>} all stored enquiries, oldest first.
   */
  function getEnquiries() {
    var storage = getStorage();
    if (!storage) return [];
    try {
      var raw = storage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Append a new enquiry and persist it.
   * @param {{name:string, contact:string, service:string, date:string, message?:string}} enquiry
   * @returns {Array<Object>} the updated list of enquiries.
   */
  function addEnquiry(enquiry) {
    var storage = getStorage();
    var enquiries = getEnquiries();
    enquiries.push({
      name: enquiry && enquiry.name,
      contact: enquiry && enquiry.contact,
      service: enquiry && enquiry.service,
      date: enquiry && enquiry.date,
      message: (enquiry && enquiry.message) || '',
      submittedAt: new Date().toISOString()
    });
    if (storage) {
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
      } catch (e) {
        /* ignore storage write failures (e.g. quota, disabled storage) */
      }
    }
    return enquiries;
  }

  var api = {
    getEnquiries: getEnquiries,
    addEnquiry: addEnquiry
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SalonEnquiryStore = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
