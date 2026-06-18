/**
 * ZdravýNehet – Main JavaScript
 * Premium Medical Podological Website
 * Handles: navigation, scroll effects, animations, form
 */

(function () {
  'use strict';

  /* ─── DOM references ──────────────────────────────── */
  const header      = document.getElementById('site-header');
  const navToggle   = document.getElementById('nav-toggle');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-link, .mobile-cta') : [];
  const contactForm = document.getElementById('contact-form');

  /* ─── Header scroll behaviour ─────────────────────── */
  let lastScrollY = 0;

  function onScroll() {
    const currentY = window.scrollY;

    // Add shadow on scroll
    if (currentY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ─── Mobile menu toggle ──────────────────────────── */
  function openMenu() {
    mobileMenu.hidden = false;
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    // Close when a mobile link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  /* ─── Scroll-triggered animations ────────────────── */
  function setupAnimations() {
    // Elements that fade up individually
    const animTargets = document.querySelectorAll(
      '.section-header, .service-card, .process-step, ' +
      '.comparison-card, .about-grid, .contact-grid, ' +
      '.hero-badge, .hero-heading, .hero-subheading, ' +
      '.hero-highlight, .hero-actions, .hero-stats, ' +
      '.about-certs, .about-facts, .process-cta, ' +
      '.comparison-note, .footer-grid'
    );

    // Elements with staggered children
    const staggerTargets = document.querySelectorAll(
      '.services-grid, .about-facts, .certs-list, ' +
      '.comparison-list, .process-steps, .hero-stats'
    );

    animTargets.forEach(el => el.classList.add('animate-on-scroll'));
    staggerTargets.forEach(el => el.classList.add('animate-stagger'));

    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    document.querySelectorAll('.animate-on-scroll, .animate-stagger').forEach(el => {
      observer.observe(el);
    });
  }

  // Respect prefers-reduced-motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setupAnimations();
  }

  /* ─── Smooth active nav link highlighting ─────────── */
  function setupActiveNav() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.classList.add('nav-link--active');
              } else {
                link.classList.remove('nav-link--active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach(section => navObserver.observe(section));
  }

  setupActiveNav();

  /* ─── Contact form handling ───────────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('#form-submit');
      const originalText = submitBtn.textContent;

      // Loading state
      submitBtn.textContent = 'Odesílám…';
      submitBtn.disabled = true;

      // Simulate async send (replace with real API call)
      setTimeout(() => {
        submitBtn.textContent = 'Odesláno – odpovím do 24 h';
        submitBtn.style.backgroundColor = 'var(--color-positive)';
        submitBtn.style.borderColor = 'var(--color-positive)';

        // Reset after delay
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.borderColor = '';
          contactForm.reset();
        }, 4000);
      }, 1200);
    });

    // Live validation micro-interactions
    const inputs = contactForm.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('blur', function () {
        if (this.required && !this.value.trim()) {
          this.style.borderColor = '#f87171';
        } else if (this.value.trim()) {
          this.style.borderColor = 'var(--color-positive)';
        }
      });

      input.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

  /* ─── Counter animation for stats ────────────────── */
  function animateCounter(el, target, suffix) {
    const duration = 1200;
    const start    = performance.now();
    const isText   = isNaN(parseInt(target));

    if (isText) return; // Skip non-numeric (e.g. "Mgr.")

    const targetNum = parseInt(target);

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.round(eased * targetNum);

      el.textContent = current + (suffix || '');

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // Observe stat numbers
  const statNumbers = document.querySelectorAll('.stat-number, .fact-number');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el   = entry.target;
          const text = el.textContent.trim();

          if (text.endsWith('+')) {
            const num = text.replace('+', '');
            animateCounter(el, num, '+');
          } else if (!isNaN(parseInt(text))) {
            animateCounter(el, text, '');
          }

          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    statNumbers.forEach(el => counterObserver.observe(el));
  }

  /* ─── Placeholder hover effect ────────────────────── */
  const placeholders = document.querySelectorAll('.photo-placeholder');
  placeholders.forEach(ph => {
    ph.addEventListener('mouseenter', () => {
      ph.style.borderColor = 'var(--color-slate-muted)';
    });
    ph.addEventListener('mouseleave', () => {
      ph.style.borderColor = '';
    });
  });

})();
