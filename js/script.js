// Navigation: mobile menu toggle and active-link highlighting.
document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.getElementById('navToggle');
  var navList = document.getElementById('navList');

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      var isOpen = navList.classList.toggle('nav__list--open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navList.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('nav__list--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav__link');

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('nav__link--active', link.dataset.section === id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var ratios = {};

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          ratios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        var bestId = null;
        var bestRatio = 0;
        Object.keys(ratios).forEach(function (id) {
          if (ratios[id] > bestRatio) {
            bestRatio = ratios[id];
            bestId = id;
          }
        });

        if (bestId) {
          setActive(bestId);
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
});
