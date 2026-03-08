/* ============================================================
   HERO-ANIM.JS — MATRIX / GAME BOY / 1-BIT HERO SCENE
   Drop-in replacement for your current hero animation
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });

  // Internal low-res buffer for sharp pixel scaling
  const IW = 240;
  const IH = 150;

  canvas.width = IW;
  canvas.height = IH;
  canvas.style.imageRendering = 'pixelated';
  canvas.style.imageRendering = 'crisp-edges';

  const C = {
    bg: '#000000',
    white: '#ffffff',
    light: '#d9d9d9',
    mid: '#8a8a8a',
    dark: '#4b4b4b'
  };

  // 4x4 Bayer dither
  const BAYER = [
    0,  8,  2, 10,
    12, 4, 14,  6,
    3, 11,  1,  9,
    15, 7, 13,  5
  ];

  function dither(x, y, threshold) {
    return (BAYER[(y & 3) * 4 + (x & 3)] / 16) < threshold;
  }

  function px(x, y, color = C.white) {
    ctx.fillStyle = color;
    ctx.fillRect(x | 0, y | 0, 1, 1);
  }

  function rect(x, y, w, h, color = C.white) {
    ctx.fillStyle = color;
    ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
  }

  function ditherRect(x, y, w, h, threshold, color = C.white) {
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        if (dither(x + xx, y + yy, threshold)) {
          px(x + xx, y + yy, color);
        }
      }
    }
  }

  function outlineRect(x, y, w, h) {
    rect(x, y, w, 1, C.white);
    rect(x, y + h - 1, w, 1, C.white);
    rect(x, y, 1, h, C.white);
    rect(x + w - 1, y, 1, h, C.white);
  }

  let t = 0;
  let rainOffset = 0;
  let starTick = 0;
  const stars = Array.from({ length: 18 }, () => ({
    x: Math.random() * IW,
    y: Math.random() * IH,
    s: Math.random() > 0.5 ? 1 : 2
  }));

  function drawBackground() {
    rect(0, 0, IW, IH, C.bg);

    // Sparse stars
    starTick += 0.02;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (((i + (starTick | 0)) % 3) !== 0) {
        rect(s.x, s.y, s.s, 1, C.white);
      }
    }

    // Diagonal rain streaks like your references
    rainOffset = (rainOffset + 1.8) % 24;

    for (let row = -20; row < IH + 20; row += 18) {
      for (let col = -30; col < IW + 30; col += 28) {
        const x = col + ((row / 18) % 2) * 8;
        const y = row + rainOffset;

        for (let k = 0; k < 8; k++) {
          const rx = (x + k * 2) | 0;
          const ry = (y + k * 2) | 0;
          if (rx >= 0 && rx < IW && ry >= 0 && ry < IH) {
            px(rx, ry, C.white);
          }
        }
      }
    }
  }

  function drawLeftBeam(frame) {
    const pulse = Math.sin(frame * 0.07) * 0.5 + 0.5;

    // Long beam / ship nose coming from left
    for (let x = 0; x < 86; x++) {
      const halfH = 18 - (x * 0.17);
      const yMid = 95;

      for (let yy = -halfH; yy <= halfH; yy++) {
        const pyy = (yMid + yy) | 0;
        const pxx = x | 0;

        if (Math.abs(yy) < halfH - 1) {
          const shade =
            x < 20 ? 0.75 :
            x < 45 ? 0.55 :
            x < 70 ? 0.35 : 0.18;

          if (dither(pxx, pyy, shade)) px(pxx, pyy, C.light);
        } else {
          px(pxx, pyy, C.white);
        }
      }
    }

    // Beam glow core
    if (pulse > 0.45) {
      rect(8, 94, 14, 2, C.white);
    }

    // Small spikes on top of nose
    rect(4, 73, 2, 5, C.white);
    rect(10, 69, 2, 9, C.white);
    rect(17, 71, 2, 7, C.white);
  }

  function drawHero(frame) {
    const bob = Math.sin(frame * 0.09) * 1.5;
    const x = 150;
    const y = 95 + bob;

    // Cape / body silhouette
    const bodyTop = y - 20;
    const bodyBottom = y + 34;

    for (let yy = bodyTop; yy <= bodyBottom; yy++) {
      const p = (yy - bodyTop) / (bodyBottom - bodyTop);
      const halfW = 10 + p * 22;

      for (let xx = -halfW; xx <= halfW; xx++) {
        const ax = x + xx;
        const ay = yy;

        const isEdge = Math.abs(xx) >= halfW - 1;

        if (isEdge) {
          px(ax, ay, C.white);
        } else {
          // strong dither gradient for the cloak/body
          const shade =
            p < 0.22 ? 0.15 :
            p < 0.45 ? 0.28 :
            p < 0.72 ? 0.42 : 0.58;

          if (dither(ax, ay, shade)) px(ax, ay, C.mid);
        }
      }
    }

    // Chest circle / core
    for (let yy = -6; yy <= 6; yy++) {
      for (let xx = -6; xx <= 6; xx++) {
        const dist = xx * xx + yy * yy;
        const ax = x + 16 + xx;
        const ay = y + 5 + yy;

        if (dist <= 36 && dist >= 20) px(ax, ay, C.white);
        if (dist < 20) px(ax, ay, C.bg);
        if (dist < 5) px(ax, ay, C.white);
      }
    }

    // Belt / panels
    outlineRect(x - 12, y + 24, 10, 4);
    outlineRect(x + 2, y + 24, 10, 4);
    outlineRect(x + 16, y + 24, 10, 4);

    // Neck connector
    rect(x - 3, y - 27, 7, 12, C.dark);
    rect(x - 2, y - 26, 5, 10, C.white);
    rect(x - 1, y - 25, 3, 8, C.bg);

    // Halo / ring
    const ringY = y - 36;
    for (let yy = -15; yy <= 15; yy++) {
      for (let xx = -18; xx <= 18; xx++) {
        const d = (xx * xx) / 1.6 + (yy * yy);
        const ax = x + xx;
        const ay = ringY + yy;

        if (d <= 260 && d >= 120) {
          const shade = xx > 0 ? 0.65 : 0.35;
          if (dither(ax, ay, shade)) px(ax, ay, C.light);
        }
      }
    }

    // Head / mask
    rect(x - 9, y - 24, 12, 14, C.white);
    rect(x - 8, y - 23, 10, 12, C.bg);

    // Face plate
    rect(x - 7, y - 22, 8, 10, C.light);
    ditherRect(x - 7, y - 22, 8, 10, 0.45, C.white);

    // Eye
    rect(x - 3, y - 18, 3, 3, C.white);

    // Small front sensor
    rect(x - 12, y - 18, 3, 5, C.white);
    rect(x - 11, y - 17, 1, 3, C.bg);
  }

  function drawFlashLines(frame) {
    // Faster streaks around the hero
    const speed = (frame * 3) % 40;

    for (let i = 0; i < 9; i++) {
      const baseX = 150 + i * 10;
      const baseY = 20 + ((i * 13 + speed) % 110);

      for (let k = 0; k < 5; k++) {
        const x = baseX + k * 2;
        const y = baseY + k * 2;
        if (x >= 0 && x < IW && y >= 0 && y < IH) px(x, y, C.white);
      }
    }
  }

  function render() {
    t++;

    drawBackground();
    drawLeftBeam(t);
    drawHero(t);
    drawFlashLines(t);

    requestAnimationFrame(render);
  }

  render();
})();