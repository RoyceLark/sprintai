/**
 * Admin dashboard behaviour: lists submitted enquiries from
 * window.SalonEnquiryStore (js/enquiry-store.js) in a table, or shows
 * an empty-state message when there are none.
 */
(function () {
  'use strict';

  function escapeHtml(value) {
    var div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
  }

  function renderEnquiries() {
    var tableBody = document.getElementById('enquiries-table-body');
    var table = document.getElementById('enquiries-table');
    var emptyEl = document.getElementById('no-enquiries');
    if (!tableBody || typeof window.SalonEnquiryStore === 'undefined') return;

    var enquiries = window.SalonEnquiryStore.getEnquiries();

    if (!enquiries.length) {
      if (table) table.hidden = true;
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (table) table.hidden = false;
    if (emptyEl) emptyEl.hidden = true;

    tableBody.innerHTML = enquiries
      .map(function (enquiry) {
        return (
          '<tr>' +
          '<td>' + escapeHtml(enquiry.name) + '</td>' +
          '<td>' + escapeHtml(enquiry.contact) + '</td>' +
          '<td>' + escapeHtml(enquiry.service) + '</td>' +
          '<td>' + escapeHtml(enquiry.date) + '</td>' +
          '<td>' + escapeHtml(enquiry.message) + '</td>' +
          '</tr>'
        );
      })
      .join('');
  }

  document.addEventListener('DOMContentLoaded', renderEnquiries);
})();
