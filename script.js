/* ===================================================
   ALEX MORGAN — PORTFOLIO SCRIPT
   Pure Vanilla JS — No external libraries
   =================================================== */

'use strict';

/* ===================================================
   1. LOADING SCREEN
   =================================================== */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.classList.add('loading');

  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    // Staggered reveal of hero elements after loader
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 120);
    });
  }, 1900);
})();


/* ===================================================
   2. FOOTER YEAR
   =================================================== */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ===================================================
   3. CUSTOM CURSOR - MINIMAL AESTHETIC
   =================================================== */
(function initCursor() {
  const cursor = document.querySelector('.cursor-outline');
  if (!cursor) return;

  // Hide on touch devices
  if (window.matchMedia('(hover: none)').matches) {
    cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('*').forEach(el => el.style.cursor = 'auto');
    return;
  }

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  const speed = 0.2;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('active');
  });

  // Smooth follow animation
  function animate() {
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    const size = cursor.classList.contains('hover') ? 25 : 10;
    cursor.style.transform = `translate(${cursorX - size}px, ${cursorY - size}px)`;
    
    requestAnimationFrame(animate);
  }
  animate();

  // Hover state
  const hoverTargets = 'a, button, .skill-tag, .project-card, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hover');
    }
  });

  // Hide when mouse leaves window
  document.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  document.addEventListener('mouseenter', () => cursor.classList.add('active'));
})();


/* ===================================================
   4. NAVBAR — SCROLL STYLE + HAMBURGER
   =================================================== */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();


/* ===================================================
   5. TYPING ANIMATION
   =================================================== */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = ['Frontend Developer', 'UI Enthusiast', 'Creative Coder', 'React Lover'];
  let phraseIdx = 0, charIdx = 0, deleting = false, pause = false;

  function type() {
    const current = phrases[phraseIdx];

    if (pause) {
      pause = false;
      setTimeout(type, 1400);
      return;
    }

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pause = true;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    }
  }

  setTimeout(type, 2200);
})();


/* ===================================================
   6. HERO PARTICLES (Canvas)
   =================================================== */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 80, MAX_DIST = 130;
  const MOUSE = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 1.8 + 0.6;
      this.alpha = Math.random() * 0.5 + 0.25;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      const dx = this.x - MOUSE.x, dy = this.y - MOUSE.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.8;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / MAX_DIST) * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  let animId;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    animId = requestAnimationFrame(animate);
  }

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      MOUSE.x = e.clientX - rect.left;
      MOUSE.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => { MOUSE.x = -9999; MOUSE.y = -9999; });
  }

  window.addEventListener('resize', () => { resize(); init(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId); else animate();
  });

  resize();
  init();
  animate();
})();


/* ===================================================
   7. SCROLL REVEAL (IntersectionObserver)
   =================================================== */
(function initScrollReveal() {
  const els = document.querySelectorAll(
    '.about .reveal-up, .about .reveal-left, .about .reveal-right,' +
    '.skills .reveal-up, .projects .reveal-up,' +
    '.contact .reveal-left, .contact .reveal-right'
  );
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();


/* ===================================================
   8. SKILL TAGS — STAGGERED ENTRANCE
   =================================================== */
(function initSkillTags() {
  const categories = document.querySelectorAll('.skill-category');
  if (!categories.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-tag').forEach((tag, i) => {
          const delay = parseInt(tag.dataset.delay || 0, 10);
          setTimeout(() => tag.classList.add('tag-visible'), delay + i * 60);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  categories.forEach(cat => observer.observe(cat));
})();


/* ===================================================
   9. 3D TILT EFFECT ON PROJECT CARDS
   =================================================== */
(function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;
  const MAX_TILT = 12;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -MAX_TILT;
      const rotY = ((x - rect.width  / 2) / (rect.width  / 2)) *  MAX_TILT;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
      card.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.07) 0%, transparent 65%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      card.style.backgroundImage = '';
    });
  });
})();


/* ===================================================
   10. MAGNETIC BUTTON EFFECT
   =================================================== */
(function initMagneticButtons() {
  const btns = document.querySelectorAll('.magnetic');
  if (!btns.length) return;
  const STRENGTH = 0.35;

  btns.forEach(btn => {
    btn.addEventListener('mouseenter', () => { btn.style.transition = 'transform 0.1s ease'; });
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * STRENGTH;
      const dy = (e.clientY - rect.top  - rect.height / 2) * STRENGTH;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      btn.style.transform = 'translate(0, 0)';
    });
  });
})();


/* ===================================================
   11. CONTACT FORM — VALIDATION + SUBMISSION
   =================================================== */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn  = document.getElementById('submit-btn');
  if (!form) return;

  const validators = {
    name:    v => v.length >= 2  ? { ok: true } : { ok: false, msg: 'Please enter your name (min 2 characters).' },
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? { ok: true } : { ok: false, msg: 'Please enter a valid email address.' },
    subject: v => v.length >= 3  ? { ok: true } : { ok: false, msg: 'Subject must be at least 3 characters.' },
    message: v => v.length >= 10 ? { ok: true } : { ok: false, msg: 'Message must be at least 10 characters.' },
  };

  function validateField(id) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (!input || !error) return true;
    const result = validators[id](input.value.trim());
    input.classList.toggle('error', !result.ok);
    error.textContent = result.ok ? '' : result.msg;
    return result.ok;
  }

  Object.keys(validators).forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('blur', () => validateField(id));
      input.addEventListener('input', () => { if (input.classList.contains('error')) validateField(id); });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid = Object.keys(validators).reduce((acc, id) => validateField(id) && acc, true);
    if (!allValid) return;

    const submitText = submitBtn.querySelector('.submit-text');
    submitBtn.disabled = true;
    submitText.textContent = 'Sending…';

    // Get form action URL
    const formAction = form.getAttribute('action');
    
    // If Formspree is configured, submit for real
    if (formAction && formAction.includes('formspree.io')) {
      fetch(formAction, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          form.reset();
          submitBtn.disabled = false;
          submitText.textContent = 'Send Message';
          successMsg.classList.add('show');
          setTimeout(() => successMsg.classList.remove('show'), 5000);
        } else {
          throw new Error('Form submission failed');
        }
      }).catch(error => {
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        alert('Failed to send message. Please try again or email me directly at sharmapaayush@gmail.com');
      });
    } else {
      // Fallback simulation if Formspree not configured
      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }, 1200);
    }
  });
})();


/* ===================================================
   12. ACTIVE NAV LINK ON SCROLL
   =================================================== */
(function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive ? 'var(--text)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ===================================================
   13. STAT COUNTER ANIMATION
   =================================================== */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  function animateCounter(el, target, suffix, duration = 1600) {
    const start = performance.now();
    (function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = target * ease;
      el.textContent = (val >= 100 ? Math.round(val) : parseFloat(val.toFixed(1))) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const match = el.textContent.trim().match(/^([\d.]+)(\S*)$/);
        if (match) animateCounter(el, parseFloat(match[1]), match[2]);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  stats.forEach(s => observer.observe(s));
})();


/* ===================================================
   14. HERO ORB PARALLAX ON MOUSEMOVE
   =================================================== */
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  const hero = document.getElementById('hero');
  if (!orbs.length || !hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width  - 0.5;
    const my = (e.clientY - rect.top)  / rect.height - 0.5;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 18;
      orb.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
      orb.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    orbs.forEach(orb => {
      orb.style.transition = 'transform 1s cubic-bezier(0.23,1,0.32,1)';
      orb.style.transform = '';
    });
  });
})();
