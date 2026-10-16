const { JSDOM } = require('jsdom');

function loadStore() {
  const dom = new JSDOM('', { url: 'http://localhost/' });
  global.window = dom.window;
  global.localStorage = dom.window.localStorage;
  jest.resetModules();
  return require('../js/enquiry-store.js');
}

describe('enquiry-store', () => {
  afterEach(() => {
    delete global.window;
    delete global.localStorage;
  });

  test('getEnquiries returns an empty array when nothing stored', () => {
    const store = loadStore();
    expect(store.getEnquiries()).toEqual([]);
  });

  test('addEnquiry persists the enquiry and returns the updated list', () => {
    const store = loadStore();
    const result = store.addEnquiry({
      name: 'Jane Doe',
      contact: 'jane@example.com',
      service: 'hair',
      date: '2030-01-01',
      message: 'See you then'
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: 'Jane Doe',
      contact: 'jane@example.com',
      service: 'hair',
      date: '2030-01-01',
      message: 'See you then'
    });
    expect(result[0].submittedAt).toBeDefined();

    expect(store.getEnquiries()).toHaveLength(1);
  });

  test('addEnquiry accumulates multiple enquiries in order', () => {
    const store = loadStore();
    store.addEnquiry({ name: 'First', contact: 'a@example.com', service: 'hair', date: '2030-01-01' });
    store.addEnquiry({ name: 'Second', contact: 'b@example.com', service: 'spa', date: '2030-02-01' });

    const enquiries = store.getEnquiries();
    expect(enquiries).toHaveLength(2);
    expect(enquiries[0].name).toBe('First');
    expect(enquiries[1].name).toBe('Second');
  });

  test('addEnquiry defaults message to an empty string when omitted', () => {
    const store = loadStore();
    const result = store.addEnquiry({ name: 'No Message', contact: 'c@example.com', service: 'nails', date: '2030-03-01' });
    expect(result[0].message).toBe('');
  });
});
