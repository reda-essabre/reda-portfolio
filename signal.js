/* ============================================================
   SIGNAL.JS v3 — Orthographic 3D Globe
   Pure canvas. No libraries. Slow rotation. Great-circle arcs.
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

  // Improved continent outlines — more coastline detail for Europe
  const LAND = [
    // North America
    [[71,-141],[68,-136],[60,-140],[58,-136],[56,-130],[52,-128],[50,-124],
     [48,-124],[45,-124],[42,-124],[38,-122],[36,-122],[34,-120],[32,-117],
     [28,-110],[24,-110],[22,-105],[22,-97],[25,-97],[28,-97],[30,-94],
     [29,-90],[30,-88],[28,-87],[26,-82],[25,-80],[25,-77],[27,-80],
     [30,-81],[33,-79],[36,-76],[38,-75],[40,-74],[41,-72],[42,-70],
     [44,-66],[47,-53],[52,-55],[58,-62],[60,-64],[63,-78],[68,-82],
     [70,-86],[70,-92],[70,-100],[70,-120],[70,-130],[71,-141]],
    // Greenland
    [[83,-42],[80,-25],[77,-18],[72,-24],[60,-44],[62,-50],[65,-54],
     [68,-54],[70,-54],[74,-58],[78,-62],[83,-42]],
    // South America
    [[12,-71],[11,-63],[10,-62],[8,-60],[6,-52],[4,-52],[2,-50],
     [0,-50],[-2,-48],[-5,-35],[-10,-37],[-15,-39],[-20,-40],
     [-23,-43],[-26,-48],[-30,-50],[-34,-53],[-38,-58],[-40,-62],
     [-42,-64],[-50,-69],[-54,-68],[-55,-66],[-54,-64],[-50,-68],
     [-48,-66],[-45,-65],[-40,-62],[-36,-58],[-30,-50],[-22,-43],
     [-10,-37],[-3,-40],[2,-50],[8,-60],[10,-62]],
    // Europe — improved with Iberia, Scandinavia, Mediterranean detail
    [[71,28],[70,24],[68,18],[67,14],[65,14],[64,12],[62,6],[60,5],
     [59,10],[58,6],[57,8],[56,10],[55,9],[54,8],[53,8],[52,4],
     [51,2],[51,1],[50,2],[48,2],[46,2],[44,2],[43,3],[43,5],
     [42,3],[41,2],[40,0],[38,-1],[37,-4],[36,-6],[36,-9],[37,-9],
     [38,-9],[39,-9],[40,-9],[41,-9],[42,-9],[43,-9],[43,-7],[44,-8],
     [44,0],[46,2],[46,6],[44,8],[44,12],[42,14],[40,14],[38,14],
     [38,16],[38,20],[36,22],[36,28],[38,28],[40,26],[41,28],[42,28],
     [43,28],[44,28],[46,30],[47,32],[47,38],[48,36],[50,30],[54,26],
     [56,20],[58,22],[60,26],[62,28],[65,25],[68,20],[70,24],[71,28]],
    // UK & Ireland (separate for clarity)
    [[58,-5],[57,-6],[56,-6],[55,-6],[54,-5],[53,-5],[52,-5],[51,-5],
     [51,-3],[51,0],[51,1],[52,2],[53,0],[53,0],[54,0],[56,0],[58,-2],[58,-5]],
    // Ireland
    [[55,-6],[54,-8],[52,-10],[52,-8],[53,-6],[55,-6]],
    // Africa
    [[37,10],[36,10],[33,12],[30,32],[28,34],[22,37],[18,40],[12,43],
     [10,42],[8,44],[11,44],[12,44],[8,44],[4,42],[0,42],[-4,40],
     [-10,40],[-18,36],[-26,33],[-30,30],[-34,26],[-34,22],[- 32,18],
     [-28,17],[-22,14],[-17,12],[-10,14],[-4,10],[-1,9],[4,8],[8,12],
     [10,14],[14,14],[16,14],[22,14],[26,14],[30,32],[37,10]],
    // Asia — extended for better realism
    [[70,30],[68,40],[65,60],[62,75],[60,90],[58,100],[56,120],[55,130],
     [52,140],[50,140],[48,136],[44,132],[40,140],[38,142],[36,138],
     [32,130],[28,122],[24,120],[22,114],[18,110],[14,108],[10,105],
     [6,104],[2,104],[0,104],[0,108],[4,108],[6,116],[-4,116],[-8,115],
     [-8,118],[0,110],[6,100],[10,100],[14,98],[16,94],[18,92],[20,90],
     [22,88],[22,80],[20,74],[18,74],[14,74],[10,76],[8,77],[10,78],
     [14,78],[18,74],[22,74],[22,68],[24,62],[26,56],[28,50],[30,48],
     [32,44],[34,40],[36,36],[38,36],[40,40],[42,36],[44,38],[46,34],
     [46,30],[48,34],[50,36],[52,42],[54,38],[56,36],[58,36],[60,44],
     [62,50],[65,60],[68,40],[70,30]],
    // Australia
    [[-14,128],[-12,130],[-12,136],[-14,136],[-16,136],[-16,138],
     [-18,140],[-20,148],[-24,152],[-28,154],[-32,152],[-36,150],
     [-38,148],[-38,146],[-36,140],[-36,136],[-38,140],[-36,136],
     [-34,136],[-32,134],[-30,130],[-28,126],[-24,114],[-22,114],
     [-18,122],[-14,128]],
    // Japan
    [[40,142],[38,141],[36,136],[34,134],[34,130],[36,130],[38,136],
     [40,142]],
    // New Zealand
    [[-36,174],[-40,176],[-44,172],[-46,168],[-44,170],[-42,172],
     [-38,178],[-36,174]],
    // Iceland
    [[64,-14],[64,-22],[66,-24],[66,-22],[64,-14]],
  ];

  // ============================================================
  // GLOBE STATE
  // ============================================================
  let rotLon  = -28;   // start: Atlantic-centered view
  let rotLat  = 18;    // fixed tilt (latitude center of view)
  const ROT_SPEED = 0.022; // degrees per frame — ~3 min full rotation at 60fps

  let globeR  = 0;
  let globeCX = 0;
  let globeCY = 0;

  // Arc animation state
  const ARC_DRAW = 1600;
  const ARC_LAG  = 500;

  let arcs = CONNECTIONS.map((conn, i) => ({
    conn,
    progress:   0,
    startDelay: i * ARC_LAG,
    particles: [
      { t: (i * 0.37) % 1, speed: 0.00052 + (i % 4) * 0.00015 },
      { t: (i * 0.71) % 1, speed: 0.00038 + (i % 3) * 0.00022 },
    ],
  }));

  let startTime       = null;
  let hoveredCity     = -1;
  let projectedCities = [];   // updated each frame, used for hover detection

  // ============================================================
  // ORTHOGRAPHIC PROJECTION
  // ============================================================
  function ortho(lat, lon) {
    const φ  = lat * Math.PI / 180;
    const λ  = (lon - rotLon) * Math.PI / 180;
    const φ0 = rotLat * Math.PI / 180;

    // cos of central angle (positive = facing viewer)
    const cosC = Math.sin(φ0) * Math.sin(φ)
               + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ);

    if (cosC < 0) return null; // behind the globe

    return {
      x:     globeCX + globeR * Math.cos(φ) * Math.sin(λ),
      y:     globeCY - globeR * (Math.cos(φ0) * Math.sin(φ)
             - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ)),
      depth: cosC,
    };
  }

  // ============================================================
  // GREAT-CIRCLE INTERPOLATION (spherical slerp)
  // ============================================================
  function greatCircle(lat1, lon1, lat2, lon2, steps) {
    const toRad = x => x * Math.PI / 180;
    const φ1 = toRad(lat1), λ1 = toRad(lon1);
    const φ2 = toRad(lat2), λ2 = toRad(lon2);

    // Convert to unit Cartesian vectors
    const v1 = [Math.cos(φ1)*Math.cos(λ1), Math.cos(φ1)*Math.sin(λ1), Math.sin(φ1)];
    const v2 = [Math.cos(φ2)*Math.cos(λ2), Math.cos(φ2)*Math.sin(λ2), Math.sin(φ2)];

    const dot   = Math.max(-1, Math.min(1, v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2]));
    const angle = Math.acos(dot);
    if (angle < 0.0001) return [[lat1, lon1]];

    const sinA = Math.sin(angle);
    const pts  = [];

    for (let i = 0; i <= steps; i++) {
      const t  = i / steps;
      const wa = Math.sin((1 - t) * angle) / sinA;
      const wb = Math.sin(t * angle) / sinA;

      const x = wa * v1[0] + wb * v2[0];
      const y = wa * v1[1] + wb * v2[1];
      const z = wa * v1[2] + wb * v2[2];

      pts.push([
        Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI,
        Math.atan2(y, x) * 180 / Math.PI,
      ]);
    }
    return pts;
  }

  // ============================================================
  // MAIN DRAW LOOP
  // ============================================================
  function draw(canvas, ctx, ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const sec     = elapsed / 1000;
    const w = canvas.width, h = canvas.height;

    // Update globe geometry each frame (handles resize cleanly)
    globeR  = Math.min(w * 0.4, h * 0.44);
    globeCX = w * 0.5;
    globeCY = h * 0.5;

    // Slowly rotate east → west
    rotLon += ROT_SPEED;

    ctx.clearRect(0, 0, w, h);

    // ── Space background ─────────────────────────────────────
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // ── Outer atmosphere ring ────────────────────────────────
    const atm = ctx.createRadialGradient(
      globeCX, globeCY, globeR * 0.9,
      globeCX, globeCY, globeR * 1.18
    );
    atm.addColorStop(0,   `rgba(${BLUE_RGB},0.12)`);
    atm.addColorStop(0.5, `rgba(${BLUE_RGB},0.04)`);
    atm.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = atm;
    ctx.beginPath();
    ctx.arc(globeCX, globeCY, globeR * 1.18, 0, Math.PI * 2);
    ctx.fill();

    // ── Everything inside the globe silhouette ───────────────
    ctx.save();
    ctx.beginPath();
    ctx.arc(globeCX, globeCY, globeR, 0, Math.PI * 2);
    ctx.clip();

    // Sphere gradient — dark navy, lighter on upper-left (simulates light source)
    const sph = ctx.createRadialGradient(
      globeCX - globeR * 0.2, globeCY - globeR * 0.25, globeR * 0.02,
      globeCX, globeCY, globeR
    );
    sph.addColorStop(0,   'rgba(24,36,56,1)');
    sph.addColorStop(0.5, 'rgba(10,16,26,1)');
    sph.addColorStop(1,   'rgba(2,4,10,1)');
    ctx.fillStyle = sph;
    ctx.fillRect(globeCX - globeR, globeCY - globeR, globeR * 2, globeR * 2);

    // ── Graticule ────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth   = 0.5;

    // Latitude bands every 30°
    for (let lat = -60; lat <= 90; lat += 30) {
      ctx.beginPath();
      let first = true;
      for (let lon = -180; lon <= 180; lon += 3) {
        const p = ortho(lat, lon);
        if (!p) { first = true; continue; }
        first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        first = false;
      }
      ctx.stroke();
    }

    // Longitude meridians every 30°
    for (let lon = -180; lon < 180; lon += 30) {
      ctx.beginPath();
      let first = true;
      for (let lat = -90; lat <= 90; lat += 3) {
        const p = ortho(lat, lon);
        if (!p) { first = true; continue; }
        first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        first = false;
      }
      ctx.stroke();
    }

    // ── Continent fills ──────────────────────────────────────
    LAND.forEach(shape => {
      ctx.beginPath();
      let pathStarted = false;

      for (let i = 0; i < shape.length; i++) {
        const [lat, lon] = shape[i];
        const p = ortho(lat, lon);

        if (!p) {
          // Crossed the horizon — start a new sub-path next time
          pathStarted = false;
          continue;
        }

        if (!pathStarted) {
          ctx.moveTo(p.x, p.y);
          pathStarted = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }

      ctx.closePath();
      ctx.fillStyle   = 'rgba(255,255,255,0.055)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth   = 0.7;
      ctx.stroke();
    });

    // ── Great-circle arc connections ─────────────────────────
    arcs.forEach(arc => {
      const local = elapsed - arc.startDelay;
      if (local <= 0) return;
      arc.progress = Math.min(1, local / ARC_DRAW);

      const c1  = CITIES[arc.conn[0]];
      const c2  = CITIES[arc.conn[1]];
      const pts = greatCircle(c1.lat, c1.lon, c2.lat, c2.lon, 100);
      const max = Math.floor(arc.progress * pts.length);

      // Arc line — skip across horizon gaps
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${BLUE_RGB},0.22)`;
      ctx.lineWidth   = 1;
      let first = true;

      for (let i = 0; i < max; i++) {
        const p = ortho(pts[i][0], pts[i][1]);
        if (!p) { first = true; continue; }
        first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        first = false;
      }
      ctx.stroke();

      // Leading-edge glow (while arc is drawing in)
      if (arc.progress < 1 && max > 0) {
        const tip = pts[Math.min(max, pts.length - 1)];
        const fp  = ortho(tip[0], tip[1]);
        if (fp) {
          const g = ctx.createRadialGradient(fp.x, fp.y, 0, fp.x, fp.y, 8);
          g.addColorStop(0, `rgba(${BLUE_RGB},1)`);
          g.addColorStop(1, `rgba(${BLUE_RGB},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(fp.x, fp.y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Particles (only after arc fully drawn)
      if (arc.progress >= 1) {
        arc.particles.forEach(par => {
          par.t       = (par.t + par.speed) % 1;
          const idx   = Math.floor(par.t * (pts.length - 1));
          const pt    = ortho(pts[idx][0], pts[idx][1]);
          if (!pt) return;

          const fade = par.t < 0.07 ? par.t / 0.07
                     : par.t > 0.93 ? (1 - par.t) / 0.07
                     : 1;

          // Glow halo
          const halo = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 8);
          halo.addColorStop(0, `rgba(${BLUE_RGB},${0.3 * fade})`);
          halo.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.92 * fade})`;
          ctx.fill();
        });
      }
    });

    // ── City nodes (inside globe clip) ───────────────────────
    projectedCities = CITIES.map(c => {
      const p = ortho(c.lat, c.lon);
      return p ? { ...p, city: c } : null;
    });

    projectedCities.forEach((p, i) => {
      if (!p) return;

      const pulse     = Math.sin(sec * 1.5 + i * 0.9) * 0.5 + 0.5;
      const isHovered = i === hoveredCity;

      // Outer blue glow
      const r1   = 18 + pulse * 8;
      const glow = ctx.createRadialGradient(p.x, p.y, 4, p.x, p.y, r1);
      glow.addColorStop(0,   `rgba(${BLUE_RGB},0)`);
      glow.addColorStop(0.5, `rgba(${BLUE_RGB},${isHovered ? 0.18 : 0.07 * pulse})`);
      glow.addColorStop(1,   `rgba(${BLUE_RGB},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r1, 0, Math.PI * 2);
      ctx.fill();

      // Blue pulsing ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6.5 + pulse * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${BLUE_RGB},${isHovered ? 0.9 : 0.3 + pulse * 0.35})`;
      ctx.lineWidth   = isHovered ? 1.5 : 0.9;
      ctx.stroke();

      // White solid core
      ctx.beginPath();
      ctx.arc(p.x, p.y, isHovered ? 4 : 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.98)';
      ctx.fill();

      // Labels — inside clip, only for primary cities or hovered
      const primary = [0, 2, 4, 5, 6, 7].includes(i); // Paris, Dublin, London, Ottawa, Calgary, La Paz
      if (isHovered || primary) {
        const city = CITIES[i];
        // Label goes left or right depending on globe position
        const toRight = p.x <= globeCX;
        const lx      = p.x + (toRight ? 13 : -13);

        ctx.font      = `${isHovered ? 700 : 400} 8px "Share Tech Mono", monospace`;
        ctx.textAlign = toRight ? 'left' : 'right';
        ctx.fillStyle = isHovered
          ? `rgba(${BLUE_RGB},1)`
          : `rgba(255,255,255,${0.4 + p.depth * 0.35})`; // depth-based opacity
        ctx.fillText(city.name.toUpperCase(), lx, p.y + 3);
      }
    });

    ctx.restore(); // ── end globe clip ───────────────────────

    // ── Globe edge glow (rendered outside clip) ──────────────
    ctx.strokeStyle = `rgba(${BLUE_RGB},0.14)`;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(globeCX, globeCY, globeR, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle limb darkening ring (outer edge darker)
    const limb = ctx.createRadialGradient(
      globeCX, globeCY, globeR * 0.82,
      globeCX, globeCY, globeR
    );
    limb.addColorStop(0, 'rgba(0,0,0,0)');
    limb.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.save();
    ctx.beginPath();
    ctx.arc(globeCX, globeCY, globeR, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = limb;
    ctx.fillRect(globeCX - globeR, globeCY - globeR, globeR * 2, globeR * 2);
    ctx.restore();

    requestAnimationFrame(ts2 => draw(canvas, ctx, ts2));
  }

  // ============================================================
  // CANVAS INIT + RESIZE
  // ============================================================
  function initCanvas() {
    const canvas  = document.getElementById('sg-canvas'); // legacy canvas — no-op if absent
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

    // ── Hover + tooltip ──────────────────────────────────────
    canvas.addEventListener('mousemove', e => {
      const cr  = canvas.getBoundingClientRect();
      const sr  = section.getBoundingClientRect();
      const scX = canvas.width  / cr.width;
      const scY = canvas.height / cr.height;
      const mx  = (e.clientX - cr.left) * scX;
      const my  = (e.clientY - cr.top)  * scY;

      // Only detect inside the globe circle
      const dx = mx - globeCX, dy = my - globeCY;
      if (dx * dx + dy * dy > globeR * globeR * 1.05) {
        hoveredCity = -1;
        if (tooltip) tooltip.classList.remove('visible');
        canvas.style.cursor = 'crosshair';
        return;
      }

      let found = -1;
      projectedCities.forEach((p, i) => {
        if (!p) return;
        if (Math.hypot(mx - p.x, my - p.y) < 22) found = i;
      });

      hoveredCity = found;

      if (found >= 0 && tooltip) {
        const city = CITIES[found];
        tooltip.innerHTML  = `${city.name}<span>${city.country}</span>`;
        tooltip.style.left = (e.clientX - sr.left + 16) + 'px';
        tooltip.style.top  = (e.clientY - sr.top  - 46) + 'px';
        tooltip.classList.add('visible');
        canvas.style.cursor = 'pointer';
      } else {
        if (tooltip) tooltip.classList.remove('visible');
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
    const canvas = document.getElementById('sg-globe-canvas');
    const globeUI = document.getElementById('sg-globe-ui');
    if (!map || !canvas) return;

    window.addEventListener('scroll', () => {
      const rect     = map.getBoundingClientRect();
      const progress = 1 - Math.max(0, Math.min(1, rect.bottom / window.innerHeight));
      const opacity  = Math.max(0, 1 - progress * 1.6);
      canvas.style.opacity   = opacity;
      if (globeUI) globeUI.style.opacity = Math.max(0, 1 - progress * 2.2);
    }, { passive: true });
  }

  // ============================================================
  // REVIEW CARD SCROLL REVEALS
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
  // GENERIC SECTION REVEAL
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
        fb.textContent   = '▸ Name and review are required.';
        fb.style.color   = 'rgba(255,80,80,0.85)';
        fb.style.display = 'block';
        return;
      }

      // Backend-ready payload
      // → fetch('/api/reviews', { method:'POST', body: JSON.stringify(payload) })
      // → supabase.from('reviews').insert(payload)
      const payload = {
        id:          `SIG-${Date.now()}`,
        name, role, company, location,
        email,           // private — never displayed
        text,
        submittedAt: new Date().toISOString(),
        status:      'pending',
        source:      'portfolio-signal-form',
      };

      console.log('[SIGNAL] Review payload:', payload);

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
    }, 500);
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
