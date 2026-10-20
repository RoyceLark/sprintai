const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'admin.html'), 'utf8');

function loadAdmin({ store, removeTableBody } = {}) {
  const dom = new JSDOM(html, { url: 'http://localhost/' });
  global.window = dom.window;
  global.document = dom.window.document;

  if (removeTableBody) {
    const tableBody = document.getElementById('enquiries-table-body');
    tableBody.parentNode.removeChild(tableBody);
  }

  if (store === undefined) {
    delete window.SalonEnquiryStore;
  } else {
    window.SalonEnquiryStore = store;
  }

  jest.resetModules();
  require('../js/admin.js');
  document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true, cancelable: true }));

  return dom;
}

describe('admin.js renderEnquiries', () => {
  afterEach(() => {
    delete global.window;
    delete global.document;
  });

  test('shows empty-state and hides table when there are no enquiries', () => {
    loadAdmin({ store: { getEnquiries: () => [] } });

    const table = document.getElementById('enquiries-table');
    const emptyEl = document.getElementById('no-enquiries');

    expect(table.hidden).toBe(true);
    expect(emptyEl.hidden).toBe(false);
    expect(document.getElementById('enquiries-table-body').innerHTML).toBe('');
  });

  test('shows table and hides empty-state, rendering a row per enquiry', () => {
    const enquiries = [
      { name: 'Jane Doe', contact: 'jane@example.com', service: 'hair', date: '2030-01-01', message: 'See you then' }
    ];
    loadAdmin({ store: { getEnquiries: () => enquiries } });

    const table = document.getElementById('enquiries-table');
    const emptyEl = document.getElementById('no-enquiries');
    const rows = document.querySelectorAll('#enquiries-table-body tr');

    expect(table.hidden).toBe(false);
    expect(emptyEl.hidden).toBe(true);
    expect(rows).toHaveLength(1);

    const cells = rows[0].querySelectorAll('td');
    expect(cells[0].textContent).toBe('Jane Doe');
    expect(cells[1].textContent).toBe('jane@example.com');
    expect(cells[2].textContent).toBe('hair');
    expect(cells[3].textContent).toBe('2030-01-01');
    expect(cells[4].textContent).toBe('See you then');
  });

  test('escapes HTML special characters in enquiry fields instead of injecting markup', () => {
    const enquiries = [
      {
        name: '<script>alert(1)</script>',
        contact: 'a@example.com',
        service: 'hair',
        date: '2030-01-01',
        message: '<img src=x onerror=alert(1)>'
      }
    ];
    loadAdmin({ store: { getEnquiries: () => enquiries } });

    const tableBody = document.getElementById('enquiries-table-body');

    expect(tableBody.querySelector('script')).toBeNull();
    expect(tableBody.querySelector('img')).toBeNull();

    const rows = tableBody.querySelectorAll('tr');
    const cells = rows[0].querySelectorAll('td');
    expect(cells[0].textContent).toBe('<script>alert(1)</script>');
    expect(cells[4].textContent).toBe('<img src=x onerror=alert(1)>');
  });

  test('does not throw when the table body element is missing', () => {
    expect(() => {
      loadAdmin({ store: { getEnquiries: () => [] }, removeTableBody: true });
    }).not.toThrow();
  });

  test('does not throw when window.SalonEnquiryStore is missing', () => {
    expect(() => {
      loadAdmin({ store: undefined });
    }).not.toThrow();
  });
});
