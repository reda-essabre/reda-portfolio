/* ============================================================
   HERO-ANIM.JS v4
   Real image — Game Boy 4-shade dithered
   Animated speed lines + scanlines + name tag overlay
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PW = 320, PH = 200;
  canvas.width = PW;
  canvas.height = PH;

  // Speed lines — diagonal like the reference image
  const LINES = Array.from({ length: 26 }, (_, i) => ({
    // Mostly diagonal (top-left to bottom-right direction like snow/speed in image)
    angle: (Math.random() * 0.6 - 0.3) + (Math.random() > 0.5 ? Math.PI * 0.22 : Math.PI * 1.22),
    x: Math.random() * PW,
    y: Math.random() * PH,
    len: 12 + Math.random() * 28,
    spd: 1.2 + Math.random() * 1.8,
    w:   Math.random() > 0.6 ? 2 : 1,
    phase: Math.random() * 100,
  }));

  function drawSpeedLines(f) {
    LINES.forEach(l => {
      const t = ((l.phase + f * l.spd) % 160) / 160;
      // fade in then fade out
      const alpha = t < 0.4 ? t / 0.4 : (1 - t) / 0.6;
      const lx = (l.x + Math.cos(l.angle) * t * 80) % PW;
      const ly = (l.y + Math.sin(l.angle) * t * 80) % PH;
      ctx.save();
      ctx.globalAlpha = alpha * 0.85;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = l.w;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + Math.cos(l.angle) * l.len, ly + Math.sin(l.angle) * l.len);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawScanlines() {
    for (let y = 0; y < PH; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, y, PW, 1);
    }
    // random noise pixels
    if (Math.random() > 0.85) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
      ctx.fillRect(0, Math.random() * PH | 0, PW, 1);
    }
  }

  function drawTag(f) {
    const tx = PW - 120, ty = PH - 44;
    const blink = Math.floor(f / 26) % 5 < 4;

    // semi-transparent panel
    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.fillRect(tx - 3, ty - 3, 118, 40);
    // border
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tx - 3, ty - 3, 118, 1);
    ctx.fillRect(tx - 3, ty + 37, 118, 1);
    ctx.fillRect(tx - 3, ty - 3, 1, 40);
    ctx.fillRect(tx + 115, ty - 3, 1, 40);

    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('REDA ESSABRE', tx + 4, ty + 12);

    ctx.font = '6px monospace';
    ctx.fillStyle = '#a0a0a0';
    ctx.fillText('DATA AUTOMATION OPS', tx + 4, ty + 23);

    ctx.fillStyle = blink ? '#d4a843' : 'rgba(0,0,0,0)';
    ctx.fillText('\u25CF SYSTEM ACTIVE', tx + 4, ty + 33);
  }

  // Load the embedded dithered image
  const img = new Image();
  img.src = 'data:image/png;base64,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';

  let frame = 0;
  let imgReady = false;
  img.onload = () => { imgReady = true; };

  function loop() {
    frame++;

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, PW, PH);

    // Draw the dithered portrait
    if (imgReady) {
      ctx.drawImage(img, 0, 0, PW, PH);
    }

    // Speed lines on top
    drawSpeedLines(frame);

    // Scanlines
    drawScanlines();

    // Name tag
    drawTag(frame);

    // Occasional flicker
    if (frame % 220 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(0, 0, PW, PH);
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
