/* ============================================================
   HERO-ANIM.JS v5 — Clean static Game Boy portrait
   No animation noise. Just the image + name tag + scanlines.
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PW = 480, PH = 300;
  canvas.width = PW;
  canvas.height = PH;

  // Embed the dithered image
  const img = new Image();
  img.src = 'data:image/png;base64,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';

  function drawNameTag() {
    const tw = 220, th = 52;
    const tx = PW - tw - 10, ty = PH - th - 10;

    // Panel background
    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    ctx.fillRect(tx, ty, tw, th);

    // White border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(tx, ty, tw, th);

    // Inner border inset
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(tx + 3, ty + 3, tw - 6, th - 6);

    // Name
    ctx.font = 'bold 14px "Share Tech Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('REDA ESSABRE', tx + 10, ty + 22);

    // Role
    ctx.font = '10px "Share Tech Mono", monospace';
    ctx.fillStyle = '#a0a0a0';
    ctx.letterSpacing = '0.1em';
    ctx.fillText('DATA AUTOMATION OPS', tx + 10, ty + 36);

    // Sun mark
    const sx = tx + tw - 22, sy = ty + 14;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(sx, sy, 6, 0, Math.PI * 2);
    ctx.stroke();
    // rays
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(a) * 8, sy + Math.sin(a) * 8);
      ctx.lineTo(sx + Math.cos(a) * 11, sy + Math.sin(a) * 11);
      ctx.stroke();
    }

    // Amber dot
    ctx.fillStyle = '#d4a843';
    ctx.fillRect(tx + 10, ty + 44, 5, 5);
    ctx.font = '8px "Share Tech Mono", monospace';
    ctx.fillStyle = '#d4a843';
    ctx.fillText('ACTIVE', tx + 18, ty + 49);
  }

  function drawScanlines() {
    // Very subtle — just every 3rd line, low opacity
    for (let y = 0; y < PH; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.10)';
      ctx.fillRect(0, y, PW, 1);
    }
  }

  function render() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, PW, PH);

    // Draw portrait
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, PW, PH);

    // Subtle scanlines
    drawScanlines();

    // Name tag
    drawNameTag();
  }

  img.onload = render;

  // Blink the amber dot only — everything else stays static
  let frame = 0;
  function tick() {
    frame++;
    // Redraw only every 30 frames for the blink effect
    if (frame % 30 === 0) render();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
