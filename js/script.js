// Rich Salon site interactions: mobile nav toggle, active nav highlighting, and enquiry form validation

(function () {
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    var navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Highlight the nav link matching the section currently in view.
    var sectionIds = ['home', 'about', 'services', 'pricing', 'gallery', 'contact'];
    var sections = sectionIds
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    function setActiveLink(id) {
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }

    if (sections.length && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActiveLink(entry.target.id);
            }
          });
        },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      sections.forEach(function (section) {
        observer.observe(section);
      });
    }
  }

  var form = document.getElementById('enquiryForm');
  if (form) {
    var fields = {
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      phone: document.getElementById('phone'),
      service: document.getElementById('service'),
      date: document.getElementById('date'),
    };
    var errors = {
      name: document.getElementById('nameError'),
      email: document.getElementById('emailError'),
      phone: document.getElementById('phoneError'),
      service: document.getElementById('serviceError'),
      date: document.getElementById('dateError'),
    };
    var successMessage = document.getElementById('formSuccess');

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phonePattern = /^[0-9+\-()\s]{7,}$/;

    function setError(field, message) {
      var input = fields[field];
      var errorEl = errors[field];
      if (errorEl) {
        errorEl.textContent = message || '';
      }
      if (input) {
        input.classList.toggle('invalid', Boolean(message));
      }
    }

    function validate() {
      var valid = true;

      if (!fields.name.value.trim()) {
        setError('name', 'Name is required.');
        valid = false;
      } else {
        setError('name', '');
      }

      if (!fields.email.value.trim()) {
        setError('email', 'Email is required.');
        valid = false;
      } else if (!emailPattern.test(fields.email.value.trim())) {
        setError('email', 'Enter a valid email address.');
        valid = false;
      } else {
        setError('email', '');
      }

      if (!fields.phone.value.trim()) {
        setError('phone', 'Phone number is required.');
        valid = false;
      } else if (!phonePattern.test(fields.phone.value.trim())) {
        setError('phone', 'Enter a valid phone number.');
        valid = false;
      } else {
        setError('phone', '');
      }

      if (!fields.service.value) {
        setError('service', 'Please select a service.');
        valid = false;
      } else {
        setError('service', '');
      }

      if (!fields.date.value) {
        setError('date', 'Please choose a preferred date.');
        valid = false;
      } else {
        setError('date', '');
      }

      return valid;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (successMessage) {
        successMessage.textContent = '';
      }

      if (validate()) {
        if (successMessage) {
          successMessage.textContent = 'Thank you! Your enquiry has been received. We will contact you shortly.';
        }
        form.reset();
      }
    });
  }
})();
