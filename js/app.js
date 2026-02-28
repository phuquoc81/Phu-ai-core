/* ============================================================
   Phu AI Core — Main JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   HAMBURGER NAV
   ============================================================ */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
})();

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
(function () {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   STICKY NAV SHADOW
   ============================================================ */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(0,0,0,0.4)'
      : 'none';
  }, { passive: true });
})();

/* ============================================================
   PRICING TOGGLE  (monthly ↔ yearly)
   ============================================================ */
(function () {
  const toggleBtn = document.getElementById('billingToggle');
  if (!toggleBtn) return;

  let isYearly = false;

  const monthlyPrices = {
    starter:   '$11.99',
    basic:     '$19.99',
    standard:  '$28.99',
    plus:      '$36.99',
    phuai:     '$49.99',
    phuaipro:  '$59.99',
    phuairev:  '$69.99',
  };

  const yearlyPrices = {
    starter:  '$102.99',
    basic:    '$102.99',
    standard: '$102.99',
    plus:     '$102.99',
    phuai:    '$102.99',
    phuaipro: '$102.99',
    phuairev: '$102.99',
  };

  const monthlyLabel = document.getElementById('monthlyLabel');
  const yearlyLabel  = document.getElementById('yearlyLabel');

  toggleBtn.addEventListener('click', () => {
    isYearly = !isYearly;
    toggleBtn.classList.toggle('on', isYearly);

    if (monthlyLabel) monthlyLabel.classList.toggle('active', !isYearly);
    if (yearlyLabel)  yearlyLabel.classList.toggle('active', isYearly);

    Object.keys(monthlyPrices).forEach(key => {
      const el = document.getElementById('price-' + key);
      const noteEl = document.getElementById('note-' + key);
      if (!el) return;

      if (isYearly) {
        el.textContent = yearlyPrices[key];
        if (noteEl) noteEl.textContent = '/year — save up to 56%';
      } else {
        el.textContent = monthlyPrices[key];
        if (noteEl) noteEl.textContent = '/month';
      }
    });
  });
})();

/* ============================================================
   MODAL SYSTEM
   ============================================================ */
const Modal = (function () {
  function open(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.modal')?.setAttribute('role', 'dialog');
  }

  function close(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function closeAll() {
    document.querySelectorAll('.modal-overlay.open').forEach(o => {
      o.classList.remove('open');
    });
    document.body.style.overflow = '';
  }

  // Wire close buttons
  document.querySelectorAll('.modal-close, [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => closeAll());
  });

  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeAll();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAll();
  });

  // Wire open triggers
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => open(btn.dataset.modal));
  });

  return { open, close, closeAll };
})();

/* ============================================================
   TOAST SYSTEM
   ============================================================ */
const Toast = (function () {
  function show(message, type = 'info', duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
  }

  return { show };
})();

/* ============================================================
   SIGN-UP FORM
   ============================================================ */
(function () {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.pricing-btn-primary, .btn-primary');

    const name    = form.querySelector('#signupName')?.value.trim();
    const email   = form.querySelector('#signupEmail')?.value.trim();
    const plan    = form.querySelector('#signupPlan')?.value;

    if (!name || !email || !plan) {
      Toast.show('Please fill in all required fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Toast.show('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate processing
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Processing…';
    }

    await new Promise(r => setTimeout(r, 1500));

    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Get Started';
    }

    Modal.closeAll();
    Toast.show(`Welcome, ${name}! Your ${plan} subscription has been activated. Check your email for details.`, 'success', 6000);
    form.reset();
  });
})();

/* ============================================================
   ANIMATED COUNTER
   ============================================================ */
(function () {
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = parseInt(el.dataset.decimals, 10) || 0;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
})();

/* ============================================================
   LIVE SECURITY FEED  (simulated)
   ============================================================ */
(function () {
  const feed = document.getElementById('securityFeed');
  if (!feed) return;

  const events = [
    'Malware signature detected & neutralized',
    'Phishing URL blocked',
    'Unauthorized access attempt rejected',
    'Spyware process terminated',
    'Firewall rule updated automatically',
    'Virus definition database refreshed',
    'Suspicious network traffic blocked',
    'Zero-day exploit attempt prevented',
    'Ransomware payload quarantined',
    'Worm propagation stopped',
  ];

  let idx = 0;

  function addEvent() {
    const item = document.createElement('li');
    item.style.cssText = 'padding:0.5rem 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.82rem; color:#8888aa; display:flex; justify-content:space-between; gap:1rem;';
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    item.innerHTML = `<span style="color:#00e5a0">✓</span><span style="flex:1">${events[idx % events.length]}</span><span>${time}</span>`;
    feed.insertBefore(item, feed.firstChild);
    if (feed.children.length > 6) feed.removeChild(feed.lastChild);
    idx++;
  }

  addEvent();
  setInterval(addEvent, 3500);
})();

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   BACK TO TOP
   ============================================================ */
(function () {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  btn.style.cssText = `
    position:fixed; bottom:1.5rem; left:1.5rem; z-index:999;
    width:40px; height:40px; border-radius:50%;
    background:rgba(108,99,255,0.8); border:none; color:#fff;
    font-size:1.1rem; cursor:pointer;
    opacity:0; pointer-events:none;
    transition:opacity 0.3s ease;
    display:flex; align-items:center; justify-content:center;
  `;

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const visible = window.scrollY > 400;
    btn.style.opacity = visible ? '1' : '0';
    btn.style.pointerEvents = visible ? 'all' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
