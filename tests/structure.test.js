import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";

let html;

beforeAll(() => {
  html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
  document.documentElement.innerHTML = html;
});

describe("page structure", () => {
  it("has a header with navigation", () => {
    expect(document.querySelector("header.site-header")).not.toBeNull();
    expect(document.querySelector("nav.nav")).not.toBeNull();
  });

  it("has a hero section with a call-to-action link", () => {
    const hero = document.querySelector("section.hero");
    expect(hero).not.toBeNull();
    expect(hero.querySelector("h1")).not.toBeNull();
    expect(hero.querySelector(".btn")).not.toBeNull();
  });

  it("has at least one content section", () => {
    expect(document.querySelector("#features")).not.toBeNull();
    expect(document.querySelector("#about")).not.toBeNull();
  });

  it("has a dedicated call-to-action section", () => {
    expect(document.querySelector("section.cta")).not.toBeNull();
    expect(document.querySelector("section.cta .btn")).not.toBeNull();
  });

  it("has a footer with links", () => {
    const footer = document.querySelector("footer.site-footer");
    expect(footer).not.toBeNull();
    expect(footer.querySelectorAll("a").length).toBeGreaterThan(0);
  });

  it("all nav links have non-empty href attributes", () => {
    const links = document.querySelectorAll(".nav__link");
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link.getAttribute("href")).toMatch(/^#\S+/);
    });
  });

  it("logo link points to an in-page section, not a bare '#'", () => {
    const logo = document.querySelector(".logo");
    expect(logo).not.toBeNull();
    expect(logo.getAttribute("href")).toMatch(/^#\S+/);
  });

  it("images have descriptive alt text", () => {
    const images = document.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
    images.forEach((img) => {
      expect(img.getAttribute("alt")).toBeTruthy();
    });
  });

  it("has a skip link for keyboard accessibility", () => {
    const skip = document.querySelector(".skip-link");
    expect(skip).not.toBeNull();
    expect(skip.getAttribute("href")).toBe("#main-content");
  });

  it("has a mobile nav toggle button with correct ARIA attributes", () => {
    const toggle = document.querySelector(".nav-toggle");
    expect(toggle).not.toBeNull();
    expect(toggle.getAttribute("aria-controls")).toBe("primary-nav");
    expect(toggle.hasAttribute("aria-expanded")).toBe(true);
  });
});
