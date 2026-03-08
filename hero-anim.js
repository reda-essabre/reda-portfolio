const canvas = document.getElementById("hero-canvas");
if (!canvas) throw new Error("Canvas #hero-canvas not found");

const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const parent = canvas.parentElement;
  canvas.width = parent ? parent.clientWidth : window.innerWidth;
  canvas.height = 420;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const hero = new Image();
hero.src = "reda-hero.png"; // put your face image here

ctx.imageSmoothingEnabled = false;

const rainDrops = [];
const codeCols = [];
const CODE_CHARS = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randomChar() {
  return CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
}

function initScene() {
  rainDrops.length = 0;
  codeCols.length = 0;

  for (let i = 0; i < 140; i++) {
    rainDrops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 8 + Math.random() * 18,
      speed: 2 + Math.random() * 4,
      drift: 0.6 + Math.random() * 1.2
    });
  }

  const spacing = 18;
  for (let x = 0; x < canvas.width + spacing; x += spacing) {
    codeCols.push({
      x,
      y: Math.random() * canvas.height - canvas.height,
      speed: 1 + Math.random() * 2.2,
      chars: Array.from({ length: 24 }, () => randomChar())
    });
  }
}

function drawBackgroundGradient() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#000000");
  g.addColorStop(1, "#050505");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawMovingCode(time) {
  ctx.save();
  ctx.font = "12px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  for (const col of codeCols) {
    for (let i = 0; i < col.chars.length; i++) {
      const yy = col.y + i * 14;
      if (yy > -20 && yy < canvas.height + 20) {
        const flicker = ((time * 0.02 + i) % 7) < 1 ? "#d0d0d0" : "#6f6f6f";
        ctx.fillStyle = i === col.chars.length - 1 ? "#ffffff" : flicker;
        ctx.fillText(col.chars[i], col.x, yy);
      }
    }

    col.y += col.speed;

    if (Math.random() < 0.03) {
      const idx = Math.floor(Math.random() * col.chars.length);
      col.chars[idx] = randomChar();
    }

    if (col.y - col.chars.length * 14 > canvas.height) {
      col.y = -Math.random() * 220 - 100;
      col.speed = 1 + Math.random() * 2.2;
      col.chars = Array.from({ length: 24 }, () => randomChar());
    }
  }

  ctx.restore();
}

function drawRain() {
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;

  for (const d of rainDrops) {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + d.len * 0.55, d.y + d.len);
    ctx.stroke();

    d.y += d.speed;
    d.x += d.drift;

    if (d.y > canvas.height + 20 || d.x > canvas.width + 20) {
      d.y = -20 - Math.random() * 120;
      d.x = Math.random() * canvas.width * 0.9;
    }
  }

  ctx.restore();
}

function drawVignette() {
  const g = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    40,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.55
  );
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawHero(time) {
  if (!hero.complete) return;

  const floatY = Math.sin(time * 0.002) * 6;
  const swayX = Math.sin(time * 0.0012) * 4;

  const baseSize = Math.min(canvas.width * 0.32, 260);
  const w = baseSize;
  const h = baseSize;

  const x = canvas.width / 2 - w / 2 + swayX;
  const y = canvas.height / 2 - h / 2 + floatY + 12;

  // shadow glow behind portrait
  const glow = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2 + 10,
    10,
    canvas.width / 2,
    canvas.height / 2 + 10,
    170
  );
  glow.addColorStop(0, "rgba(255,255,255,0.10)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(hero, x, y, w, h);
  ctx.restore();
}

function drawScanlines() {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.fillRect(0, y, canvas.width, 1);
  }
  ctx.restore();
}

function animate(time) {
  drawBackgroundGradient();
  drawMovingCode(time);   // moving matrix code
  drawRain();             // moving diagonal streaks
  drawHero(time);         // your face image
  drawVignette();
  drawScanlines();

  requestAnimationFrame(animate);
}

hero.onload = () => {
  initScene();
  animate(0);
};

window.addEventListener("resize", () => {
  resizeCanvas();
  initScene();
});