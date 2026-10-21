/**
 * Admin dashboard behaviour for the service catalog: lists services
 * from window.SalonServiceStore (js/service-store.js), and lets the
 * admin add new services, edit existing ones (name, duration, price)
 * and enable/disable them without deleting them.
 */
(function () {
  'use strict';

  function escapeHtml(value) {
    var div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
  }

  function showFieldError(input, errorEl, message) {
    if (errorEl) errorEl.textContent = message || '';
    if (input) input.classList.toggle('is-invalid', Boolean(message));
  }

  function formatPrice(price) {
    var num = Number(price) || 0;
    return '$' + num.toFixed(2);
  }

  function renderServicesAdmin() {
    var tableBody = document.getElementById('services-table-body');
    var table = document.getElementById('services-table');
    var emptyEl = document.getElementById('no-services');
    if (!tableBody || typeof window.SalonServiceStore === 'undefined') return;

    var services = window.SalonServiceStore.getServices();

    if (!services.length) {
      if (table) table.hidden = true;
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (table) table.hidden = false;
    if (emptyEl) emptyEl.hidden = true;

    tableBody.innerHTML = services
      .map(function (service) {
        var enabled = service.enabled !== false;
        return (
          '<tr>' +
          '<td>' + escapeHtml(service.name) + '</td>' +
          '<td>' + escapeHtml(service.duration) + ' min</td>' +
          '<td>' + formatPrice(service.price) + '</td>' +
          '<td>' + (enabled ? 'Enabled' : 'Disabled') + '</td>' +
          '<td>' +
          '<button type="button" class="btn" data-action="edit" data-id="' + escapeHtml(service.id) + '">Edit</button> ' +
          '<button type="button" class="btn" data-action="toggle" data-id="' + escapeHtml(service.id) + '">' + (enabled ? 'Disable' : 'Enable') + '</button>' +
          '</td>' +
          '</tr>'
        );
      })
      .join('');
  }

  function resetForm(form) {
    form.reset();
    document.getElementById('service-id-input').value = '';
    document.getElementById('service-form-submit').textContent = 'Add Service';
    document.getElementById('service-form-cancel').hidden = true;
    showFieldError(document.getElementById('service-name'), document.getElementById('service-name-error'), '');
    showFieldError(document.getElementById('service-duration'), document.getElementById('service-duration-error'), '');
    showFieldError(document.getElementById('service-price'), document.getElementById('service-price-error'), '');
  }

  function startEdit(id) {
    if (typeof window.SalonServiceStore === 'undefined') return;
    var service = window.SalonServiceStore.getServices().filter(function (s) { return s.id === id; })[0];
    if (!service) return;

    document.getElementById('service-id-input').value = service.id;
    document.getElementById('service-name').value = service.name;
    document.getElementById('service-description').value = service.description || '';
    document.getElementById('service-duration').value = service.duration;
    document.getElementById('service-price').value = service.price;
    document.getElementById('service-form-submit').textContent = 'Save Changes';
    document.getElementById('service-form-cancel').hidden = false;
  }

  function setupServiceForm() {
    var form = document.getElementById('service-form');
    if (!form || typeof window.SalonServiceStore === 'undefined') return;

    var cancelBtn = document.getElementById('service-form-cancel');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nameInput = document.getElementById('service-name');
      var durationInput = document.getElementById('service-duration');
      var priceInput = document.getElementById('service-price');
      var descriptionInput = document.getElementById('service-description');
      var idInput = document.getElementById('service-id-input');

      var name = nameInput.value.trim();
      var duration = Number(durationInput.value);
      var price = Number(priceInput.value);

      var hasError = false;
      if (!name) {
        showFieldError(nameInput, document.getElementById('service-name-error'), 'Please enter a service name.');
        hasError = true;
      } else {
        showFieldError(nameInput, document.getElementById('service-name-error'), '');
      }

      if (!durationInput.value || isNaN(duration) || duration <= 0) {
        showFieldError(durationInput, document.getElementById('service-duration-error'), 'Please enter a duration greater than 0.');
        hasError = true;
      } else {
        showFieldError(durationInput, document.getElementById('service-duration-error'), '');
      }

      if (!priceInput.value || isNaN(price) || price < 0) {
        showFieldError(priceInput, document.getElementById('service-price-error'), 'Please enter a valid price.');
        hasError = true;
      } else {
        showFieldError(priceInput, document.getElementById('service-price-error'), '');
      }

      if (hasError) return;

      var editingId = idInput.value;
      if (editingId) {
        window.SalonServiceStore.updateService(editingId, {
          name: name,
          description: descriptionInput.value,
          duration: duration,
          price: price
        });
      } else {
        window.SalonServiceStore.addService({
          name: name,
          description: descriptionInput.value,
          duration: duration,
          price: price
        });
      }

      resetForm(form);
      renderServicesAdmin();
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        resetForm(form);
      });
    }
  }

  function setupServiceTableActions() {
    var tableBody = document.getElementById('services-table-body');
    if (!tableBody || typeof window.SalonServiceStore === 'undefined') return;

    tableBody.addEventListener('click', function (event) {
      var button = event.target.closest ? event.target.closest('button[data-action]') : null;
      if (!button) return;

      var id = button.getAttribute('data-id');
      var action = button.getAttribute('data-action');

      if (action === 'edit') {
        startEdit(id);
      } else if (action === 'toggle') {
        var service = window.SalonServiceStore.getServices().filter(function (s) { return s.id === id; })[0];
        var currentlyEnabled = service ? service.enabled !== false : true;
        window.SalonServiceStore.setServiceEnabled(id, !currentlyEnabled);
        renderServicesAdmin();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderServicesAdmin();
    setupServiceForm();
    setupServiceTableActions();
  });
})();
