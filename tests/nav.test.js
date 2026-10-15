import { describe, it, expect, beforeEach } from "vitest";
import { initNav } from "../src/js/nav.js";

function renderNavMarkup() {
  document.body.innerHTML = `
    <header>
      <button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav"></button>
      <nav id="primary-nav" class="nav">
        <ul class="nav__list">
          <li><a class="nav__link" href="#home">Home</a></li>
          <li><a class="nav__link" href="#features">Features</a></li>
        </ul>
      </nav>
    </header>
  `;
}

describe("initNav", () => {
  beforeEach(() => {
    renderNavMarkup();
  });

  it("opens the menu and sets aria-expanded=true on first click", () => {
    initNav(document);
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");

    toggle.click();

    expect(nav.classList.contains("is-open")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });

  it("closes the menu and resets aria-expanded on second click", () => {
    initNav(document);
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");

    toggle.click();
    toggle.click();

    expect(nav.classList.contains("is-open")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes the menu when a nav link is clicked", () => {
    initNav(document);
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");
    const link = document.querySelector(".nav__link");

    toggle.click();
    expect(nav.classList.contains("is-open")).toBe(true);

    link.click();

    expect(nav.classList.contains("is-open")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("does nothing gracefully when nav elements are missing", () => {
    document.body.innerHTML = "";
    expect(() => initNav(document)).not.toThrow();
  });
});
