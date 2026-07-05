/* ============================================================
   DivineLands — JavaScript
   ============================================================ */

// ─── Navbar Scroll Effect ───────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ─── Hamburger Menu ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navbarEl  = document.getElementById('navbar');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    if (navbarEl) navbarEl.classList.toggle('menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      if (navbarEl) navbarEl.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
  });

  // Also close on CTA click
  const mobileCta = navLinks.querySelector('.nav-mobile-cta a');
  if (mobileCta) {
    mobileCta.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      if (navbarEl) navbarEl.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
  }
}

// ─── Scroll Reveal ──────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || '0');
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ─── Smooth Anchor Scrolling ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── Contact Form Validation ─────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  const fields = {
    fullName: { el: document.getElementById('fullName'), errEl: document.getElementById('nameError'), validate: v => v.trim().length >= 2 },
    phone:    { el: document.getElementById('phone'),    errEl: document.getElementById('phoneError'), validate: v => /^[\+]?[\d\s\-\(\)]{7,15}$/.test(v.trim()) },
    email:    { el: document.getElementById('email'),    errEl: document.getElementById('emailError'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    message:  { el: document.getElementById('message'),  errEl: document.getElementById('messageError'), validate: v => v.trim().length >= 10 },
  };

  // Real-time validation
  Object.values(fields).forEach(({ el, errEl, validate }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const valid = validate(el.value);
      el.classList.toggle('error', !valid);
      if (errEl) errEl.classList.toggle('visible', !valid);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error') && validate(el.value)) {
        el.classList.remove('error');
        if (errEl) errEl.classList.remove('visible');
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;

    Object.values(fields).forEach(({ el, errEl, validate }) => {
      if (!el) return;
      const valid = validate(el.value);
      el.classList.toggle('error', !valid);
      if (errEl) errEl.classList.toggle('visible', !valid);
      if (!valid) allValid = false;
    });

    if (allValid) {
      // Simulate form submission
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';
      }

      setTimeout(() => {
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1200);
    }
  });
}

// ─── Parallax Hero ────────────────────────────────────────────
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const max = document.querySelector('.hero')?.offsetHeight || 700;
    if (scrolled < max) {
      heroBg.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  }, { passive: true });
}

// ─── Number Counter Animation ────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const increment = target / (duration / 16);
  const isPlus = el.textContent.includes('+');

  const tick = () => {
    start = Math.min(start + increment, target);
    el.textContent = Math.floor(start) + (isPlus ? '+' : '');
    if (start < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.stat-number');
      numbers.forEach(el => {
        const raw = el.textContent.replace(/\D/g, '');
        if (raw) animateCounter(el, parseInt(raw));
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ─── Micro-interaction: benefit cards tilt ───────────────────
document.querySelectorAll('.benefit-card, .location-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -4;
    const rotY = ((x - cx) / cx) *  4;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
