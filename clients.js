/* ============================================================
   CLIENTS.JS — Client Signals: World animation + Reviews + Form
   ============================================================ */
(function () {
  'use strict';

  // ============================================================
  // WORLD DATA
  // ============================================================

  const CITIES = [
    { name: 'Paris',       lat:  48.85, lon:   2.35, side: 'right' },
    { name: 'Milan',       lat:  45.46, lon:   9.19, side: 'right' },
    { name: 'Dublin',      lat:  53.33, lon:  -6.25, side: 'left'  },
    { name: 'Manchester',  lat:  53.48, lon:  -2.24, side: 'left'  },
    { name: 'London',      lat:  51.51, lon:  -0.13, side: 'right' },
    { name: 'Ottawa',      lat:  45.42, lon: -75.69, side: 'right' },
    { name: 'Calgary',     lat:  51.05, lon:-114.07, side: 'left'  },
    { name: 'La Paz',      lat: -16.50, lon: -68.15, side: 'left'  },
    { name: 'Santa Cruz',  lat: -17.78, lon: -63.18, side: 'right' },
    { name: 'Cochabamba',  lat: -17.39, lon: -66.16, side: 'left'  },
  ];

  // Pairs of city indices
  const CONNECTIONS = [
    [4, 0],  // London–Paris
    [4, 2],  // London–Dublin
    [4, 3],  // London–Manchester
    [0, 1],  // Paris–Milan
    [2, 0],  // Dublin–Paris
    [4, 5],  // London–Ottawa
    [0, 5],  // Paris–Ottawa
    [5, 6],  // Ottawa–Calgary
    [5, 7],  // Ottawa–La Paz
    [6, 7],  // Calgary–La Paz
    [7, 8],  // La Paz–Santa Cruz
    [7, 9],  // La Paz–Cochabamba
    [8, 9],  // Santa Cruz–Cochabamba
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
  // PROJECTION + GEOMETRY UTILS
  // ============================================================

  function project(lat, lon, w, h) {
    const padX = w * 0.03;
    const padY = h * 0.05;
    return {
      x: ((lon + 180) / 360) * (w - padX * 2) + padX,
      y: ((90 - lat) / 180) * (h - padY * 2) + padY,
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
    return { x: mx, y: my - Math.min(dist * 0.45, 90) };
  }

  // ============================================================
  // ANIMATION STATE
  // ============================================================

  const ARC_DRAW_DURATION = 1400; // ms per arc
  const ARC_STAGGER = 550;        // ms between arc starts

  let arcs = CONNECTIONS.map((conn, i) => ({
    conn,
    progress: 0,
    startDelay: i * ARC_STAGGER,
    particles: [
      { t: (i * 0.31) % 1, speed: 0.00055 + (i % 4) * 0.0002 },
      { t: (i * 0.67) % 1, speed: 0.00040 + (i % 3) * 0.0003 },
    ],
  }));

  let startTime = null;

  // ============================================================
  // DRAW
  // ============================================================

  function draw(canvas, ctx, ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime; // ms
    const sec = elapsed / 1000;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // --- Graticule ---
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let lat = -60; lat <= 90; lat += 30) {
      const a = project(lat, -180, w, h);
      const b = project(lat,  180, w, h);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let lon = -180; lon <= 180; lon += 30) {
      const a = project( 90, lon, w, h);
      const b = project(-90, lon, w, h);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    // --- Continent fills ---
    LAND.forEach(shape => {
      ctx.beginPath();
      shape.forEach(([lat, lon], i) => {
        const p = project(lat, lon, w, h);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.055)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 0.7;
      ctx.stroke();
    });

    // --- Update arcs + draw ---
    const cityPos = CITIES.map(c => project(c.lat, c.lon, w, h));

    arcs.forEach(arc => {
      const localElapsed = elapsed - arc.startDelay;
      if (localElapsed <= 0) return;

      arc.progress = Math.min(1, localElapsed / ARC_DRAW_DURATION);

      const p1 = cityPos[arc.conn[0]];
      const p2 = cityPos[arc.conn[1]];
      const cp = arcCP(p1, p2);
      const STEPS = 80;
      const maxStep = Math.floor(arc.progress * STEPS);

      // Arc line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 0.9;
      for (let s = 0; s <= maxStep; s++) {
        const pt = bezierPt(p1, cp, p2, s / STEPS);
        s === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Leading-edge glow during draw
      if (arc.progress < 1) {
        const fp = bezierPt(p1, cp, p2, arc.progress);
        const g = ctx.createRadialGradient(fp.x, fp.y, 0, fp.x, fp.y, 5);
        g.addColorStop(0, 'rgba(255,255,255,0.95)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(fp.x, fp.y, 5, 0, Math.PI * 2); ctx.fill();
      }

      // Particles (only once arc is fully drawn)
      if (arc.progress >= 1) {
        arc.particles.forEach((par, pi) => {
          par.t = (par.t + par.speed) % 1;
          const pt = bezierPt(p1, cp, p2, par.t);
          const fade = par.t < 0.08 ? par.t / 0.08
                     : par.t > 0.92 ? (1 - par.t) / 0.08
                     : 1;
          const isAmber = pi === 0;
          const col = isAmber
            ? `rgba(212,168,67,${0.85 * fade})`
            : `rgba(255,255,255,${0.75 * fade})`;

          // Core dot
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();

          // Glow halo
          const halo = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 6);
          halo.addColorStop(0, isAmber
            ? `rgba(212,168,67,${0.25 * fade})`
            : `rgba(255,255,255,${0.18 * fade})`);
          halo.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = halo;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2); ctx.fill();
        });
      }
    });

    // --- City nodes ---
    CITIES.forEach((city, i) => {
      const p = cityPos[i];
      const pulse = Math.sin(sec * 1.6 + i * 0.85) * 0.5 + 0.5;

      // Outer amber glow
      const ring = 14 + pulse * 7;
      const g1 = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, ring);
      g1.addColorStop(0, 'rgba(212,168,67,0)');
      g1.addColorStop(0.6, `rgba(212,168,67,${0.07 * pulse})`);
      g1.addColorStop(1, 'rgba(212,168,67,0)');
      ctx.fillStyle = g1;
      ctx.beginPath(); ctx.arc(p.x, p.y, ring, 0, Math.PI * 2); ctx.fill();

      // Amber ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7 + pulse * 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(212,168,67,${0.35 + pulse * 0.4})`;
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // White core
      const g2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 3.5);
      g2.addColorStop(0, 'rgba(255,255,255,1)');
      g2.addColorStop(0.6, 'rgba(255,255,255,0.9)');
      g2.addColorStop(1, 'rgba(255,255,255,0.3)');
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill();

      // Label
      const lx = city.side === 'right' ? p.x + 11 : p.x - 11;
      ctx.font = '700 8px "Share Tech Mono", monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.textAlign = city.side === 'right' ? 'left' : 'right';
      ctx.fillText(city.name.toUpperCase(), lx, p.y + 3);
    });

    requestAnimationFrame(ts2 => draw(canvas, ctx, ts2));
  }

  // ============================================================
  // INIT WORLD CANVAS
  // ============================================================

  function initWorld() {
    const canvas = document.getElementById('world-canvas');
    if (!canvas) return;

    const section = canvas.closest('.world-section');

    function resize() {
      canvas.width  = section.clientWidth;
      canvas.height = section.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');
    requestAnimationFrame(ts => draw(canvas, ctx, ts));

    // Animate signal count ticker
    const el = document.getElementById('signal-count');
    if (el) {
      let n = 0;
      const iv = setInterval(() => {
        n++;
        el.textContent = n;
        if (n >= CONNECTIONS.length) clearInterval(iv);
      }, ARC_STAGGER);
    }
  }

  // ============================================================
  // REVIEW ROW SCROLL REVEALS
  // ============================================================

  function initReviews() {
    const rows = document.querySelectorAll('.signal-row');
    if (!rows.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    rows.forEach(r => obs.observe(r));
  }

  // ============================================================
  // REVIEW FORM
  // ============================================================

  function initForm() {
    const btn = document.getElementById('review-submit-btn');
    const fb  = document.getElementById('review-feedback');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const name     = document.getElementById('rv-name').value.trim();
      const role     = document.getElementById('rv-role').value.trim();
      const company  = document.getElementById('rv-company').value.trim();
      const location = document.getElementById('rv-location').value.trim();
      const email    = document.getElementById('rv-email').value.trim();
      const rating   = document.querySelector('input[name="rv-rating"]:checked')?.value || '5';
      const text     = document.getElementById('rv-text').value.trim();

      if (!name || !text) {
        fb.textContent = '▸ ERROR: Name and review text are required.';
        fb.style.color = 'rgba(255,80,80,0.8)';
        fb.style.display = 'block';
        return;
      }

      // Backend-ready payload
      // Replace the console.log below with your backend call:
      //   fetch('/api/reviews', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      //   supabase.from('reviews').insert(payload)
      //   firebase.firestore().collection('reviews').add(payload)
      const payload = {
        id:          `SIG-${Date.now()}`,
        name,
        role,
        company,
        location,
        email,          // stored privately, never displayed
        rating:      parseInt(rating, 10),
        text,
        submittedAt: new Date().toISOString(),
        status:      'pending', // pending | approved | rejected
        source:      'portfolio-clients-form',
      };

      console.log('[CLIENT SIGNALS] Review payload:', payload);

      fb.textContent = '◆ Signal received — review submitted for moderation.';
      fb.style.color = 'var(--amber)';
      fb.style.display = 'block';
      btn.disabled = true;
      btn.textContent = '✓ SIGNAL TRANSMITTED';
    });
  }

  // ============================================================
  // BOOT
  // ============================================================

  document.addEventListener('DOMContentLoaded', () => {
    initWorld();
    initReviews();
    initForm();
  });

})();
