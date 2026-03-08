/* ============================================================
   HERO-ANIM.JS
   Static hero image renderer
   ============================================================ */
(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const heroImage = new Image();

  function drawHero() {
    const width = canvas.clientWidth || 320;
    const height = canvas.clientHeight || 200;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false;

    const imgRatio = heroImage.width / heroImage.height;
    const canvasRatio = width / height;
    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    }

    ctx.drawImage(heroImage, offsetX, offsetY, drawWidth, drawHeight);
  }

  heroImage.onload = drawHero;
  heroImage.src = "reda-hero.png";

  window.addEventListener("resize", () => {
    if (heroImage.complete) drawHero();
  });
})();
