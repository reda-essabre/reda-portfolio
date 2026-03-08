/* ============================================================
   HERO-ANIM.JS
   Static hero image renderer
   ============================================================ */
(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const heroImage = new Image();
  let frameId = null;
  let ready = false;
  const CELL = 7;
  const matrix = {
    cols: 0,
    drops: [],
    speeds: [],
    chars: "0123456789天地玄黄宇宙洪荒日月盈昃辰宿列张山川异域风月同天龙虎凤云火水木金土",
  };

  function resizeCanvas() {
    const width = canvas.clientWidth || 320;
    const height = canvas.clientHeight || 200;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      setupMatrix(width, height);
    }
  }

  function setupMatrix(width, height) {
    const cols = Math.ceil(width / CELL);
    const rows = Math.ceil(height / CELL);
    matrix.cols = cols;
    matrix.drops = Array.from({ length: cols }, () => Math.floor(Math.random() * rows));
    matrix.speeds = Array.from({ length: cols }, () => 0.12 + Math.random() * 0.22);
  }

  function drawAnimatedBackground(width, height, t) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.fillRect(0, 0, width, height);

    ctx.font = `bold ${CELL - 1}px monospace`;
    ctx.textBaseline = "top";
    const hueA = (t * 0.02) % 360;
    const hueB = (hueA + 50) % 360;
    for (let i = 0; i < matrix.cols; i++) {
      const x = i * CELL;
      const y = Math.floor(matrix.drops[i]) * CELL;
      const char = matrix.chars[(Math.random() * matrix.chars.length) | 0];

      ctx.fillStyle = `hsla(${hueA}, 95%, 82%, 0.95)`;
      ctx.fillText(char, x, y);

      ctx.fillStyle = `hsla(${hueB}, 100%, 70%, 0.72)`;
      ctx.fillText(char, x, y + CELL);

      matrix.drops[i] += matrix.speeds[i];
      if (y > height + Math.random() * 220) {
        matrix.drops[i] = -((Math.random() * height) / CELL);
        matrix.speeds[i] = 0.12 + Math.random() * 0.22;
      }
    }
  }

  function drawHero() {
    resizeCanvas();
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    drawAnimatedBackground(width, height, performance.now());
    ctx.imageSmoothingEnabled = true;

    const imgRatio = heroImage.width / heroImage.height;
    const canvasRatio = width / height;
    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    // Keep original image proportions (no stretching).
    if (imgRatio > canvasRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.globalAlpha = 1;
    ctx.drawImage(heroImage, offsetX, offsetY, drawWidth, drawHeight);
  }

  function tick() {
    if (!ready) return;
    drawHero();
    frameId = window.requestAnimationFrame(tick);
  }

  heroImage.onload = function () {
    ready = true;
    if (frameId === null) frameId = window.requestAnimationFrame(tick);
  };
  heroImage.src = "reda-hero.png";

  window.addEventListener("resize", () => {
    if (ready) drawHero();
  });
})();
