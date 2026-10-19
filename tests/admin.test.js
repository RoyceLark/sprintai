const { JSDOM } = require('jsdom');

function setupDom(html) {
  const dom = new JSDOM(html || '', { url: 'http://localhost/' });
  global.window = dom.window;
  global.document = dom.window.document;
  return dom;
}

const BASE_HTML = `
  <p id="no-enquiries" hidden>No enquiries have been submitted yet.</p>
  <table id="enquiries-table">
    <tbody id="enquiries-table-body"></tbody>
  </table>
`;

function loadAdmin() {
  jest.resetModules();
  require('../js/admin.js');
}

function fireDomReady(dom) {
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
}

describe('admin.js renderEnquiries', () => {
  afterEach(() => {
    delete global.window;
    delete global.document;
  });

  test('shows the empty-state message and hides the table when there are no enquiries', () => {
    const dom = setupDom(BASE_HTML);
    global.window.SalonEnquiryStore = { getEnquiries: () => [] };

    loadAdmin();
    fireDomReady(dom);

    expect(document.getElementById('no-enquiries').hidden).toBe(false);
    expect(document.getElementById('enquiries-table').hidden).toBe(true);
    expect(document.getElementById('enquiries-table-body').innerHTML).toBe('');
  });

  test('renders one row per enquiry and shows the table when enquiries exist', () => {
    const dom = setupDom(BASE_HTML);
    global.window.SalonEnquiryStore = {
      getEnquiries: () => [
        { name: 'Jane Doe', contact: 'jane@example.com', service: 'hair', date: '2030-01-01', message: 'See you then' },
        { name: 'John Roe', contact: 'john@example.com', service: 'spa', date: '2030-02-01', message: 'Looking forward' }
      ]
    };

    loadAdmin();
    fireDomReady(dom);

    const rows = document.querySelectorAll('#enquiries-table-body tr');
    expect(rows).toHaveLength(2);

    const firstCells = rows[0].querySelectorAll('td');
    expect(firstCells[0].textContent).toBe('Jane Doe');
    expect(firstCells[1].textContent).toBe('jane@example.com');
    expect(firstCells[2].textContent).toBe('hair');
    expect(firstCells[3].textContent).toBe('2030-01-01');
    expect(firstCells[4].textContent).toBe('See you then');

    expect(document.getElementById('no-enquiries').hidden).toBe(true);
    expect(document.getElementById('enquiries-table').hidden).toBe(false);
  });

  test('escapes HTML in enquiry fields instead of injecting markup', () => {
    const dom = setupDom(BASE_HTML);
    global.window.SalonEnquiryStore = {
      getEnquiries: () => [
        { name: '<img src=x onerror=alert(1)>', contact: 'a@example.com', service: 'nails', date: '2030-03-01', message: '<script>evil()</script>' }
      ]
    };

    loadAdmin();
    fireDomReady(dom);

    const body = document.getElementById('enquiries-table-body');
    expect(body.querySelector('img')).toBeNull();
    expect(body.querySelector('script')).toBeNull();
    expect(body.innerHTML).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(body.textContent).toContain('<script>evil()</script>');
  });

  test('treats null/undefined enquiry field values as empty strings', () => {
    const dom = setupDom(BASE_HTML);
    global.window.SalonEnquiryStore = {
      getEnquiries: () => [
        { name: 'No Message', contact: 'c@example.com', service: 'nails', date: '2030-03-01', message: undefined }
      ]
    };

    loadAdmin();
    fireDomReady(dom);

    const cells = document.querySelectorAll('#enquiries-table-body tr td');
    expect(cells[4].textContent).toBe('');
  });

  test('does nothing and does not throw when SalonEnquiryStore is unavailable', () => {
    const dom = setupDom(BASE_HTML);
    delete global.window.SalonEnquiryStore;

    expect(() => {
      loadAdmin();
      fireDomReady(dom);
    }).not.toThrow();

    expect(document.getElementById('enquiries-table-body').innerHTML).toBe('');
  });

  test('does nothing and does not throw when the table body element is missing', () => {
    const dom = setupDom('<p id="no-enquiries" hidden></p>');
    global.window.SalonEnquiryStore = { getEnquiries: () => [] };

    expect(() => {
      loadAdmin();
      fireDomReady(dom);
    }).not.toThrow();
  });
});
