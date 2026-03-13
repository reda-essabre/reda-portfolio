/* ============================================================
   MAIN.JS v2 — SIGNALIS aesthetic portfolio
   ============================================================ */

// ---- TERMINAL TYPEWRITER ----
function initTerminal() {
  const out = document.getElementById('terminal-output');
  if (!out) return;

  const lines = [
    'SYSTEM: data engineering layer online.',
    'STACK: sql · ssrs · apis · rule-engines · fastapi · n8n.',
    'STATUS: open for consulting engagements [paris / remote].',
    'DIRECTIVE: if a human repeats a task > 2x — automate it.',
    'RECOGNITION: q2-2023 leadership unsung hero — europe.',
    'CONTACT: open channel at /contact',
  ];

  let li = 0, ci = 0, el = null;

  function tick() {
    if (li >= lines.length) {
      const c = document.createElement('span');
      c.className = 'cursor';
      out.appendChild(c);
      return;
    }
    if (ci === 0) {
      el = document.createElement('span');
      el.className = 'terminal-line visible';
      out.appendChild(el);
    }
    const line = lines[li];
    if (ci < line.length) {
      el.textContent = line.slice(0, ci + 1);
      ci++;
      setTimeout(tick, 22 + Math.random() * 18);
    } else {
      el.innerHTML = el.textContent + '<br>';
      li++; ci = 0;
      setTimeout(tick, 300 + Math.random() * 200);
    }
  }
  setTimeout(tick, 800);
}

// ---- EASTER EGG: type SUN ----
(function () {
  let buf = '';
  document.addEventListener('keydown', e => {
    buf += e.key.toUpperCase();
    if (buf.length > 3) buf = buf.slice(-3);
    if (buf === 'SUN') openModal();
  });

  window.openModal = function () {
    document.getElementById('sun-modal')?.classList.add('open');
  };
  window.closeModal = function () {
    document.getElementById('sun-modal')?.classList.remove('open');
  };

  document.addEventListener('click', e => {
    const m = document.getElementById('sun-modal');
    if (m && e.target === m) m.classList.remove('open');
  });
})();

// ---- ACTIVE NAV ----
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();

// ---- SUBTLE RANDOM PIXEL FLICKER on dither blocks ----
(function () {
  // Very occasional single pixel flicker for atmosphere
  function addAtmosphere() {
    const els = document.querySelectorAll('.stat-block, .skill-tile');
    els.forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.outline = '2px solid rgba(255,255,255,0.4)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.outline = '';
      });
    });
  }
  document.addEventListener('DOMContentLoaded', addAtmosphere);
})();

function initMotionSystem() {
  document.body.classList.add('is-ready');

  const revealTargets = document.querySelectorAll(
    '.motion-section, .stat-block, .skill-tile, .case-card, .award-block, .impact-metric, .terminal, .philosophy-text, .philosophy-sub, .footer-brand, .footer-nav, .footer-mid'
  );

  revealTargets.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px'
  });

  revealTargets.forEach((el) => revealObserver.observe(el));
}

function initSpotlights() {
  const spotlightTargets = document.querySelectorAll('.stat-block, .skill-tile, .case-card, .award-block, .impact-metric, .terminal');

  spotlightTargets.forEach((el) => {
    el.classList.add('has-spotlight');

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--spot-x', `${x}%`);
      el.style.setProperty('--spot-y', `${y}%`);
    });

    el.addEventListener('pointerleave', () => {
      el.style.removeProperty('--spot-x');
      el.style.removeProperty('--spot-y');
    });
  });
}

function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.btn, nav a').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

  let rafId = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  function render() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    hero.style.setProperty('--hero-tilt-x', `${currentX}px`);
    hero.style.setProperty('--hero-tilt-y', `${currentY}px`);

    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = 0;
    }
  }

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    targetX = px * 18;
    targetY = py * 14;

    if (!rafId) rafId = requestAnimationFrame(render);
  });

  hero.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    if (!rafId) rafId = requestAnimationFrame(render);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTerminal();
  initMotionSystem();
  initSpotlights();
  initMagneticButtons();
  initHeroParallax();
});
