/**
 * VIRTUE HEARING AID CENTER — main.js
 * Handles: Navbar scroll, scroll animations, smooth anchors, active nav links
 */

document.addEventListener("DOMContentLoaded", () => {
  // ── Footer year ──────────────────────────────────────────
  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navbar scroll behavior ────────────────────────────────
  const navbar = document.getElementById("mainNav");
  if (!navbar) return;

  function updateNavbar() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  // ── Close mobile menu on nav link click ───────────────────
  const navCollapse = document.getElementById("navbarMenu");
  const bsCollapse = navCollapse
    ? bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false })
    : null;

  navbar.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
    link.addEventListener("click", () => {
      if (navCollapse?.classList.contains("show") && bsCollapse) {
        bsCollapse.hide();
      }
    });
  });

  // ── Scroll reveal (Intersection Observer) ─────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(".reveal-up, .reveal-left, .reveal-right")
    .forEach((el) => revealObserver.observe(el));

  // ── Smooth anchor scrolling (offset for fixed navbar) ─────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // ── Active nav link on scroll ─────────────────────────────
  const sections = document.querySelectorAll("section[id]");

  function updateActiveLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach((section) => {
      const id = section.getAttribute("id");
      const link = navbar.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        const active =
          scrollPos >= section.offsetTop &&
          scrollPos < section.offsetTop + section.offsetHeight;
        link.classList.toggle("active", active);
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
});

// ── Active nav + spinner styles (injected once) ───────────
const s = document.createElement("style");
s.textContent = `
  .nav-link.active { color: var(--primary) !important; font-weight: 600 !important; }
  .spin-icon { animation: spin 0.8s linear infinite; flex-shrink: 0; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(s);
