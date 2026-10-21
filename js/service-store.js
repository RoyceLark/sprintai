/**
 * Client-side persistence for the salon's service catalog.
 * Stores services in localStorage so the public site (index.html) and
 * the admin dashboard (admin.html) can list, add, edit and enable or
 * disable services without deleting their data.
 * Exposed on `window.SalonServiceStore` for the browser and exported
 * via `module.exports` for unit tests (Node/CommonJS).
 */
(function (root) {
  'use strict';

  var STORAGE_KEY = 'salonServices';

  var DEFAULT_SERVICES = [
    {
      id: 'hair',
      name: 'Hair Styling',
      description: 'Cuts, coloring and styling tailored to your look.',
      icon: 'images/service-hair.svg',
      duration: 60,
      price: 25,
      enabled: true
    },
    {
      id: 'facial',
      name: 'Facial & Skin Care',
      description: 'Deep cleansing, rejuvenating facials for glowing skin.',
      icon: 'images/service-facial.svg',
      duration: 45,
      price: 40,
      enabled: true
    },
    {
      id: 'spa',
      name: 'Spa & Massage',
      description: 'Relaxing massages and spa therapies to unwind.',
      icon: 'images/service-spa.svg',
      duration: 60,
      price: 55,
      enabled: true
    },
    {
      id: 'nails',
      name: 'Nail Care',
      description: 'Manicure, pedicure and nail art by skilled technicians.',
      icon: 'images/service-nails.svg',
      duration: 45,
      price: 30,
      enabled: true
    }
  ];

  function getStorage() {
    try {
      return root && root.localStorage ? root.localStorage : null;
    } catch (e) {
      return null;
    }
  }

  function cloneDefaults() {
    return DEFAULT_SERVICES.map(function (service) {
      return Object.assign({}, service);
    });
  }

  function persist(services) {
    var storage = getStorage();
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(services));
    } catch (e) {
      /* ignore storage write failures (e.g. quota, disabled storage) */
    }
  }

  /**
   * @returns {Array<Object>} all services (enabled and disabled). Seeds
   * the store with the default catalog the first time it is read.
   */
  function getServices() {
    var storage = getStorage();
    if (!storage) return cloneDefaults();
    try {
      var raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        var seeded = cloneDefaults();
        persist(seeded);
        return seeded;
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : cloneDefaults();
    } catch (e) {
      return cloneDefaults();
    }
  }

  /**
   * @returns {Array<Object>} only the services that are enabled, in the
   * order they are stored. Used by the public site.
   */
  function getEnabledServices() {
    return getServices().filter(function (service) {
      return service.enabled !== false;
    });
  }

  function slugify(name) {
    var base = String(name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-+|-+$)/g, '');
    return base || 'service';
  }

  function generateId(name, services) {
    var base = slugify(name);
    var id = base;
    var suffix = 1;
    while (services.some(function (service) { return service.id === id; })) {
      suffix += 1;
      id = base + '-' + suffix;
    }
    return id;
  }

  /**
   * Add a new service to the catalog. It is enabled by default.
   * @param {{name:string, description?:string, icon?:string, duration:number, price:number}} service
   * @returns {Array<Object>} the updated list of services.
   */
  function addService(service) {
    var services = getServices();
    var newService = {
      id: generateId(service && service.name, services),
      name: (service && service.name) || '',
      description: (service && service.description) || '',
      icon: (service && service.icon) || 'images/service-hair.svg',
      duration: Number(service && service.duration) || 0,
      price: Number(service && service.price) || 0,
      enabled: true
    };
    services.push(newService);
    persist(services);
    return services;
  }

  /**
   * Update an existing service's editable fields (name, description,
   * duration, price). Does not change id or enabled state.
   * @param {string} id
   * @param {{name?:string, description?:string, duration?:number, price?:number}} updates
   * @returns {Array<Object>} the updated list of services.
   */
  function updateService(id, updates) {
    var services = getServices();
    var service = services.filter(function (s) { return s.id === id; })[0];
    if (!service) return services;

    updates = updates || {};
    if (updates.name !== undefined) service.name = updates.name;
    if (updates.description !== undefined) service.description = updates.description;
    if (updates.icon !== undefined) service.icon = updates.icon;
    if (updates.duration !== undefined) service.duration = Number(updates.duration) || 0;
    if (updates.price !== undefined) service.price = Number(updates.price) || 0;

    persist(services);
    return services;
  }

  /**
   * Enable or disable a service without deleting it.
   * @param {string} id
   * @param {boolean} enabled
   * @returns {Array<Object>} the updated list of services.
   */
  function setServiceEnabled(id, enabled) {
    var services = getServices();
    var service = services.filter(function (s) { return s.id === id; })[0];
    if (service) service.enabled = Boolean(enabled);
    persist(services);
    return services;
  }

  var api = {
    getServices: getServices,
    getEnabledServices: getEnabledServices,
    addService: addService,
    updateService: updateService,
    setServiceEnabled: setServiceEnabled
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SalonServiceStore = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
