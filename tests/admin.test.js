const { JSDOM } = require('jsdom');

function loadAdmin(storeOverride) {
  const dom = new JSDOM(
    '<p id="no-enquiries" hidden>No enquiries have been submitted yet.</p>' +
      '<table id="enquiries-table">' +
      '<tbody id="enquiries-table-body"></tbody>' +
      '</table>',
    { url: 'http://localhost/' }
  );
  global.window = dom.window;
  global.document = dom.window.document;

  if (storeOverride !== undefined) {
    global.window.SalonEnquiryStore = storeOverride;
  } else {
    delete global.window.SalonEnquiryStore;
  }

  jest.resetModules();
  require('../js/admin.js');

  // admin.js only renders on DOMContentLoaded
  document.dispatchEvent(new window.Event('DOMContentLoaded'));

  return dom.window.document;
}

describe('admin.js renderEnquiries', () => {
  afterEach(() => {
    delete global.window;
    delete global.document;
  });

  test('shows the empty-state message and hides the table when there are no enquiries', () => {
    const document = loadAdmin({ getEnquiries: () => [] });

    expect(document.getElementById('enquiries-table').hidden).toBe(true);
    expect(document.getElementById('no-enquiries').hidden).toBe(false);
    expect(document.getElementById('enquiries-table-body').innerHTML).toBe('');
  });

  test('shows the table and hides the empty-state message when enquiries exist', () => {
    const document = loadAdmin({
      getEnquiries: () => [
        { name: 'Jane Doe', contact: 'jane@example.com', service: 'hair', date: '2030-01-01', message: 'See you then' }
      ]
    });

    expect(document.getElementById('enquiries-table').hidden).toBe(false);
    expect(document.getElementById('no-enquiries').hidden).toBe(true);

    const rows = document.querySelectorAll('#enquiries-table-body tr');
    expect(rows).toHaveLength(1);

    const cells = rows[0].querySelectorAll('td');
    expect(cells[0].textContent).toBe('Jane Doe');
    expect(cells[1].textContent).toBe('jane@example.com');
    expect(cells[2].textContent).toBe('hair');
    expect(cells[3].textContent).toBe('2030-01-01');
    expect(cells[4].textContent).toBe('See you then');
  });

  test('renders one row per enquiry, in order', () => {
    const document = loadAdmin({
      getEnquiries: () => [
        { name: 'First', contact: 'a@example.com', service: 'hair', date: '2030-01-01', message: '' },
        { name: 'Second', contact: 'b@example.com', service: 'spa', date: '2030-02-01', message: '' }
      ]
    });

    const rows = document.querySelectorAll('#enquiries-table-body tr');
    expect(rows).toHaveLength(2);
    expect(rows[0].querySelector('td').textContent).toBe('First');
    expect(rows[1].querySelector('td').textContent).toBe('Second');
  });

  test('escapes HTML special characters in enquiry fields so no markup is injected', () => {
    const document = loadAdmin({
      getEnquiries: () => [
        {
          name: '<script>alert(1)</script>',
          contact: 'a@example.com',
          service: 'hair',
          date: '2030-01-01',
          message: '<img src=x onerror=alert(1)>'
        }
      ]
    });

    const tableBody = document.getElementById('enquiries-table-body');
    expect(tableBody.querySelector('script')).toBeNull();
    expect(tableBody.querySelector('img')).toBeNull();

    const cells = tableBody.querySelectorAll('td');
    expect(cells[0].textContent).toBe('<script>alert(1)</script>');
    expect(cells[4].textContent).toBe('<img src=x onerror=alert(1)>');
  });

  test('treats a missing message as an empty cell without throwing', () => {
    const document = loadAdmin({
      getEnquiries: () => [{ name: 'No Message', contact: 'c@example.com', service: 'nails', date: '2030-03-01' }]
    });

    const cells = document.querySelectorAll('#enquiries-table-body tr td');
    expect(cells[4].textContent).toBe('');
  });

  test('does nothing and does not throw when window.SalonEnquiryStore is undefined', () => {
    expect(() => loadAdmin(undefined)).not.toThrow();
  });
});
