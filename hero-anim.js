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

  function resizeCanvas() {
    const width = canvas.clientWidth || 320;
    const height = canvas.clientHeight || 200;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function drawAnimatedBackground(t, width, height) {
    const g1x = width * (0.3 + Math.sin(t * 0.00035) * 0.18);
    const g1y = height * (0.35 + Math.cos(t * 0.0003) * 0.16);
    const g2x = width * (0.72 + Math.cos(t * 0.00028) * 0.2);
    const g2y = height * (0.62 + Math.sin(t * 0.0004) * 0.14);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#061218");
    gradient.addColorStop(0.45, "#102635");
    gradient.addColorStop(1, "#1f455a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const orbA = ctx.createRadialGradient(g1x, g1y, 12, g1x, g1y, width * 0.45);
    orbA.addColorStop(0, "rgba(120, 224, 255, 0.28)");
    orbA.addColorStop(1, "rgba(120, 224, 255, 0)");
    ctx.fillStyle = orbA;
    ctx.fillRect(0, 0, width, height);

    const orbB = ctx.createRadialGradient(g2x, g2y, 8, g2x, g2y, width * 0.4);
    orbB.addColorStop(0, "rgba(255, 210, 120, 0.2)");
    orbB.addColorStop(1, "rgba(255, 210, 120, 0)");
    ctx.fillStyle = orbB;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let y = ((t * 0.02) % 3); y < height; y += 3) {
      ctx.fillRect(0, y, width, 1);
    }
  }

  function drawHero() {
    resizeCanvas();
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    drawAnimatedBackground(performance.now(), width, height);
    ctx.imageSmoothingEnabled = true;

    const imgRatio = heroImage.width / heroImage.height;
    const canvasRatio = width / height;
    const padding = Math.max(12, Math.round(Math.min(width, height) * 0.06));
    const maxWidth = Math.max(1, width - padding * 2);
    const maxHeight = Math.max(1, height - padding * 2);
    let drawWidth = maxWidth;
    let drawHeight = maxHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = maxWidth;
      drawHeight = maxWidth / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = maxHeight;
      drawWidth = maxHeight * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.drawImage(heroImage, offsetX, offsetY, drawWidth, drawHeight);
    ctx.shadowColor = "transparent";
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
