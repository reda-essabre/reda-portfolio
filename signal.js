/* ============================================================
   SIGNAL.JS — Cinematic world network + scroll choreography
   Electric blue: #38c5e8 used for data-signal visual only.
   All other UI stays in site's black/white/amber palette.
   ============================================================ */
(function () {
  'use strict';

  const BLUE     = '#38c5e8';
  const BLUE_RGB = '56,197,232';

  // ============================================================
  // DATA
  // ============================================================
  const CITIES = [
    { name: 'Paris',       country: 'France',   lat:  48.85, lon:   2.35 },
    { name: 'Milan',       country: 'Italy',    lat:  45.46, lon:   9.19 },
    { name: 'Dublin',      country: 'Ireland',  lat:  53.33, lon:  -6.25 },
    { name: 'Manchester',  country: 'UK',       lat:  53.48, lon:  -2.24 },
    { name: 'London',      country: 'UK',       lat:  51.51, lon:  -0.13 },
    { name: 'Ottawa',      country: 'Canada',   lat:  45.42, lon: -75.69 },
    { name: 'Calgary',     country: 'Canada',   lat:  51.05, lon:-114.07 },
    { name: 'La Paz',      country: 'Bolivia',  lat: -16.50, lon: -68.15 },
    { name: 'Santa Cruz',  country: 'Bolivia',  lat: -17.78, lon: -63.18 },
    { name: 'Cochabamba',  country: 'Bolivia',  lat: -17.39, lon: -66.16 },
  ];

  const CONNECTIONS = [
    [4, 0], [4, 2], [4, 3], [0, 1], [2, 0],
    [4, 5], [0, 5], [5, 6], [5, 7], [6, 7],
    [7, 8], [7, 9], [8, 9],
  ];

  // Simplified continent outlines [lat, lon]
  const LAND = [
    // North America
    [[71,-141],[60,-140],[54,-130],[49,-124],[42,-124],[36,-122],[32,-117],
     [22,-110],[22,-97],[29,-94],[30,-85],[25,-80],[9,-79],[12,-72],
     [25,-77],[37,-76],[40,-74],[44,-66],[47,-53],[52,-55],[60,-64],
     [63,-92],[70,-92],[70,-130]],
    // Greenland
    [[83,-45],[76,-18],[60,-44],[65,-55],[70,-55],[76,-60]],
    // South America
    [[12,-72],[10,-62],[6,-52],[0,-50],[-10,-37],[-23,-43],[-34,-58],
     [-38,-62],[-55,-68],[-55,-66],[-50,-68],[-45,-65],[-38,-58],
     [-28,-50],[-10,-37],[6,-52]],
    // Europe
    [[71,28],[70,25],[68,20],[65,14],[63,12],[60,5],[57,8],[55,9],
     [52,4],[51,2],[43,8],[40,4],[36,5],[36,14],[37,26],[36,28],
     [40,36],[42,35],[44,40],[47,38],[52,30],[60,26],[65,25],[70,25]],
    // UK & Ireland
    [[58,-5],[55,-6],[51,-5],[51,1],[53,0],[58,0]],
    // Iberian Peninsula
    [[44,8],[43,3],[40,-1],[37,-9],[36,-9],[36,5],[44,8]],
    // Africa
    [[37,9],[22,37],[12,43],[0,42],[-10,40],[-26,32],[-34,26],
     [-34,18],[-17,12],[-1,9],[4,8],[10,14],[22,14],[30,32],[37,9]],
    // Asia (simplified)
    [[70,30],[60,60],[55,80],[60,100],[55,130],[50,140],[40,140],
     [30,120],[22,114],[10,105],[0,104],[10,100],[20,90],[8,77],
     [22,60],[30,48],[36,36],[47,38],[60,50],[65,60]],
    // Australia
    [[-15,130],[-15,136],[-20,148],[-28,154],[-38,146],[-38,140],
     [-32,126],[-22,114],[-15,122]],
  ];

  // ============================================================
  // PROJECTION + GEOMETRY
  // ============================================================
  function project(lat, lon, w, h) {
    const px = w * 0.03, py = h * 0.05;
    return {
      x: ((lon + 180) / 360) * (w - px * 2) + px,
      y: ((90 - lat) / 180) * (h - py * 2) + py,
    };
  }

  function bezierPt(p1, cp, p2, t) {
    const u = 1 - t;
    return {
      x: u * u * p1.x + 2 * u * t * cp.x + t * t * p2.x,
      y: u * u * p1.y + 2 * u * t * cp.y + t * t * p2.y,
    };
  }

  function arcCP(p1, p2) {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    return { x: mx, y: my - Math.min(dist * 0.42, 90) };
  }

  // ============================================================
  // ANIMATION STATE
  // ============================================================
  const ARC_DRAW = 1500;
  const ARC_LAG  = 480;

  let arcs = CONNECTIONS.map((conn, i) => ({
    conn,
    progress: 0,
    startDelay: i * ARC_LAG,
    particles: [
      { t: (i * 0.37) % 1, speed: 0.00048 + (i % 4) * 0.00014 },
      { t: (i * 0.71) % 1, speed: 0.00034 + (i % 3) * 0.00022 },
    ],
  }));

  let startTime     = null;
  let hoveredCity   = -1;
  let cityPositions = [];

  // ============================================================
  // DRAW
  // ============================================================
  function draw(canvas, ctx, ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const sec     = elapsed / 1000;
    const w = canvas.width, h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Ambient blue center glow
    const amb = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.55);
    amb.addColorStop(0, `rgba(${BLUE_RGB},0.05)`);
    amb.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, w, h);

    // Graticule
    ctx.strokeStyle = 'rgba(255,255,255,0.032)';
    ctx.lineWidth   = 0.5;
    for (let lat = -60; lat <= 90; lat += 30) {
      const a = project(lat, -180, w, h), b = project(lat, 180, w, h);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let lon = -180; lon <= 180; lon += 30) {
      const a = project(90, lon, w, h), b = project(-90, lon, w, h);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    // Continent fills
    LAND.forEach(shape => {
      ctx.beginPath();
      shape.forEach(([lat, lon], i) => {
        const p = project(lat, lon, w, h);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle   = 'rgba(255,255,255,0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.11)';
      ctx.lineWidth   = 0.65;
      ctx.stroke();
    });

    // Cache city positions
    cityPositions = CITIES.map(c => project(c.lat, c.lon, w, h));

    // ── Arcs ──────────────────────────────────────────────────
    arcs.forEach(arc => {
      const local = elapsed - arc.startDelay;
      if (local <= 0) return;
      arc.progress = Math.min(1, local / ARC_DRAW);

      const p1 = cityPositions[arc.conn[0]];
      const p2 = cityPositions[arc.conn[1]];
      const cp = arcCP(p1, p2);
      const STEPS = 80;
      const maxStep = Math.floor(arc.progress * STEPS);

      // Arc line
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${BLUE_RGB},0.16)`;
      ctx.lineWidth   = 0.9;
      for (let s = 0; s <= maxStep; s++) {
        const pt = bezierPt(p1, cp, p2, s / STEPS);
        s === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Leading-edge glow while drawing
      if (arc.progress < 1) {
        const fp = bezierPt(p1, cp, p2, arc.progress);
        const g  = ctx.createRadialGradient(fp.x, fp.y, 0, fp.x, fp.y, 7);
        g.addColorStop(0, `rgba(${BLUE_RGB},0.9)`);
        g.addColorStop(1, `rgba(${BLUE_RGB},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(fp.x, fp.y, 7, 0, Math.PI * 2); ctx.fill();
      }

      // Particles (only after arc fully drawn)
      if (arc.progress >= 1) {
        arc.particles.forEach(par => {
          par.t = (par.t + par.speed) % 1;
          const pt   = bezierPt(p1, cp, p2, par.t);
          const fade = par.t < 0.07 ? par.t / 0.07
                     : par.t > 0.93 ? (1 - par.t) / 0.07
                     : 1;

          // Halo glow
          const halo = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 8);
          halo.addColorStop(0, `rgba(${BLUE_RGB},${0.28 * fade})`);
          halo.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = halo;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2); ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.92 * fade})`;
          ctx.fill();
        });
      }
    });

    // ── City nodes ────────────────────────────────────────────
    cityPositions.forEach((p, i) => {
      const pulse     = Math.sin(sec * 1.5 + i * 0.95) * 0.5 + 0.5;
      const isHovered = i === hoveredCity;

      // Outer glow disk
      const r1   = 20 + pulse * 9;
      const glow = ctx.createRadialGradient(p.x, p.y, 4, p.x, p.y, r1);
      glow.addColorStop(0,   `rgba(${BLUE_RGB},0)`);
      glow.addColorStop(0.5, `rgba(${BLUE_RGB},${isHovered ? 0.14 : 0.055 * pulse})`);
      glow.addColorStop(1,   `rgba(${BLUE_RGB},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(p.x, p.y, r1, 0, Math.PI * 2); ctx.fill();

      // Blue ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6.5 + pulse * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${BLUE_RGB},${isHovered ? 0.85 : 0.28 + pulse * 0.32})`;
      ctx.lineWidth   = isHovered ? 1.4 : 0.9;
      ctx.stroke();

      // White core dot
      const core = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, isHovered ? 4 : 3);
      core.addColorStop(0,   'rgba(255,255,255,1)');
      core.addColorStop(0.7, 'rgba(255,255,255,0.85)');
      core.addColorStop(1,   'rgba(255,255,255,0.2)');
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(p.x, p.y, isHovered ? 4 : 3, 0, Math.PI * 2); ctx.fill();

      // City label
      const alwaysShow = [0, 1, 2, 4, 5, 6, 7].includes(i);
      if (isHovered || alwaysShow) {
        const side = CITIES[i].lon < -10 ? 'left' : 'right';
        ctx.font      = `${isHovered ? 700 : 500} 7.5px "Share Tech Mono", monospace`;
        ctx.fillStyle = isHovered
          ? `rgba(${BLUE_RGB},0.95)`
          : 'rgba(255,255,255,0.52)';
        ctx.textAlign = side === 'right' ? 'left' : 'right';
        ctx.fillText(
          CITIES[i].name.toUpperCase(),
          p.x + (side === 'right' ? 12 : -12),
          p.y + 3.5
        );
      }
    });

    requestAnimationFrame(ts2 => draw(canvas, ctx, ts2));
  }

  // ============================================================
  // INIT CANVAS + TOOLTIPS
  // ============================================================
  function initCanvas() {
    const canvas  = document.getElementById('sg-canvas');
    const tooltip = document.getElementById('sg-tooltip');
    if (!canvas) return;

    const section = canvas.closest('.sg-map');

    function resize() {
      canvas.width  = section.clientWidth;
      canvas.height = section.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const ctx = canvas.getContext('2d');
    requestAnimationFrame(ts => draw(canvas, ctx, ts));

    // Hover / tooltip
    canvas.addEventListener('mousemove', e => {
      const cr    = canvas.getBoundingClientRect();
      const sr    = section.getBoundingClientRect();
      const scX   = canvas.width  / cr.width;
      const scY   = canvas.height / cr.height;
      const mx    = (e.clientX - cr.left) * scX;
      const my    = (e.clientY - cr.top)  * scY;

      let found = -1;
      cityPositions.forEach((pos, i) => {
        if (Math.hypot(mx - pos.x, my - pos.y) < 20) found = i;
      });

      hoveredCity = found;

      if (found >= 0) {
        const city = CITIES[found];
        tooltip.innerHTML  = `${city.name}<span>${city.country}</span>`;
        tooltip.style.left = (e.clientX - sr.left + 14) + 'px';
        tooltip.style.top  = (e.clientY - sr.top  - 44) + 'px';
        tooltip.classList.add('visible');
        canvas.style.cursor = 'pointer';
      } else {
        tooltip.classList.remove('visible');
        canvas.style.cursor = 'crosshair';
      }
    });

    canvas.addEventListener('mouseleave', () => {
      hoveredCity = -1;
      if (tooltip) tooltip.classList.remove('visible');
    });
  }

  // ============================================================
  // MAP FADE ON SCROLL
  // ============================================================
  function initScrollFade() {
    const map    = document.querySelector('.sg-map');
    const canvas = document.getElementById('sg-canvas');
    const mapUI  = document.querySelector('.sg-map-ui');
    if (!map || !canvas) return;

    window.addEventListener('scroll', () => {
      const rect     = map.getBoundingClientRect();
      const progress = 1 - Math.max(0, Math.min(1, rect.bottom / window.innerHeight));
      canvas.style.opacity = 1 - Math.min(1, progress * 1.5);
      if (mapUI) mapUI.style.opacity = 1 - Math.min(1, progress * 2);
    }, { passive: true });
  }

  // ============================================================
  // REVIEW CARD SCROLL REVEALS (staggered)
  // ============================================================
  function initCards() {
    const cards = document.querySelectorAll('.sg-card');
    if (!cards.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    cards.forEach(c => obs.observe(c));
  }

  // ============================================================
  // CTA + SECTION REVEALS
  // ============================================================
  function initReveal(selector, threshold) {
    document.querySelectorAll(selector).forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('sg-revealed');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: threshold || 0.2 });
      obs.observe(el);
    });
  }

  // ============================================================
  // REVIEW SUBMISSION FORM
  // ============================================================
  function initForm() {
    const btn = document.getElementById('sg-submit-btn');
    const fb  = document.getElementById('sg-feedback');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const name     = document.getElementById('sg-name').value.trim();
      const role     = document.getElementById('sg-role').value.trim();
      const company  = document.getElementById('sg-company').value.trim();
      const location = document.getElementById('sg-location').value.trim();
      const email    = document.getElementById('sg-email').value.trim();
      const text     = document.getElementById('sg-text').value.trim();

      if (!name || !text) {
        fb.textContent = '▸ Name and review are required.';
        fb.style.color   = 'rgba(255,80,80,0.85)';
        fb.style.display = 'block';
        return;
      }

      // Backend-ready payload
      // → fetch('/api/reviews', { method:'POST', body: JSON.stringify(payload) })
      // → supabase.from('reviews').insert(payload)
      // → firebase.firestore().collection('reviews').add(payload)
      const payload = {
        id:          `SIG-${Date.now()}`,
        name, role, company, location,
        email,          // private — never displayed
        text,
        submittedAt: new Date().toISOString(),
        status:      'pending',   // pending | approved | rejected
        source:      'portfolio-signal-form',
      };

      console.log('[SIGNAL] Payload:', payload);

      fb.textContent   = '◆ Signal received — under review before going live.';
      fb.style.color   = BLUE;
      fb.style.display = 'block';
      btn.disabled     = true;
      btn.textContent  = '✓ TRANSMITTED';
    });
  }

  // ============================================================
  // SIGNAL COUNT TICKER
  // ============================================================
  function initTicker() {
    const el = document.getElementById('sg-sig-count');
    if (!el) return;
    let n = 0;
    const iv = setInterval(() => {
      n++;
      el.textContent = n;
      if (n >= CONNECTIONS.length) clearInterval(iv);
    }, 480);
  }

  // ============================================================
  // BOOT
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initScrollFade();
    initCards();
    initReveal('.sg-section-header');
    initReveal('.sg-cta-inner', 0.25);
    initReveal('.sg-form-wrapper', 0.15);
    initForm();
    initTicker();
  });

})();
