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
