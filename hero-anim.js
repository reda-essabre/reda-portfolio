/* ============================================================
   HERO-ANIM.JS v3 — Game Boy 4-shade dither portrait
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PW = 320, PH = 200;
  canvas.width = PW;
  canvas.height = PH;

  const C0 = '#000000';
  const C1 = '#4a4a4a';
  const C2 = '#a0a0a0';
  const C3 = '#ffffff';

  const BAYER = [
    [ 0,  8,  2, 10],
    [12,  4, 14,  6],
    [ 3, 11,  1,  9],
    [15,  7, 13,  5],
  ];

  function dither(x, y, v) {
    const t = BAYER[(y & 3)][(x & 3)] / 16;
    if (v <= 0)   return C0;
    if (v >= 1)   return C3;
    if (v < 0.33) return t < v * 3 ? C1 : C0;
    if (v < 0.66) return t < (v - 0.33) * 3 ? C2 : C1;
    return t < (v - 0.66) * 3 ? C3 : C2;
  }

  function px(x, y, v) {
    if (x < 0 || x >= PW || y < 0 || y >= PH) return;
    ctx.fillStyle = dither(x | 0, y | 0, v);
    ctx.fillRect(x | 0, y | 0, 1, 1);
  }

  function fRect(rx, ry, rw, rh, v) {
    for (let dy = 0; dy < rh; dy++)
      for (let dx = 0; dx < rw; dx++)
        px(rx + dx, ry + dy, v);
  }

  function fCircle(cx, cy, r, vFn) {
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= r) px(cx + dx, cy + dy, vFn(dx, dy, d, r));
      }
  }

  const LINES = Array.from({ length: 30 }, (_, i) => ({
    angle: (i / 30) * Math.PI * 2,
    len:   22 + Math.random() * 52,
    phase: Math.random() * 65,
    spd:   0.55 + Math.random() * 0.85,
    w:     Math.random() > 0.65 ? 2 : 1,
  }));

  function drawLines(f, ox, oy) {
    LINES.forEach(l => {
      const off = (l.phase + f * l.spd) % 68;
      const r0 = 52 + off, r1 = r0 + l.len;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - off / 68) * 0.88;
      ctx.strokeStyle = C3;
      ctx.lineWidth = l.w;
      ctx.beginPath();
      ctx.moveTo(ox + Math.cos(l.angle) * r0, oy + Math.sin(l.angle) * r0);
      ctx.lineTo(ox + Math.cos(l.angle) * r1, oy + Math.sin(l.angle) * r1);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawCharacter(f) {
    const bob = Math.sin(f * 0.035) * 2;
    const CX = 168, CY = 108 + bob;

    // background aura
    fCircle(CX, CY, 82, (dx, dy, d, r) => Math.max(0, 0.20 - (d / r) * 0.22));

    // TORSO
    for (let dy = 0; dy < 95; dy++) {
      const hw = 30 + dy * 0.20;
      for (let dx = -hw; dx <= hw; dx++) {
        const ex = (hw - Math.abs(dx)) / hw;
        const light = ex * 0.35 + (1 - dy / 95) * 0.15;
        const edge = Math.abs(dx) > hw * 0.72 ? -0.22 : 0;
        const seam = Math.abs(dx) < 2 ? 0.12 : 0;
        px(CX + dx, CY - 5 + dy, Math.min(0.80, Math.max(0, 0.18 + light + edge + seam)));
      }
    }
    // collar
    for (let i = -14; i <= 14; i++) { ctx.fillStyle = C0; ctx.fillRect((CX+i)|0,(CY-5)|0,1,1); }

    // sun emblem
    const EX = CX + 18, EY = CY + 30;
    fCircle(EX, EY, 7, (dx, dy, d, r) => d < r * 0.5 ? 0.0 : 0.55 - (d/r)*0.3);
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2;
      ctx.fillStyle = C0;
      ctx.fillRect((EX + Math.cos(ang)*9)|0,(EY + Math.sin(ang)*9)|0,2,2);
    }

    // SHOULDER MECH
    for (let dy = -22; dy < 48; dy++) {
      for (let dx = 28; dx < 78; dx++) {
        const iX = dx - 28, iY = dy + 22;
        if (iX < 4 && iY < 4 && Math.sqrt((iX-4)**2+(iY-4)**2) > 4) continue;
        const band = Math.floor(iX / 6) % 2 === 0 ? 0.08 : 0;
        px(CX + dx, CY - 18 + dy, Math.min(0.72, Math.max(0, 0.38 - (dx-28)/100 + band)));
      }
    }
    for (let i = 0; i < 5; i++) { ctx.fillStyle = C0; ctx.fillRect((CX+30+i*8)|0,(CY-12)|0,3,28); }
    ctx.fillStyle = C3; ctx.fillRect((CX+42)|0,(CY-6)|0,3,3); ctx.fillRect((CX+52)|0,(CY-6)|0,3,3);
    ctx.fillStyle = C0; ctx.fillRect((CX+43)|0,(CY-5)|0,1,1); ctx.fillRect((CX+53)|0,(CY-5)|0,1,1);

    // HEAD
    const HX = CX - 14, HY = CY - 50;
    fCircle(HX, HY, 24, (dx, dy, d, r) => {
      const lx=-0.45, ly=-0.55, nx=dx/r, ny=dy/r;
      const l = Math.max(0, -(nx*lx+ny*ly));
      return Math.min(0.88, 0.32 + l*0.50 - (d/r)*0.10);
    });
    fRect(HX-6, HY+20, 12, 14, 0.35);

    // helmet
    for (let dx = -28; dx < 32; dx++) fRect(HX+dx, HY-22, 1, 5, 0.30 + (dx+28)/120*0.25);
    for (let dx = -22; dx < 24; dx++) fRect(HX+dx, HY-18, 1, 3, 0.55);
    fRect(HX+6, HY-19, 5, 5, 0.75);
    ctx.fillStyle=C0; ctx.fillRect((HX+7)|0,(HY-18)|0,3,3);
    ctx.fillStyle=C3; ctx.fillRect((HX+8)|0,(HY-17)|0,1,1);

    // GOGGLES
    const GY = HY - 3;
    fCircle(HX-10, GY, 9, (dx,dy,d,r) => d < r*0.7 ? 0.05 : 0.55-(d/r)*0.25);
    fCircle(HX+5,  GY, 8, (dx,dy,d,r) => d < r*0.7 ? 0.05 : 0.50-(d/r)*0.22);
    fRect(HX-2, GY-1, 6, 3, 0.15);
    fRect(HX+13, GY-3, 14, 4, 0.35);
    ctx.fillStyle=C3; ctx.fillRect((HX-13)|0,(GY-5)|0,3,2); ctx.fillRect((HX+2)|0,(GY-4)|0,2,2);

    // jaw shadow + smirk
    fCircle(HX+5, HY+12, 7, (dx,dy,d,r) => 0.08 + (1-d/r)*0.12);
    ctx.fillStyle=C0; ctx.fillRect((HX+1)|0,(HY+14)|0,8,1); ctx.fillRect((HX+7)|0,(HY+13)|0,2,1);

    // REACHING ARM (foreshortened)
    for (let step = 0; step < 50; step++) {
      const t = step / 50;
      const ax = CX - 52 - step * 1.6, ay = CY + 18 + step * 0.5;
      const ar = 9 + step * 0.50;
      fCircle(ax, ay, ar, (dx,dy,d,r) => {
        const topL = Math.max(0,-dy/r)*0.38;
        return Math.max(0, 0.28 + topL - (d/r)*0.14 - t*0.04);
      });
      if (step % 8 < 2) { ctx.fillStyle=C0; ctx.fillRect(ax|0,ay|0,1,1); }
    }

    // HAND
    const HNX = CX - 132, HNY = CY + 44;
    fCircle(HNX, HNY, 24, (dx,dy,d,r) => {
      const topL = Math.max(0,-dy/r)*0.32;
      return Math.max(0, 0.30 + topL - (d/r)*0.14);
    });

    const fingers = [
      {ox:-10,oy:-26,len:20,ang:-0.28},
      {ox: -3,oy:-32,len:24,ang:-0.05},
      {ox:  6,oy:-30,len:22,ang: 0.14},
      {ox: 15,oy:-24,len:18,ang: 0.34},
      {ox:-20,oy: -8,len:14,ang:-0.55},
    ];
    fingers.forEach(fg => {
      for (let i = 0; i < fg.len; i++) {
        const t = i/fg.len, fr = Math.max(2, 5-t*3);
        const fx = HNX+fg.ox+Math.sin(fg.ang)*i, fy = HNY+fg.oy-Math.cos(fg.ang)*i;
        fCircle(fx, fy, fr, (dx,dy,d,r) => Math.max(0, 0.36-(d/r)*0.14+(1-t)*0.08));
        if (i===(fg.len*0.38)|0 || i===(fg.len*0.65)|0) {
          ctx.fillStyle=C0; ctx.fillRect(fx|0,fy|0,1,1);
        }
      }
    });

    // gauntlet band
    fRect(HNX-14, HNY+10, 28, 5, 0.45);
    ctx.fillStyle=C3; ctx.fillRect((HNX-8)|0,(HNY+11)|0,5,3); ctx.fillRect((HNX+4)|0,(HNY+11)|0,5,3);
    ctx.fillStyle=C0; ctx.fillRect((HNX-7)|0,(HNY+12)|0,3,1); ctx.fillRect((HNX+5)|0,(HNY+12)|0,3,1);
  }

  function drawTag(f) {
    const tx = PW-118, ty = PH-42;
    const blink = Math.floor(f/28)%5 < 4;
    ctx.fillStyle=C0; ctx.fillRect(tx-3,ty-3,116,38);
    ctx.fillStyle=C3;
    ctx.fillRect(tx-3,ty-3,116,1); ctx.fillRect(tx-3,ty+35,116,1);
    ctx.fillRect(tx-3,ty-3,1,38); ctx.fillRect(tx+113,ty-3,1,38);
    ctx.font='bold 8px monospace'; ctx.fillStyle=C3; ctx.fillText('REDA ESSABRE',tx+3,ty+11);
    ctx.font='6px monospace'; ctx.fillStyle=C2; ctx.fillText('DATA AUTOMATION OPS',tx+3,ty+22);
    ctx.fillStyle=blink?'#d4a843':C0; ctx.fillText('● SYSTEM ACTIVE',tx+3,ty+32);
  }

  function scanlines() {
    for (let y = 0; y < PH; y += 3) {
      ctx.fillStyle='rgba(0,0,0,0.20)';
      ctx.fillRect(0,y,PW,1);
    }
    if (Math.random()>0.93) {
      ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.04})`;
      ctx.fillRect(0,Math.random()*PH|0,PW,1);
    }
  }

  let frame = 0;
  function loop() {
    frame++;
    ctx.fillStyle=C0; ctx.fillRect(0,0,PW,PH);
    drawLines(frame, 175, 106);
    drawCharacter(frame);
    drawTag(frame);
    scanlines();
    if (frame%200===0) { ctx.fillStyle='rgba(255,255,255,0.03)'; ctx.fillRect(0,0,PW,PH); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
