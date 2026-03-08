/* ============================================================
   HERO-ANIM.JS
   Vintage pixel animation: "RE" character flying through
   a scrolling 1-bit dither landscape with a rising sun.
   Superman-style side-scroller. Loops forever.
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Internal pixel resolution — low-res for that chunky pixel look
  const PW = 160, PH = 100;
  const S = 3; // display scale (set via CSS anyway)
  canvas.width = PW;
  canvas.height = PH;

  // Colors
  const BG = '#000000';
  const FG = '#ffffff';
  const AM = '#d4a843'; // amber

  let frame = 0;
  let signals = 0;
  let lastTs = 0;

  // ---- STARS ----
  const STARS = Array.from({length: 40}, () => ({
    x: Math.random() * PW,
    y: Math.random() * (PH * 0.65),
    speed: 0.3 + Math.random() * 0.8,
    size: Math.random() < 0.15 ? 2 : 1,
    bright: Math.random() > 0.5,
  }));

  // ---- BUILDINGS (scrolling cityscape) ----
  const BUILDINGS = [];
  function makeBldg(x) {
    const h = 8 + Math.floor(Math.random() * 22);
    const w = 6 + Math.floor(Math.random() * 12);
    const windows = [];
    for (let wy = PH - h + 2; wy < PH - 2; wy += 4) {
      for (let wx = x + 2; wx < x + w - 2; wx += 4) {
        windows.push({ x: wx, y: wy, lit: Math.random() > 0.4 });
      }
    }
    return { x, w, h, windows, speed: 0.5 };
  }

  let bx = 0;
  for (let i = 0; i < 12; i++) {
    bx += 4 + Math.floor(Math.random() * 10);
    BUILDINGS.push(makeBldg(bx));
    bx += BUILDINGS[BUILDINGS.length - 1].w;
  }

  // ---- DATA PACKETS (collectibles) ----
  const PACKETS = Array.from({length: 5}, (_, i) => ({
    x: 40 + i * 28,
    y: 20 + Math.sin(i * 1.2) * 18,
    collected: false,
    respawn: 0,
  }));

  // ---- SUN ----
  const sun = { x: PW * 0.72, y: PH * 0.28, r: 14, rot: 0 };

  // ---- CHARACTER: flying "RE" pixel figure ----
  // 1-bit pixel map [row][col] — 12x16 pixels
  // Frame A (cape out) and Frame B (cape in) for animation
  const CHAR_A = [
    // head
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,0,1,1,0,1,0],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    // body + cape
    [0,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1],
    [0,0,1,1,1,1,0,0],
    // legs
    [0,0,1,0,0,1,0,0],
    [0,1,1,0,0,1,1,0],
    [0,1,0,0,0,0,1,0],
  ];

  const CHAR_B = [
    // head
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,0,1,1,0,1,0],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    // body + cape (slightly different)
    [1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    // legs
    [0,0,1,0,0,1,0,0],
    [0,1,0,0,0,0,1,0],
    [0,1,1,0,0,1,1,0],
  ];

  const char = {
    x: 24,
    y: PH * 0.42,
    vy: 0,
    bobDir: 1,
    frame: 0,
    frameTimer: 0,
    trail: [],
  };

  // ---- PIXEL TEXT helper ----
  // 3x5 pixel font for "RE" label above character
  const MINI_FONT = {
    'R': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
    'E': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
    'D': [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
    'A': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
    ' ': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
  };

  function drawPixelText(text, x, y, color) {
    let cx = x;
    for (const ch of text) {
      const glyph = MINI_FONT[ch];
      if (!glyph) { cx += 4; continue; }
      for (let row = 0; row < glyph.length; row++) {
        for (let col = 0; col < glyph[row].length; col++) {
          if (glyph[row][col]) {
            ctx.fillStyle = color;
            ctx.fillRect(cx + col, y + row, 1, 1);
          }
        }
      }
      cx += 4;
    }
  }

  // ---- DRAW SUN (pixel style) ----
  function drawSun(t) {
    const { x, y, r } = sun;

    // Dither fill inside sun circle
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= r) {
          const density = 1 - (dist / r) * 0.7;
          // Ordered dither pattern
          const px = ((x + dx) | 0), py = ((y + dy) | 0);
          const threshold = ((px % 4) + (py % 4) * 4) / 16;
          if (density > threshold) {
            ctx.fillStyle = FG;
            ctx.fillRect(px, py, 1, 1);
          }
        }
      }
    }

    // Rays — 8 directions, alternating length
    const rays = 12;
    for (let i = 0; i < rays; i++) {
      const angle = (i / rays) * Math.PI * 2 + t * 0.008;
      const len = i % 2 === 0 ? 5 : 3;
      const x1 = Math.round(x + Math.cos(angle) * (r + 2));
      const y1 = Math.round(y + Math.sin(angle) * (r + 2));
      const x2 = Math.round(x + Math.cos(angle) * (r + 2 + len));
      const y2 = Math.round(y + Math.sin(angle) * (r + 2 + len));
      // Bresenham line
      drawPixelLine(x1, y1, x2, y2, FG);
    }
  }

  function drawPixelLine(x0, y0, x1, y1, color) {
    let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    ctx.fillStyle = color;
    while (true) {
      ctx.fillRect(x0, y0, 1, 1);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx)  { err += dx; y0 += sy; }
    }
  }

  // ---- DRAW CHARACTER ----
  function drawChar(x, y, frameIdx) {
    const map = frameIdx % 2 === 0 ? CHAR_A : CHAR_B;
    const px = 1; // pixel size
    map.forEach((row, ri) => {
      row.forEach((bit, ci) => {
        if (bit) {
          ctx.fillStyle = FG;
          ctx.fillRect((x + ci * px) | 0, (y + ri * px) | 0, px, px);
        }
      });
    });
  }

  // ---- DRAW DITHER GROUND LINE ----
  function drawGround(scrollX) {
    const groundY = PH - 18;

    // Horizon line
    ctx.fillStyle = FG;
    ctx.fillRect(0, groundY, PW, 1);

    // Dither gradient below horizon
    for (let y = groundY + 1; y < PH - 14; y++) {
      const density = (y - groundY) / (PH - 14 - groundY);
      for (let x = 0; x < PW; x++) {
        const threshold = ((x % 4) + ((y) % 4) * 4) / 16;
        if (density > threshold) {
          ctx.fillStyle = FG;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  // ---- DRAW BUILDINGS ----
  function drawBuildings(scrollX) {
    const groundY = PH - 18;
    BUILDINGS.forEach(b => {
      const bx = ((b.x - scrollX) % (PW + 200) + PW + 200) % (PW + 200) - 20;
      const by = groundY - b.h;

      // Building silhouette
      ctx.fillStyle = BG;
      ctx.fillRect(bx, by, b.w, b.h);

      // Building outline
      ctx.fillStyle = FG;
      // Left edge
      for (let y = by; y < groundY; y++) ctx.fillRect(bx, y, 1, 1);
      // Right edge
      for (let y = by; y < groundY; y++) ctx.fillRect(bx + b.w - 1, y, 1, 1);
      // Top edge
      for (let x = bx; x < bx + b.w; x++) ctx.fillRect(x, by, 1, 1);

      // Windows (dithered amber dots)
      b.windows.forEach(w => {
        const wx = bx + (w.x - b.x);
        if (wx > 0 && wx < PW && w.lit) {
          ctx.fillStyle = (frame % 120 < 100 || Math.random() > 0.02) ? AM : BG;
          ctx.fillRect(wx, w.y, 2, 2);
        }
      });
    });
  }

  // ---- DRAW PACKETS ----
  function drawPackets(scrollX) {
    const el = document.getElementById('hero-signal-count');
    PACKETS.forEach((p, i) => {
      if (p.collected) {
        if (frame > p.respawn) {
          p.x = char.x + 80 + Math.random() * 60;
          p.y = 15 + Math.random() * 35;
          p.collected = false;
        }
        return;
      }
      const px = ((p.x - scrollX * 0.6) % (PW + 60) + PW + 60) % (PW + 60);
      const py = p.y + Math.sin(frame * 0.05 + i) * 2;

      // Outer square
      ctx.fillStyle = FG;
      ctx.fillRect(px - 3, py - 3, 6, 6);
      ctx.fillStyle = BG;
      ctx.fillRect(px - 2, py - 2, 4, 4);
      // Cross
      ctx.fillStyle = AM;
      ctx.fillRect(px - 1, py - 2, 2, 4);
      ctx.fillRect(px - 2, py - 1, 4, 2);

      // Collect check (near character)
      const dx = px - char.x - 4;
      const dy = py - char.y - 6;
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
        p.collected = true;
        p.respawn = frame + 200;
        signals++;
        if (el) el.textContent = 'SIGNALS: ' + signals;
        // Spawn sparkle
        for (let s = 0; s < 5; s++) {
          SPARKS.push({
            x: px, y: py,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 12,
          });
        }
      }
    });
  }

  // ---- SPARKS ----
  const SPARKS = [];
  function drawSparks() {
    for (let i = SPARKS.length - 1; i >= 0; i--) {
      const s = SPARKS[i];
      s.x += s.vx; s.y += s.vy; s.life--;
      if (s.life <= 0) { SPARKS.splice(i, 1); continue; }
      const alpha = s.life / 12;
      ctx.fillStyle = s.life > 6 ? AM : FG;
      ctx.globalAlpha = alpha;
      ctx.fillRect(s.x | 0, s.y | 0, 1, 1);
      ctx.globalAlpha = 1;
    }
  }

  // ---- DRAW STARS ----
  function drawStars(scrollX) {
    STARS.forEach(s => {
      const sx = ((s.x - scrollX * s.speed * 0.2) % PW + PW) % PW;
      const blink = s.bright && frame % 40 < 3;
      ctx.fillStyle = blink ? AM : FG;
      ctx.fillRect(sx | 0, s.y | 0, s.size, s.size);
    });
  }

  // ---- NAME TAG ----
  function drawNameTag() {
    const tx = (char.x - 4) | 0;
    const ty = (char.y - 10) | 0;
    // background pill
    ctx.fillStyle = FG;
    ctx.fillRect(tx - 1, ty - 1, 30, 8);
    // text
    drawPixelText('R E D A', tx, ty, BG);
  }

  // ---- MAIN LOOP ----
  let scrollX = 0;

  function loop(ts) {
    const dt = Math.min((ts - lastTs) / 16.67, 3);
    lastTs = ts;
    frame++;

    // Clear
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, PW, PH);

    // Scroll
    scrollX += 0.7 * dt;

    // Character bob
    char.y += char.vy;
    char.vy += char.bobDir * 0.04 * dt;
    if (char.vy > 0.5) char.bobDir = -1;
    if (char.vy < -0.5) char.bobDir = 1;
    char.y = Math.max(12, Math.min(PH * 0.55, char.y));

    // Char animation frame
    char.frameTimer += dt;
    if (char.frameTimer > 8) { char.frame++; char.frameTimer = 0; }

    // Trail
    if (frame % 2 === 0) {
      char.trail.push({ x: char.x, y: char.y, life: 8 });
    }
    for (let i = char.trail.length - 1; i >= 0; i--) {
      char.trail[i].life -= dt;
      if (char.trail[i].life <= 0) char.trail.splice(i, 1);
    }

    // DRAW ORDER: back to front
    drawStars(scrollX);
    drawSun(ts);

    // Horizontal scan line flicker
    if (frame % 3 === 0) {
      const scanY = Math.floor(Math.random() * PH);
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(0, scanY, PW, 1);
    }

    drawGround(scrollX);
    drawBuildings(scrollX);

    // Trail
    char.trail.forEach(t => {
      const a = t.life / 8;
      ctx.globalAlpha = a * 0.4;
      ctx.fillStyle = FG;
      ctx.fillRect((t.x + 2) | 0, (t.y + 3) | 0, 4, 6);
      ctx.globalAlpha = 1;
    });

    drawChar(char.x - 4, char.y - 6, char.frame);
    drawNameTag();
    drawPackets(scrollX);
    drawSparks();

    // CRT vignette corners (pixel dither)
    for (let i = 0; i < 3; i++) {
      const rx = (Math.random() * PW) | 0;
      const ry = (Math.random() * PH) | 0;
      const edge = Math.min(rx, PW - rx, ry, PH - ry);
      if (edge < 8 && Math.random() > edge / 8) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(rx, ry, 1, 1);
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
