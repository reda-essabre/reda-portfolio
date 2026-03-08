(() => {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) {
    console.error("hero-canvas not found");
    return;
  }

  const ctx = canvas.getContext("2d", { alpha: false });
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const IMAGE_PATH = "reda-hero.png";

  const heroImg = new Image();
  heroImg.src = IMAGE_PATH;

  let w = 0;
  let h = 0;

  const codeColumns = [];
  const rainLines = [];
  const glyphs = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+=-<>[]{}";
  let time = 0;

  function resize() {
    const parent = canvas.parentElement || canvas;
    const cssW = parent.clientWidth || 900;
    const cssH = 420;

    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";

    canvas.width = Math.floor(cssW * DPR);
    canvas.height = Math.floor(cssH * DPR);

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    w = cssW;
    h = cssH;

    initBackground();
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pick(str) {
    return str[(Math.random() * str.length) | 0];
  }

  function initBackground() {
    codeColumns.length = 0;
    rainLines.length = 0;

    const colGap = 18;
    const count = Math.ceil(w / colGap) + 2;

    for (let i = 0; i < count; i++) {
      codeColumns.push({
        x: i * colGap,
        y: rand(-h, 0),
        speed: rand(1.4, 3.4),
        length: (rand(12, 26)) | 0,
        chars: Array.from({ length: 28 }, () => pick(glyphs))
      });
    }

    for (let i = 0; i < 120; i++) {
      rainLines.push({
        x: rand(0, w),
        y: rand(0, h),
        len: rand(8, 24),
        speed: rand(4, 10),
        drift: rand(1.2, 2.8)
      });
    }
  }

  function drawBackground() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    // moving matrix columns
    ctx.font = "12px monospace";
    ctx.textBaseline = "top";

    for (const col of codeColumns) {
      for (let i = 0; i < col.length; i++) {
        const yy = col.y + i * 14;
        if (yy < -20 || yy > h + 20) continue;

        let shade = "#4a4a4a";
        if (i > col.length - 4) shade = "#bfbfbf";
        if (i === col.length - 1) shade = "#ffffff";

        ctx.fillStyle = shade;
        ctx.fillText(col.chars[i % col.chars.length], col.x, yy);
      }

      col.y += col.speed;

      if (Math.random() < 0.08) {
        const idx = (Math.random() * col.chars.length) | 0;
        col.chars[idx] = pick(glyphs);
      }

      if (col.y - col.length * 14 > h) {
        col.y = rand(-160, -40);
        col.speed = rand(1.4, 3.4);
        col.length = (rand(12, 26)) | 0;
      }
    }

    // diagonal streaks like the gif
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;

    for (const r of rainLines) {
      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x + r.len * 0.55, r.y + r.len);
      ctx.stroke();

      r.x += r.drift;
      r.y += r.speed;

      if (r.y > h + 30 || r.x > w + 30) {
        r.x = rand(-40, w * 0.7);
        r.y = rand(-140, -20);
      }
    }
  }

  function drawPixelPortrait(img, t) {
    if (!img.complete || !img.naturalWidth) return;

    const floatY = Math.sin(t * 0.0018) * 6;
    const swayX = Math.sin(t * 0.0012) * 4;

    // portrait area: large and centered, using most of the frame
    const targetW = Math.min(w * 0.62, 520);
    const targetH = h * 0.9;
    const dx = (w - targetW) * 0.5 + swayX;
    const dy = (h - targetH) * 0.5 + floatY;

    // create offscreen tiny version to force blocky look
    const pixelScale = 7; // bigger = chunkier blocks
    const smallW = Math.max(36, Math.floor(targetW / pixelScale));
    const smallH = Math.max(48, Math.floor(targetH / pixelScale));

    const off = document.createElement("canvas");
    off.width = smallW;
    off.height = smallH;
    const octx = off.getContext("2d", { willReadFrequently: true });

    octx.imageSmoothingEnabled = false;

    // cover crop so the portrait uses the frame well
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = smallW / smallH;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgRatio > boxRatio) {
      sw = img.naturalHeight * boxRatio;
      sx = (img.naturalWidth - sw) * 0.5;
    } else {
      sh = img.naturalWidth / boxRatio;
      sy = (img.naturalHeight - sh) * 0.38; // bias upward toward face
    }

    octx.drawImage(img, sx, sy, sw, sh, 0, 0, smallW, smallH);

    // grayscale + hard posterize
    const imageData = octx.getImageData(0, 0, smallW, smallH);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      let gray = 0.299 * r + 0.587 * g + 0.114 * b;

      // boost contrast
      gray = gray < 70 ? 0 : gray < 120 ? 85 : gray < 180 ? 170 : 255;

      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }

    octx.putImageData(imageData, 0, 0);

    // glow behind face
    const glow = ctx.createRadialGradient(
      w * 0.5,
      h * 0.5,
      20,
      w * 0.5,
      h * 0.5,
      Math.max(targetW, targetH) * 0.55
    );
    glow.addColorStop(0, "rgba(255,255,255,0.14)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // draw pixel portrait scaled up
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, dx, dy, targetW, targetH);
    ctx.restore();

    // subtle black fade on lower part so it feels cinematic
    const fade = ctx.createLinearGradient(0, dy + targetH * 0.65, 0, dy + targetH);
    fade.addColorStop(0, "rgba(0,0,0,0)");
    fade.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = fade;
    ctx.fillRect(dx, dy, targetW, targetH);
  }

  function drawScanlines() {
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1);
    }
  }

  function drawVignette() {
    const g = ctx.createRadialGradient(
      w * 0.5,
      h * 0.45,
      60,
      w * 0.5,
      h * 0.5,
      w * 0.7
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.75)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function render(ts) {
    time = ts;

    drawBackground();
    drawPixelPortrait(heroImg, ts);
    drawVignette();
    drawScanlines();

    requestAnimationFrame(render);
  }

  heroImg.onload = () => {
    console.log("Hero image loaded:", IMAGE_PATH);
    resize();
    requestAnimationFrame(render);
  };

  heroImg.onerror = () => {
    console.error("Failed to load image:", IMAGE_PATH);
    resize();
    drawBackground();
    ctx.fillStyle = "#fff";
    ctx.font = "16px monospace";
    ctx.fillText("Image not found: " + IMAGE_PATH, 20, 40);
  };

  window.addEventListener("resize", resize);
  resize();
})();