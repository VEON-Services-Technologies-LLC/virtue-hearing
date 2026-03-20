/**
 * VIRTUE HEARING AID CENTER — main.js
 * Handles: Navbar scroll, scroll animations, testimonials carousel, form validation
 */

document.addEventListener("DOMContentLoaded", () => {
  // ── Footer year ──────────────────────────────────────────────────────────
  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navbar scroll behavior ───────────────────────────────────────────────
  const navbar = document.getElementById("mainNav");

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  // Close mobile menu on nav link click
  const navLinks = navbar.querySelectorAll(".nav-link, .nav-cta");
  const navCollapse = document.getElementById("navbarMenu");
  const bsCollapse = navCollapse
    ? bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false })
    : null;

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navCollapse && navCollapse.classList.contains("show") && bsCollapse) {
        bsCollapse.hide();
      }
    });
  });

  // ── Scroll reveal (Intersection Observer) ────────────────────────────────
  const revealEls = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right",
  );

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

  revealEls.forEach((el) => revealObserver.observe(el));

  // ── Testimonials Carousel ─────────────────────────────────────────────────
  const inner = document.getElementById("testimonialsInner");
  const prevBtn = document.getElementById("tPrev");
  const nextBtn = document.getElementById("tNext");
  const dotsWrap = document.getElementById("tDots");
  const cards = inner
    ? Array.from(inner.querySelectorAll(".testimonial-card"))
    : [];

  if (inner && cards.length > 0) {
    let current = 0;
    let autoTimer = null;

    // Determine cards visible based on viewport
    function getVisible() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 992) return 2;
      return 3;
    }

    function totalSlides() {
      return Math.max(1, cards.length - getVisible() + 1);
    }

    // Build dots
    function buildDots() {
      dotsWrap.innerHTML = "";
      for (let i = 0; i < totalSlides(); i++) {
        const dot = document.createElement("button");
        dot.className = "t-dot" + (i === current ? " active" : "");
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Testimonial ${i + 1}`);
        dot.setAttribute("aria-selected", i === current ? "true" : "false");
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = dotsWrap.querySelectorAll(".t-dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
        dot.setAttribute("aria-selected", i === current ? "true" : "false");
      });
    }

    function getCardWidth() {
      if (cards.length === 0) return 0;
      const card = cards[0];
      const style = getComputedStyle(inner);
      const gap = parseFloat(style.gap) || 24;
      return card.offsetWidth + gap;
    }

    function goTo(index) {
      const max = totalSlides() - 1;
      current = Math.max(0, Math.min(index, max));
      inner.style.transform = `translateX(-${current * getCardWidth()}px)`;
      updateDots();
    }

    function next() {
      goTo(current + 1 < totalSlides() ? current + 1 : 0);
    }
    function prev() {
      goTo(current - 1 >= 0 ? current - 1 : totalSlides() - 1);
    }

    // Auto-rotate
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(next, 5000);
    }

    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    prevBtn.addEventListener("click", () => {
      prev();
      startAuto();
    });
    nextBtn.addEventListener("click", () => {
      next();
      startAuto();
    });

    // Pause on hover
    inner.addEventListener("mouseenter", stopAuto);
    inner.addEventListener("mouseleave", startAuto);
    inner.addEventListener("focusin", stopAuto);
    inner.addEventListener("focusout", startAuto);

    // Keyboard navigation
    inner.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prev();
        startAuto();
      }
      if (e.key === "ArrowRight") {
        next();
        startAuto();
      }
    });

    // Touch / swipe
    let touchStartX = 0;
    inner.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true },
    );
    inner.addEventListener("touchend", (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        startAuto();
      }
    });

    // Rebuild on resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        current = Math.min(current, totalSlides() - 1);
        buildDots();
        goTo(current);
      }, 200);
    });

    // Init
    buildDots();
    goTo(0);
    startAuto();
  }

  // ── Contact Form ──────────────────────────────────────────────────────────
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formSuccess = document.getElementById("formSuccess");

  if (form && submitBtn) {
    // Real-time validation
    const requiredInputs = form.querySelectorAll("[required]");
    requiredInputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("is-invalid")) validateField(input);
      });
    });

    function validateField(input) {
      const value = input.value.trim();
      if (input.type === "tel") {
        const phoneOk = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(
          value.replace(/\s/g, ""),
        );
        toggleValidity(input, phoneOk);
      } else {
        toggleValidity(input, value.length > 0);
      }
    }

    function toggleValidity(input, isValid) {
      input.classList.toggle("is-invalid", !isValid);
      input.classList.toggle("is-valid", isValid);
    }

    function validateAll() {
      let valid = true;
      requiredInputs.forEach((input) => {
        validateField(input);
        if (input.classList.contains("is-invalid")) valid = false;
        if (!input.value.trim()) {
          toggleValidity(input, false);
          valid = false;
        }
      });
      return valid;
    }

    submitBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      if (!validateAll()) {
        const firstError = form.querySelector(".is-invalid");
        if (firstError) firstError.focus();
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Sending…
      `;

      // Simulate form submission (replace with actual GHL endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success
      form.hidden = true;
      formSuccess.hidden = false;
      formSuccess.focus();

      // Scroll success into view
      formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // ── Smooth anchor scrolling (offset for fixed navbar) ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 16 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // ── Active nav link on scroll ─────────────────────────────────────────────
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = navbar.querySelectorAll('.nav-link[href^="#"]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");
      const link = navbar.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle("active", scrollPos >= top && scrollPos < bottom);
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
});

// ── CSS for spinner (injected) ────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  .spin-icon {
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .nav-link.active {
    color: var(--primary) !important;
    font-weight: 600 !important;
  }
`;
document.head.appendChild(style);
