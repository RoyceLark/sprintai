/**
 * Rich Salon site behaviour: mobile nav toggle, active-link highlighting
 * on scroll, and appointment enquiry form submission.
 */
(function () {
  'use strict';

  function setupMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function setupActiveLinkHighlight() {
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
    var sections = navLinks
      .map(function (link) {
        var id = link.getAttribute('href').replace('#', '');
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!sections.length || typeof IntersectionObserver === 'undefined') return;

    function setActive(id) {
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function showFieldError(input, errorEl, message) {
    if (errorEl) errorEl.textContent = message || '';
    if (input) input.classList.toggle('is-invalid', Boolean(message));
  }

  function setupEnquiryForm() {
    var form = document.getElementById('enquiry-form');
    if (!form || typeof window.SalonValidation === 'undefined') return;

    var successEl = document.getElementById('form-success');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var fields = {
        name: form.name.value,
        contact: form.contact.value,
        service: form.service.value,
        date: form.date.value
      };

      var result = window.SalonValidation.validateEnquiryForm(fields);

      showFieldError(form.name, document.getElementById('name-error'), result.errors.name);
      showFieldError(form.contact, document.getElementById('contact-error'), result.errors.contact);
      showFieldError(form.service, document.getElementById('service-error'), result.errors.service);
      showFieldError(form.date, document.getElementById('date-error'), result.errors.date);

      if (!result.valid) {
        if (successEl) successEl.hidden = true;
        return;
      }

      if (successEl) successEl.hidden = false;
      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileNav();
    setupActiveLinkHighlight();
    setupEnquiryForm();
  });
})();
