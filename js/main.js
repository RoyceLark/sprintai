document.addEventListener("DOMContentLoaded", function () {
  // ----- Mobile nav toggle -----
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // ----- Active link highlight + close mobile nav on click -----
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.forEach(function (l) {
        l.classList.remove("active");
      });
      link.classList.add("active");
      if (primaryNav) {
        primaryNav.classList.remove("open");
      }
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // ----- Footer year -----
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ----- Appointment enquiry form -----
  const form = document.getElementById("enquiryForm");
  if (!form) return;

  const successEl = document.getElementById("formSuccess");
  const fields = ["name", "email", "phone", "service", "date", "time"];

  function showErrors(errors) {
    fields.forEach(function (field) {
      const input = document.getElementById(field);
      const errorEl = document.getElementById(field + "Error");
      if (!input || !errorEl) return;

      if (errors[field]) {
        input.classList.add("invalid");
        errorEl.textContent = errors[field];
      } else {
        input.classList.remove("invalid");
        errorEl.textContent = "";
      }
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      service: document.getElementById("service").value,
      date: document.getElementById("date").value,
      time: document.getElementById("time").value,
      message: document.getElementById("message").value,
    };

    const result = validateEnquiry(data);
    showErrors(result.errors);

    if (result.valid) {
      successEl.textContent =
        "Thank you, " + data.name.trim() + "! Your enquiry has been received. We will contact you soon.";
      form.reset();
    } else {
      successEl.textContent = "";
    }
  });
});
