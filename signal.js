(function () {
  'use strict';

  const BLUE = '#38c5e8';

  function initScrollFade() {
    const map = document.querySelector('.sg-map');
    const stage = document.querySelector('.sg-globe-stage');
    const mapUI = document.querySelector('.sg-map-ui');
    if (!map || !stage) return;

    window.addEventListener('scroll', () => {
      const rect = map.getBoundingClientRect();
      const progress = 1 - Math.max(0, Math.min(1, rect.bottom / window.innerHeight));
      stage.style.opacity = String(Math.max(0, 1 - progress * 1.4));
      if (mapUI) mapUI.style.opacity = String(Math.max(0, 1 - progress * 2));
    }, { passive: true });
  }

  function initCards() {
    const cards = document.querySelectorAll('.sg-card');
    if (!cards.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    cards.forEach(card => obs.observe(card));
  }

  function initReveal(selector, threshold) {
    document.querySelectorAll(selector).forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sg-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: threshold || 0.2 });
      obs.observe(el);
    });
  }

  function initForm() {
    const btn = document.getElementById('sg-submit-btn');
    const fb = document.getElementById('sg-feedback');
    if (!btn || !fb) return;

    btn.addEventListener('click', () => {
      const name = document.getElementById('sg-name').value.trim();
      const role = document.getElementById('sg-role').value.trim();
      const company = document.getElementById('sg-company').value.trim();
      const location = document.getElementById('sg-location').value.trim();
      const email = document.getElementById('sg-email').value.trim();
      const text = document.getElementById('sg-text').value.trim();

      if (!name || !text) {
        fb.textContent = 'Name and review are required.';
        fb.style.color = 'rgba(255,80,80,0.85)';
        fb.style.display = 'block';
        return;
      }

      const payload = {
        id: `SIG-${Date.now()}`,
        name,
        role,
        company,
        location,
        email,
        text,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        source: 'portfolio-signal-form',
      };

      console.log('[SIGNAL] Review payload:', payload);

      fb.textContent = 'Signal received. Under review before going live.';
      fb.style.color = BLUE;
      fb.style.display = 'block';
      btn.disabled = true;
      btn.textContent = 'TRANSMITTED';
    });
  }

  function animateCount(el, target) {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 24));
    const iv = setInterval(() => {
      current = Math.min(target, current + step);
      el.textContent = String(current);
      if (current >= target) clearInterval(iv);
    }, 45);
  }

  function initTicker() {
    const activeEl = document.getElementById('sg-sig-count');
    const connectionsEl = document.querySelector('[data-sg-count="connections"]');
    if (!activeEl || !connectionsEl) return;

    const target = Number(connectionsEl.textContent) || 0;
    animateCount(activeEl, target);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollFade();
    initCards();
    initReveal('.sg-section-header');
    initReveal('.sg-cta-inner', 0.25);
    initReveal('.sg-form-wrapper', 0.15);
    initForm();
    initTicker();
  });
})();