/* ============================================================
   HERO-ANIM.JS
   Cyberpunk Matrix banner background
   ============================================================ */
(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const label = document.querySelector(".hero-art-label span");
  const signalCount = document.getElementById("hero-signal-count");

  const FONT_SIZE = 13;
  const COL_SPACING = 20;
  const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-<>[]{}?/\\";
  const HERO_IMAGE_SRC = "reda-hero.png";

  const columns = [];
  const streaks = [];
  const heroImage = new Image();
  let heroReady = false;

  if (label) label.textContent = "RE / VISUAL CONSOLE";
  if (signalCount) signalCount.textContent = "PORTRAIT ACTIVE";

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomChar() {
    return CHARS[(Math.random() * CHARS.length) | 0];
  }

  function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth);
    const height = Math.max(1, canvas.clientHeight || canvas.parentElement?.clientHeight || 320);

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    setupColumns(width, height);
    setupStreaks(width, height);
  }

  function setupColumns(width, height) {
    columns.length = 0;
    const count = Math.ceil(width / COL_SPACING);
    for (let i = 0; i < count; i++) {
      columns.push({
        x: i * COL_SPACING,
        y: rand(-height, 0),
        speed: rand(1.1, 2.1),
      });
    }
  }

  function setupStreaks(width, height) {
    streaks.length = 0;
    const count = Math.max(20, Math.floor(width / 32));
    for (let i = 0; i < count; i++) {
      streaks.push({
        x: rand(-width, width),
        y: rand(-height, height),
        len: rand(12, 24),
        speed: rand(1.1, 2.4),
      });
    }
  }

  function drawMatrixRain(width, height) {
    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.textBaseline = "top";

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const headY = col.y;

      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.fillText(randomChar(), col.x, headY);

      ctx.fillStyle = "rgba(200,200,200,0.42)";
      ctx.fillText(randomChar(), col.x, headY - FONT_SIZE);
      ctx.fillText(randomChar(), col.x, headY - FONT_SIZE * 2);

      ctx.fillStyle = "rgba(90,90,90,0.22)";
      for (let t = 3; t <= 10; t++) {
        ctx.fillText(randomChar(), col.x, headY - FONT_SIZE * t);
      }

      col.y += col.speed;
      if (col.y - FONT_SIZE * 10 > height) {
        col.y = rand(-height, 0);
        col.speed = rand(1.1, 2.1);
      }
    }
  }

  function drawDiagonalStreaks(width, height) {
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    for (let i = 0; i < streaks.length; i++) {
      const s = streaks[i];
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + s.len, s.y + s.len); // 45 degree
      ctx.stroke();

      s.x += s.speed;
      s.y += s.speed;

      if (s.x - s.len > width || s.y - s.len > height) {
        s.x = rand(-width * 0.3, width * 0.3);
        s.y = rand(-height, 0);
        s.len = rand(12, 24);
        s.speed = rand(1.1, 2.4);
      }
    }

    ctx.globalAlpha = 1;
  }

  function drawCrtOverlay(width, height) {
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1);
    }
  }

  function drawVignette(width, height) {
    const g = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      Math.min(width, height) * 0.2,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.65
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.65)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }

  function drawHeroImage(width, height) {
    if (!heroReady) return;

    const imgRatio = heroImage.width / heroImage.height;
    const canvasRatio = width / height;
    let drawWidth;
    let drawHeight;

    if (imgRatio > canvasRatio) {
      drawHeight = height * 0.98;
      drawWidth = drawHeight * imgRatio;
    } else {
      drawWidth = width * 0.98;
      drawHeight = drawWidth / imgRatio;
    }

    const offsetX = width - drawWidth - width * 0.05;
    const offsetY = (height - drawHeight) * 0.5 - height * 0.015;

    ctx.save();
    ctx.filter = "grayscale(1) contrast(1.18) brightness(0.9)";
    ctx.globalAlpha = 0.96;
    ctx.drawImage(heroImage, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    const shadow = ctx.createLinearGradient(0, 0, width, 0);
    shadow.addColorStop(0, "rgba(0,0,0,0)");
    shadow.addColorStop(0.45, "rgba(0,0,0,0.12)");
    shadow.addColorStop(1, "rgba(0,0,0,0.34)");
    ctx.fillStyle = shadow;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    ctx.strokeRect(width * 0.08, height * 0.12, width * 0.84, height * 0.72);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.moveTo(width * 0.12, height * 0.22);
    ctx.lineTo(width * 0.88, height * 0.22);
    ctx.moveTo(width * 0.12, height * 0.74);
    ctx.lineTo(width * 0.88, height * 0.74);
    ctx.stroke();
    ctx.restore();
  }

  function frame() {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    drawMatrixRain(width, height);
    drawDiagonalStreaks(width, height);
    drawHeroImage(width, height);
    drawCrtOverlay(width, height);
    drawVignette(width, height);

    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", setupCanvas);
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = HERO_IMAGE_SRC;
  setupCanvas();
  requestAnimationFrame(frame);
})();
