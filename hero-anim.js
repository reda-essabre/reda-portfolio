/* ============================================================
   HERO-ANIM.JS — Cinematic flying hero scene
   Style: smooth outline art + stars + speed lines + city
   Exactly matching the reference screenshot
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const W = 480, H = 300;
  canvas.width  = W;
  canvas.height = H;

  const C = { bg:'#000000', white:'#ffffff', amber:'#d4a843' };
  const TILE = 20;
  let frame = 0, lastTs = 0, signals = 0;

  // ── GRID ──────────────────────────────────────────────────
  function grid() {
    ctx.save();
    ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
    for(let x=0;x<W;x+=TILE){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=TILE){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.restore();
  }

  // ── SCANLINES ─────────────────────────────────────────────
  function scanlines() {
    for(let y=0;y<H;y+=4){ctx.fillStyle='rgba(0,0,0,0.10)';ctx.fillRect(0,y,W,2);}
    for(let i=0;i<10;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.02})`;ctx.fillRect(Math.random()*W|0,Math.random()*H|0,1,1);}
  }

  // ── STARS ─────────────────────────────────────────────────
  const STARS = Array.from({length:110}, () => ({
    x: Math.random()*W,
    y: Math.random()*(H*0.82),
    size: Math.random(),
    bright: Math.random(),
    twinkle: Math.random()*Math.PI*2,
    spd: 0.05 + Math.random()*0.12,
  }));

  function drawStars(dt) {
    STARS.forEach(s => {
      s.x -= s.spd;
      if(s.x < 0) { s.x = W; s.y = Math.random()*(H*0.82); }
      s.twinkle += dt * (1.5 + Math.random()*0.5);
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
      ctx.save();
      ctx.globalAlpha = alpha;
      if(s.bright > 0.85) {
        // 4-point star
        ctx.fillStyle = C.white;
        ctx.fillRect(s.x|0, (s.y-2)|0, 1, 5);
        ctx.fillRect((s.x-2)|0, s.y|0, 5, 1);
        ctx.fillRect(s.x|0, s.y|0, 1, 1);
      } else if(s.size > 0.6) {
        ctx.fillStyle = C.white;
        ctx.fillRect(s.x|0, s.y|0, 2, 2);
      } else {
        ctx.fillStyle = C.white;
        ctx.fillRect(s.x|0, s.y|0, 1, 1);
      }
      ctx.restore();
    });
  }

  // ── SUN ───────────────────────────────────────────────────
  function drawSun(t) {
    const x = W*0.80, y = H*0.22, r = 28;
    ctx.save();
    // Rays
    ctx.strokeStyle = C.white; ctx.lineWidth = 1.5;
    for(let i=0;i<12;i++){
      const a = (i/12)*Math.PI*2 + t*0.4;
      const r1=r+5, r2=r+(i%2===0?14:9);
      ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1);
      ctx.lineTo(x+Math.cos(a)*r2,y+Math.sin(a)*r2);ctx.stroke();
    }
    // Circle
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=C.bg; ctx.fill();
    ctx.strokeStyle=C.white; ctx.lineWidth=2; ctx.stroke();
    // Dither inside
    ctx.fillStyle=C.white;
    for(let dy=-r;dy<r;dy+=3) for(let dx=-r;dx<r;dx+=3)
      if(dx*dx+dy*dy < r*r-6) {
        const d=Math.sqrt(dx*dx+dy*dy)/r;
        if(Math.random()<(1-d)*0.45) ctx.fillRect((x+dx)|0,(y+dy)|0,2,2);
      }
    ctx.restore();
  }

  // ── CITY ──────────────────────────────────────────────────
  let scroll = 0;
  const BLDGS = [];
  for(let i=0;i<20;i++){
    const bx=i*60+Math.random()*20;
    const bh=28+Math.random()*78; const bw=20+Math.random()*30;
    const wins=[];
    for(let wy=5;wy<bh-8;wy+=11)
      for(let wx=4;wx<bw-4;wx+=9)
        wins.push({ox:wx,oy:wy,lit:Math.random()>0.44,t:Math.random()*140});
    BLDGS.push({x:bx,h:bh|0,w:bw|0,wins});
  }
  const WORLD_W = 20*64+80;

  function drawCity() {
    const ground = H-26;
    ctx.fillStyle=C.white; ctx.fillRect(0,ground,W,1);
    // Ground dither
    ctx.fillStyle=C.white;
    for(let dy=0;dy<8;dy++) for(let dx=0;dx<W;dx+=3)
      if(Math.random()<(0.30-dy*0.035)) ctx.fillRect(dx,ground+1+dy,1,1);

    BLDGS.forEach(b=>{
      const bx=((b.x-scroll*0.42)%WORLD_W+WORLD_W)%WORLD_W-10;
      if(bx>W+50||bx<-b.w-10)return;
      const by=ground-b.h;
      ctx.fillStyle=C.bg; ctx.fillRect(bx,by,b.w,b.h);
      // Outline
      ctx.fillStyle=C.white;
      ctx.fillRect(bx,by,b.w,1); ctx.fillRect(bx,by,1,b.h); ctx.fillRect(bx+b.w-1,by,1,b.h);
      // Antenna
      if(b.h>52){ ctx.fillRect((bx+b.w/2-1)|0,by-8,2,8); ctx.fillRect((bx+b.w/2-3)|0,by-9,6,2);}
      // Windows
      b.wins.forEach(w=>{
        w.t--;if(w.t<=0){w.lit=Math.random()>0.4;w.t=55+Math.random()*160;}
        if(!w.lit)return;
        ctx.fillStyle=C.white;
        ctx.fillRect((bx+w.ox)|0,(by+w.oy)|0,3,3);
        ctx.fillStyle=C.bg; ctx.fillRect((bx+w.ox+1)|0,(by+w.oy+1)|0,1,1);
      });
    });
  }

  // ── SIGNAL PACKETS (amber ⊕ like reference) ───────────────
  const PKTS = Array.from({length:5},(_,i)=>({
    wx:70+i*90, wy:28+Math.sin(i*1.6)*35,
    t:i*0.9, alive:true, respawn:0,
  }));
  const SPARKS=[];

  function emitSparks(x,y){
    for(let i=0;i<12;i++){
      const a=Math.random()*Math.PI*2, s=25+Math.random()*60;
      SPARKS.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1});
    }
  }

  function drawPackets(dt){
    PKTS.forEach(p=>{
      p.t+=dt*3;
      if(!p.alive){
        if(frame>p.respawn){p.wx=scroll*0.78+80+Math.random()*140;p.wy=22+Math.random()*70;p.alive=true;}
        return;
      }
      const sx=((p.wx-scroll*0.78)%W+W)%W;
      const sy=p.wy+Math.sin(p.t)*5;
      const pulse=0.55+0.45*Math.sin(p.t);
      const s=Math.round(8*pulse);
      ctx.save(); ctx.globalAlpha=pulse;
      // Outer square
      ctx.strokeStyle=C.amber; ctx.lineWidth=2;
      ctx.strokeRect((sx-s)|0,(sy-s)|0,s*2,s*2);
      // Inner cross
      ctx.fillStyle=C.amber;
      ctx.fillRect((sx-1)|0,(sy-s+2)|0,2,s*2-4);
      ctx.fillRect((sx-s+2)|0,(sy-1)|0,s*2-4,2);
      // Corner dots
      ctx.fillRect((sx-s+1)|0,(sy-s+1)|0,2,2);
      ctx.fillRect((sx+s-3)|0,(sy-s+1)|0,2,2);
      ctx.fillRect((sx-s+1)|0,(sy+s-3)|0,2,2);
      ctx.fillRect((sx+s-3)|0,(sy+s-3)|0,2,2);
      ctx.restore();

      const dx=sx-HERO.x, dy2=sy-(HERO.y+HERO.bob);
      if(Math.abs(dx)<22&&Math.abs(dy2)<22){
        p.alive=false; p.respawn=frame+200; signals++;
        emitSparks(sx,sy);
        const el=document.getElementById('hero-signal-count');
        if(el) el.textContent='SIGNALS: '+signals;
      }
    });
  }

  function drawSparks(dt){
    for(let i=SPARKS.length-1;i>=0;i--){
      const s=SPARKS[i];
      s.x+=s.vx*dt; s.y+=s.vy*dt; s.vx*=0.88; s.vy*=0.88; s.life-=dt*2.5;
      if(s.life<=0){SPARKS.splice(i,1);continue;}
      ctx.save(); ctx.globalAlpha=s.life*0.9; ctx.fillStyle=C.amber;
      ctx.fillRect(s.x|0,s.y|0,2,2); ctx.restore();
    }
  }

  // ── LIGHT ORB — the signal, the idea, the energy ────────────
  // A glowing orb floating through the scene.
  // Represents: a signal traveling through noise.
  // Same construction style as the sun — rings, rays, dither.

  const HERO = { x: W*0.48, y: H*0.42, bob:0, bobDir:1 };

  function drawHero(dt) {
    HERO.bob += HERO.bobDir * dt * 18;
    if(HERO.bob >  7) HERO.bobDir = -1;
    if(HERO.bob < -7) HERO.bobDir =  1;

    const ox = HERO.x, oy = HERO.y + HERO.bob;
    const t  = frame * 0.022;
    const breathe = 1 + 0.08 * Math.sin(frame * 0.045);

    // ── OUTER GLOW RINGS (fade out, like light diffusing) ──
    [28, 22, 17].forEach((r, i) => {
      const alpha = [0.08, 0.14, 0.22][i];
      ctx.save();
      ctx.globalAlpha = alpha * (0.7 + 0.3 * Math.sin(frame*0.04 + i));
      ctx.strokeStyle = C.white;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.arc(ox, oy, r * breathe, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // ── LIGHT RAYS — 8 rays rotating slowly outward ──
    ctx.save();
    ctx.strokeStyle = C.white;
    for(let i = 0; i < 8; i++) {
      const a  = (i / 8) * Math.PI * 2 + t * 0.6;
      const r1 = 13 * breathe;
      const r2 = r1 + (i % 2 === 0 ? 14 : 9);
      const alpha = 0.5 + 0.5 * Math.sin(frame * 0.05 + i);
      ctx.globalAlpha = alpha;
      ctx.lineWidth   = i % 2 === 0 ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(ox + Math.cos(a) * r1, oy + Math.sin(a) * r1);
      ctx.lineTo(ox + Math.cos(a) * r2, oy + Math.sin(a) * r2);
      ctx.stroke();
    }
    ctx.restore();

    // ── MAIN CIRCLE — solid black fill, white border ──
    ctx.save();
    ctx.fillStyle   = C.bg;
    ctx.strokeStyle = C.white;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(ox, oy, 12 * breathe, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // ── DITHER FILL inside (same as sun) ──
    const r = 11;
    ctx.fillStyle = C.white;
    for(let dy = -r; dy < r; dy += 3)
      for(let dx = -r; dx < r; dx += 3)
        if(dx*dx + dy*dy < r*r - 4) {
          const d = Math.sqrt(dx*dx + dy*dy) / r;
          if(Math.random() < (1 - d) * 0.55)
            ctx.fillRect((ox+dx)|0, (oy+dy)|0, 2, 2);
        }

    // ── AMBER INNER CORE — the hottest point ──
    ctx.save();
    ctx.fillStyle   = C.amber;
    ctx.strokeStyle = C.amber;
    ctx.lineWidth   = 1;
    // Core circle
    ctx.beginPath();
    ctx.arc(ox, oy, 4 * breathe, 0, Math.PI * 2);
    ctx.fill();
    // Amber pulse ring
    const pulsR = 6 + 3 * Math.abs(Math.sin(frame * 0.07));
    ctx.globalAlpha = 0.6 * (1 - (pulsR - 6) / 3);
    ctx.beginPath();
    ctx.arc(ox, oy, pulsR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // ── LIGHT TRAIL — soft streak left behind as it floats ──
    ctx.save();
    for(let i = 1; i <= 10; i++) {
      const tx2 = ox + i * 5;
      const ty2 = oy + Math.sin((frame - i*2) * 0.045) * 7;
      ctx.globalAlpha = (0.10 - i * 0.009);
      ctx.fillStyle   = C.white;
      ctx.beginPath();
      ctx.arc(tx2, ty2, (3 - i * 0.22), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ── HUD ───────────────────────────────────────────────────
  function drawHUD() {
    ctx.fillStyle=C.bg; ctx.fillRect(0,H-22,W,22);
    ctx.fillStyle=C.white; ctx.fillRect(0,H-23,W,1);
    // left dot
    ctx.fillStyle=C.white;
    ctx.beginPath(); ctx.arc(12,H-11,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=C.bg; ctx.beginPath(); ctx.arc(12,H-11,2,0,Math.PI*2); ctx.fill();
    ctx.font='bold 9px monospace'; ctx.letterSpacing='2px';
    ctx.fillStyle=C.white; ctx.textAlign='left';
    ctx.fillText('RE / DATA OPS ACTIVE',22,H-8);
    ctx.textAlign='right'; ctx.fillStyle=C.amber;
    ctx.fillText('SIGNALS:'+signals,W-8,H-8);
    ctx.textAlign='left'; ctx.letterSpacing='0';
  }

  // ── MAIN LOOP ─────────────────────────────────────────────
  function loop(ts) {
    const dt = Math.min((ts-lastTs)/1000, 0.05);
    lastTs=ts; frame++;
    scroll += 48*dt;

    ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
    grid();

    // Corner dither
    for(let x=0;x<W*0.14;x+=3) for(let y=0;y<H-22;y+=3)
      if(Math.random()<(1-x/(W*0.14))*0.42){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}
    for(let x=W*0.86;x<W;x+=3) for(let y=0;y<H-22;y+=3)
      if(Math.random()<((x-W*0.86)/(W*0.14))*0.42){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}

    drawStars(dt);
    drawSun(frame*0.015);
    drawCity();
    drawPackets(dt);
    drawSparks(dt);
    drawHero(dt);
    drawHUD();
    scanlines();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();