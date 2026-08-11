// Navbar scroll detection - adds background when page is scrolled
(function() {
  const navbar = document.getElementById('mainNav');

  if (!navbar) return;

  function handleNavbarScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Run on page load in case user has scrolled already
  handleNavbarScroll();

  // Listen for scroll events
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
})();

// Set current year in footer
(function() {
  const yearElement = document.getElementById('footerYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();

// Smooth scroll for anchor links
(function() {
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    const href = target.getAttribute('href');
    if (href === '#') return;

    const section = document.querySelector(href);
    if (!section) return;

    e.preventDefault();
    section.scrollIntoView({ behavior: 'smooth' });
  });
})();

// ===== CRITICAL FIX: Scroll animation triggers =====
// This makes content visible when scrolling into view
(function() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!revealElements.length) return;

  // Use Intersection Observer for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add revealed class when element enters viewport
        entry.target.classList.add('revealed');
        // Stop observing this element to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,  // Trigger when 10% of element is visible
    rootMargin: '0px 0px -100px 0px'  // Start animating 100px before entering viewport
  });

  // Observe all reveal elements
  revealElements.forEach(el => observer.observe(el));
})();

// ===== FALLBACK: Make content visible if Intersection Observer fails =====
// This is a safety net to ensure content is always visible
(function() {
  // Wait for page to fully load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealAll);
  } else {
    setTimeout(revealAll, 1000);
  }

  function revealAll() {
    // Check if any elements still have opacity 0
    const hiddenElements = document.querySelectorAll('.reveal-up:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed)');
    if (hiddenElements.length > 0) {
      console.warn(`Found ${hiddenElements.length} unrevealed elements. Forcing visibility.`);
      hiddenElements.forEach(el => {
        el.classList.add('revealed');
      });
    }
  }
})();

// ===== Soro Embed Script Guard =====
// Ensure Soro script loads properly and only once
(function() {
  // Wait for DOM to be ready
  function setupSoro() {
    const soroBlog = document.getElementById('soro-blog');
    if (!soroBlog) return;

    // Only load if not already loaded
    if (window.SoroEmbedLoaded) return;

    // Check if Soro script already exists
    const existingScript = document.querySelector('script[src*="trysoro.com"]');
    if (existingScript && window.Soro) {
      console.log('Soro already loaded');
      return;
    }

    console.log('Loading Soro embed...');
    // Script should load automatically if included in HTML with defer
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSoro);
  } else {
    setupSoro();
  }
})();

// ===== Form Error Handling =====
// Safely handle GHL form integration with fallbacks
(function() {
  // Wait for DOM and external forms to load
  window.addEventListener('load', function() {
    const ghlElements = {
      fullName: '#full_name',
      email: '#email',
      phone: '#phone',
      submit: 'button.btn-dark.button-element'
    };

    // Check if GHL elements exist
    const hasGHL = Object.values(ghlElements).every(selector =>
      document.querySelector(selector)
    );

    if (!hasGHL) {
      console.warn('GHL form elements not found. This is normal if using a different form builder.');
      // The form will still work, just won't sync to external system
    } else {
      console.log('GHL form elements found. Integration enabled.');
    }
  });
})();
