/**
 * VIRTUE HEARING AID CENTER — main.js
 * Handles: footer year, navbar scroll state, scroll reveal, smooth anchors,
 * active nav link tracking, mobile menu auto-close.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setFooterYear();
    setupNavbar();
    setupScrollReveal();
    setupSmoothAnchors();
  }

  function setFooterYear() {
    const yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function setupNavbar() {
    const navbar = document.getElementById("mainNav");
    if (!navbar) return;

    const navCollapse = document.getElementById("navbarMenu");
    const bsCollapse =
      navCollapse && window.bootstrap
        ? window.bootstrap.Collapse.getOrCreateInstance(navCollapse, {
            toggle: false,
          })
        : null;

    // Close mobile menu on any nav link click
    navbar.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
      link.addEventListener("click", () => {
        if (navCollapse?.classList.contains("show") && bsCollapse) {
          bsCollapse.hide();
        }
      });
    });

    // Single scroll handler with rAF batching
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    setupActiveLinkObserver(navbar);
  }

  // Use IntersectionObserver instead of reading offsetTop on every scroll.
  function setupActiveLinkObserver(navbar) {
    const sections = document.querySelectorAll("section[id]");
    if (!sections.length) return;

    const links = new Map();
    sections.forEach((section) => {
      const id = section.getAttribute("id");
      const link = navbar.querySelector(`.nav-link[href="#${id}"]`);
      if (link) links.set(id, link);
    });
    if (!links.size) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = links.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
  }

  function setupScrollReveal() {
    const items = document.querySelectorAll(
      ".reveal-up, .reveal-left, .reveal-right",
    );
    if (!items.length) return;

    // Skip reveal animation when user prefers reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    items.forEach((el) => observer.observe(el));
  }

  function setupSmoothAnchors() {
    const navbar = document.getElementById("mainNav");
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#" || href === "#!") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = (navbar?.offsetHeight || 0) + 16;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }
})();
