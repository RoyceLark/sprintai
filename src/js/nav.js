/**
 * Wires up the mobile navigation toggle button.
 * Expects a `.nav-toggle` button and a `.nav` element in the given root
 * (defaults to `document`). Returns a teardown function.
 */
export function initNav(root = document) {
  const toggle = root.querySelector(".nav-toggle");
  const nav = root.querySelector(".nav");

  if (!toggle || !nav) {
    return () => {};
  }

  function onClick() {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  }

  function onNavLinkClick(event) {
    if (event.target.matches(".nav__link")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  toggle.addEventListener("click", onClick);
  nav.addEventListener("click", onNavLinkClick);

  return () => {
    toggle.removeEventListener("click", onClick);
    nav.removeEventListener("click", onNavLinkClick);
  };
}
