(() => {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) {
    console.error("hero-canvas not found");
    return;
  }

  const ctx = canvas.getContext("2d");
  const heroImg = new Image();

  // put your file here
  heroImg.src = "reda-hero.png";

  let w = 0;
  let h = 0;

  const MATRIX_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-<>[]{}?/\\";
  const columns = [];
  const fontSize = 18;

  function resizeCanvas() {
    const parent = canvas.parentElement || document.body;
    w = parent.clientWidth || window.innerWidth;
    h = 520;

    canvas.width = w;
    canvas.height = h;

    initMatrix();
  }

  function initMatrix() {
    columns.length = 0;
    const count = Math.ceil(w / fontSize);

    for (let i = 0; i < count; i++) {
      columns.push({
        x: i * fontSize,
        y: Math.random() * h - h,
        speed: 2 + Math.random() * 3
      });
    }
  }

  function randomChar() {
    return MATRIX_CHARS[(Math.random() * MATRIX_CHARS.length) | 0];
  }

  function drawBackground() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
  }

  function drawMatrix() {
    ctx.save();
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    for (const col of columns) {
      for (let i = 0; i < 26; i++) {
        const yy = col.y - i * fontSize;
        if (yy < -30 || yy > h + 30) continue;

        if (i === 0) {
          ctx.fillStyle = "#ffffff";
        } else if (i < 4) {
          ctx.fillStyle = "#bfbfbf";
        } else {
          ctx.fillStyle = "#555";
        }

        ctx.fillText(randomChar(), col.x, yy);
      }

      col.y += col.speed;

      if (col.y - 26 * fontSize > h) {
        col.y = -Math.random() * 200 - 50;
        col.speed = 2 + Math.random() * 3;
      }
    }

    ctx.restore();
  }

  function drawRain() {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 45; i++) {
      const offset = (performance.now() * 0.08 + i * 37) % (w + h);
      const x = (offset - h * 0.35 + i * 17) % w;
      const y = (offset * 0.7 + i * 23) % h;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 10, y + 22);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawPortrait(time) {
    if (!heroImg.complete || !heroImg.naturalWidth) return;

    // make image fill the whole frame
    const imgW = heroImg.naturalWidth;
    const imgH = heroImg.naturalHeight;
    const canvasRatio = w / h;
    const imgRatio = imgW / imgH;

    let sx = 0;
    let sy = 0;
    let sw = imgW;
    let sh = imgH;

    // cover crop
    if (imgRatio > canvasRatio) {
      sw = imgH * canvasRatio;
      sx = (imgW - sw) / 2;
    } else {
      sh = imgW / canvasRatio;
      sy = (imgH - sh) / 2;
    }

    const floatY = Math.sin(time * 0.0015) * 4;
    const driftX = Math.sin(time * 0.0009) * 3;

    // black from png becomes visually transparent over matrix
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(heroImg, sx, sy, sw, sh, driftX, floatY, w, h);
    ctx.restore();
  }

  function drawScanlines() {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1);
    }
    ctx.restore();
  }

  function drawVignette() {
    const g = ctx.createRadialGradient(
      w / 2,
      h / 2,
      60,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.65
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.75)");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function render(time) {
    drawBackground();
    drawMatrix();
    drawRain();
    drawPortrait(time);
    drawVignette();
    drawScanlines();

    requestAnimationFrame(render);
  }

  heroImg.onload = () => {
    resizeCanvas();
    requestAnimationFrame(render);
  };

  heroImg.onerror = () => {
    console.error("Could not load image:", heroImg.src);
    resizeCanvas();
    drawBackground();
    ctx.fillStyle = "#fff";
    ctx.font = "16px monospace";
    ctx.fillText("Image not found: " + heroImg.src, 20, 30);
  };

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
})();