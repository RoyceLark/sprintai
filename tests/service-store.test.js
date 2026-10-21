const { JSDOM } = require('jsdom');

function loadStore() {
  const dom = new JSDOM('', { url: 'http://localhost/' });
  global.window = dom.window;
  global.localStorage = dom.window.localStorage;
  jest.resetModules();
  return require('../js/service-store.js');
}

describe('service-store', () => {
  afterEach(() => {
    delete global.window;
    delete global.localStorage;
  });

  test('getServices seeds and returns the 4 default services when nothing stored', () => {
    const store = loadStore();
    const services = store.getServices();
    expect(services).toHaveLength(4);
    expect(services.map((s) => s.id)).toEqual(['hair', 'facial', 'spa', 'nails']);
    services.forEach((service) => {
      expect(service.enabled).toBe(true);
      expect(typeof service.duration).toBe('number');
      expect(typeof service.price).toBe('number');
    });
  });

  test('getEnabledServices returns only enabled services', () => {
    const store = loadStore();
    store.setServiceEnabled('spa', false);

    const enabled = store.getEnabledServices();
    expect(enabled.map((s) => s.id)).not.toContain('spa');
    expect(enabled).toHaveLength(3);

    const all = store.getServices();
    expect(all).toHaveLength(4);
    const spa = all.filter((s) => s.id === 'spa')[0];
    expect(spa.enabled).toBe(false);
  });

  test('setServiceEnabled can re-enable a disabled service', () => {
    const store = loadStore();
    store.setServiceEnabled('nails', false);
    store.setServiceEnabled('nails', true);

    const enabled = store.getEnabledServices();
    expect(enabled.map((s) => s.id)).toContain('nails');
  });

  test('addService adds a new enabled service with a generated id and returns the updated list', () => {
    const store = loadStore();
    const result = store.addService({
      name: 'Eyebrow Threading',
      description: 'Precise eyebrow shaping.',
      duration: 20,
      price: 15
    });

    expect(result).toHaveLength(5);
    const added = result[result.length - 1];
    expect(added.id).toBe('eyebrow-threading');
    expect(added.name).toBe('Eyebrow Threading');
    expect(added.duration).toBe(20);
    expect(added.price).toBe(15);
    expect(added.enabled).toBe(true);

    expect(store.getServices()).toHaveLength(5);
  });

  test('addService generates a unique id when the name collides with an existing service', () => {
    const store = loadStore();
    const result = store.addService({ name: 'Hair Styling', duration: 30, price: 20 });
    const added = result[result.length - 1];
    expect(added.id).toBe('hair-styling');
    expect(added.id).not.toBe('hair');
  });

  test('updateService updates name, duration and price of an existing service', () => {
    const store = loadStore();
    const result = store.updateService('facial', { name: 'Facial Deluxe', duration: 50, price: 45 });

    const updated = result.filter((s) => s.id === 'facial')[0];
    expect(updated.name).toBe('Facial Deluxe');
    expect(updated.duration).toBe(50);
    expect(updated.price).toBe(45);

    expect(store.getServices().filter((s) => s.id === 'facial')[0].name).toBe('Facial Deluxe');
  });

  test('updateService leaves the list unchanged when the id does not exist', () => {
    const store = loadStore();
    const before = store.getServices();
    const after = store.updateService('does-not-exist', { name: 'X' });
    expect(after).toEqual(before);
  });
});
