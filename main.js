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

document.addEventListener('DOMContentLoaded', () => {
  initTerminal();
});
