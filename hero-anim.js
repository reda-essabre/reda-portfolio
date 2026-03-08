/* ============================================================
   HERO-ANIM.JS
   Cyberpunk Matrix banner background
   ============================================================ */
(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const HERO_HEIGHT = 480;
  const FONT_SIZE = 16;
  const COL_SPACING = 16;
  const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-<>[]{}?/\\";

  const columns = [];
  const streaks = [];

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomChar() {
    return CHARS[(Math.random() * CHARS.length) | 0];
  }

  function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = HERO_HEIGHT;

    canvas.style.width = "100vw";
    canvas.style.height = `${HERO_HEIGHT}px`;
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
        speed: rand(2, 4), // px per frame
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
        speed: rand(2, 4),
      });
    }
  }

  function drawMatrixRain(width, height) {
    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.textBaseline = "top";

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const headY = col.y;

      ctx.fillStyle = "#ffffff";
      ctx.fillText(randomChar(), col.x, headY);

      ctx.fillStyle = "#bbbbbb";
      ctx.fillText(randomChar(), col.x, headY - FONT_SIZE);
      ctx.fillText(randomChar(), col.x, headY - FONT_SIZE * 2);

      ctx.fillStyle = "#444444";
      for (let t = 3; t <= 10; t++) {
        ctx.fillText(randomChar(), col.x, headY - FONT_SIZE * t);
      }

      col.y += col.speed;
      if (col.y - FONT_SIZE * 10 > height) {
        col.y = rand(-height, 0);
        col.speed = rand(2, 4);
      }
    }
  }

  function drawDiagonalStreaks(width, height) {
    ctx.strokeStyle = "#ffffff";
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
        s.speed = rand(2, 4);
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

  function frame() {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    drawMatrixRain(width, height);
    drawDiagonalStreaks(width, height);
    drawCrtOverlay(width, height);
    drawVignette(width, height);

    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", setupCanvas);
  setupCanvas();
  requestAnimationFrame(frame);
})();
