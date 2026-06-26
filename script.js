/**
 * AURUM RESTAURANT — script.js
 * Handles: sticky nav, parallax hero, scroll reveal,
 *          active nav links, back-to-top, form handling,
 *          footer year, carousel dot sync.
 */

'use strict';

/* ============================================================
   UTILITY: Throttle helper (limits callback frequency)
============================================================ */
function throttle(fn, wait = 16) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}


/* ============================================================
   1. FOOTER YEAR
   Auto-updates the copyright year.
============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ============================================================
   2. STICKY NAVIGATION
   Adds .nav-scrolled class after scrolling past 60px.
============================================================ */
const mainNav = document.getElementById('mainNav');

function handleNavScroll() {
  if (window.scrollY > 60) {
    mainNav.classList.add('nav-scrolled');
  } else {
    mainNav.classList.remove('nav-scrolled');
  }
}

window.addEventListener('scroll', throttle(handleNavScroll, 100), { passive: true });
handleNavScroll(); // Run once on load


/* ============================================================
   3. ACTIVE NAV LINK HIGHLIGHT
   Uses IntersectionObserver to highlight the nav link
   corresponding to the visible section.
============================================================ */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('#mainNav .nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  {
    rootMargin: '-40% 0px -55% 0px', // Trigger when section is ~middle of viewport
  }
);

sections.forEach((section) => sectionObserver.observe(section));


/* ============================================================
   4. CLOSE MOBILE NAV ON LINK CLICK
   Collapses the Bootstrap mobile nav when a link is tapped.
============================================================ */
const navCollapse = document.getElementById('navMenu');

if (navCollapse) {
  const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });

  navCollapse.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navCollapse.classList.contains('show')) {
        bsCollapse.hide();
      }
    });
  });
}


/* ============================================================
   5. HERO PARALLAX
   Subtle parallax on the hero background image.
   Disabled for reduced-motion users.
============================================================ */
const heroBg = document.querySelector('.hero-bg');

if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  function handleHeroParallax() {
    const scrollY = window.scrollY;
    // Move background slightly slower than scroll for parallax depth
    heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
  }

  window.addEventListener('scroll', throttle(handleHeroParallax, 16), { passive: true });
}


/* ============================================================
   6. SCROLL REVEAL
   Uses IntersectionObserver to trigger .in-view class on
   elements with .reveal-fade, .reveal-left, .reveal-right.
============================================================ */
const revealEls = document.querySelectorAll('.reveal-fade, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target); // Animate only once
      }
    });
  },
  {
    threshold: 0.12,      // Trigger when 12% of the element is visible
    rootMargin: '0px 0px -40px 0px',
  }
);

revealEls.forEach((el) => revealObserver.observe(el));


/* ============================================================
   7. BACK TO TOP BUTTON
   Shows/hides button based on scroll position.
============================================================ */
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  function handleBackToTop() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', throttle(handleBackToTop, 150), { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================================
   8. TESTIMONIAL CAROUSEL — Sync custom dots with Bootstrap
   Bootstrap's carousel fires slide.bs.carousel events which
   we use to keep our custom dot indicators in sync.
============================================================ */
const testimonialCarousel = document.getElementById('testimonialCarousel');
const dots = document.querySelectorAll('#testimonialCarousel .dot');

if (testimonialCarousel && dots.length) {
  testimonialCarousel.addEventListener('slide.bs.carousel', (event) => {
    dots.forEach((dot) => dot.classList.remove('active'));
    if (dots[event.to]) {
      dots[event.to].classList.add('active');
    }
  });
}


/* ============================================================
   9. CTA QUICK RESERVATION FORM
   Basic validation and submission feedback.
============================================================ */
const ctaForm = document.querySelector('.cta-form');

if (ctaForm) {
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation — check all required fields
    const inputs = ctaForm.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        valid = false;
        input.classList.add('is-invalid');
      } else {
        input.classList.remove('is-invalid');
      }
    });

    if (valid) {
      // Simulate sending — replace with real API call
      const submitBtn = ctaForm.querySelector('[type="submit"]');
      submitBtn.textContent = 'Checking…';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Request Sent';
        submitBtn.style.backgroundColor = 'var(--color-sage)';
        submitBtn.style.borderColor = 'var(--color-sage)';
      }, 1200);
    }
  });

  // Remove invalid state on input
  ctaForm.addEventListener('input', (e) => {
    if (e.target.classList.contains('is-invalid')) {
      e.target.classList.remove('is-invalid');
    }
  });
}


/* ============================================================
   10. CONTACT FORM
   Handles validation and shows a success message.
============================================================ */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = contactForm.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        valid = false;
        input.classList.add('is-invalid');
      } else {
        input.classList.remove('is-invalid');
      }
    });

    if (valid) {
      const submitBtn = contactForm.querySelector('[type="submit"]');

      // Simulate async submission
      submitBtn.innerHTML = 'Sending… <i class="bi bi-hourglass-split ms-2"></i>';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Show success message
        if (formSuccess) {
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        contactForm.reset();
        submitBtn.innerHTML = 'Send Enquiry <i class="bi bi-send ms-2"></i>';
        submitBtn.disabled = false;
      }, 1400);
    }
  });

  // Remove invalid styling on change
  contactForm.addEventListener('input', (e) => {
    if (e.target.classList.contains('is-invalid')) {
      e.target.classList.remove('is-invalid');
    }
  });
}


/* ============================================================
   11. SMOOTH SCROLL for anchor links
   Accounts for the fixed navbar height as an offset.
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = mainNav ? mainNav.offsetHeight : 72;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});
