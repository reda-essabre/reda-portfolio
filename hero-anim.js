/* ============================================================
   HERO-ANIM.JS — Animated intro scene
   EXACT same style as game.js: fillRect pixel art, 1-bit,
   amber + white, grid + scanlines, dither helpers
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const W = 480, H = 300;
  canvas.width  = W;
  canvas.height = H;

  const TILE = 20;
  const C = { bg:'#000000', white:'#ffffff', amber:'#d4a843' };

  let frame = 0, lastTs = 0;
  let signals = 0;

  // ── HELPERS (identical to game.js) ───────────────────────
  function scanlines() {
    for(let y=0;y<H;y+=4){ctx.fillStyle='rgba(0,0,0,0.12)';ctx.fillRect(0,y,W,2);}
    for(let i=0;i<12;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.025})`;ctx.fillRect(Math.random()*W|0,Math.random()*H|0,1,1);}
  }

  function grid() {
    ctx.save();
    ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
    for(let x=0;x<W;x+=TILE){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=TILE){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.restore();
  }

  function dither(x,y,w,h,density) {
    ctx.save();ctx.fillStyle=C.white;
    for(let dy=y;dy<y+h;dy+=3)for(let dx=x;dx<x+w;dx+=3)
      if(Math.random()<density)ctx.fillRect(dx|0,dy|0,1,1);
    ctx.restore();
  }

  function drawSun(x,y,r,t) {
    ctx.save();
    ctx.strokeStyle=C.white;ctx.lineWidth=2;
    for(let i=0;i<12;i++){
      const a=(i/12)*Math.PI*2+t*0.5;
      const r1=r+4,r2=r+(i%2===0?12:8);
      ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1);
      ctx.lineTo(x+Math.cos(a)*r2,y+Math.sin(a)*r2);ctx.stroke();
    }
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=C.bg;ctx.fill();ctx.strokeStyle=C.white;ctx.stroke();
    for(let dy=-r;dy<r;dy+=3)for(let dx=-r;dx<r;dx+=3)
      if(dx*dx+dy*dy<r*r-4){const d=Math.sqrt(dx*dx+dy*dy)/r;if(Math.random()<(1-d)*0.5){ctx.fillStyle=C.white;ctx.fillRect((x+dx)|0,(y+dy)|0,2,2);}}
    ctx.restore();
  }

  // ── SCROLLING WORLD ───────────────────────────────────────
  let scroll = 0;

  // Buildings
  const BLDGS = [];
  for(let i=0;i<18;i++){
    const bx = i*62 + Math.random()*20;
    const bh = 28+Math.random()*70;
    const bw = 20+Math.random()*28;
    const wins = [];
    for(let wy=H-bh;wy<H-20;wy+=10)
      for(let wx=bx+4;wx<bx+bw-4;wx+=8)
        wins.push({ox:wx-bx, oy:wy-(H-bh), lit:Math.random()>0.4, t:Math.random()*120});
    BLDGS.push({x:bx, h:bh|0, w:bw|0, wins});
  }
  const WORLD_W = 18*65 + 80;

  function drawCity() {
    const ground = H-28;
    // Ground line + dither fill
    ctx.fillStyle=C.white;
    ctx.fillRect(0,ground,W,1);
    dither(0,ground+1,W,H-ground-1,0.25);

    BLDGS.forEach(b=>{
      const bx = ((b.x - scroll*0.5) % WORLD_W + WORLD_W) % WORLD_W - 10;
      if(bx>W+50||bx<-b.w-10)return;
      const by = ground - b.h;
      // solid black building
      ctx.fillStyle=C.bg;ctx.fillRect(bx,by,b.w,b.h);
      // outline
      ctx.fillStyle=C.white;
      ctx.fillRect(bx,by,b.w,1);       // top
      ctx.fillRect(bx,by,1,b.h);       // left
      ctx.fillRect(bx+b.w-1,by,1,b.h); // right
      // windows
      b.wins.forEach(w=>{
        w.t--;if(w.t<=0){w.lit=Math.random()>0.38;w.t=50+Math.random()*150;}
        if(!w.lit)return;
        const wx=bx+w.ox, wy=by+w.oy;
        ctx.fillStyle=C.white;ctx.fillRect(wx|0,wy|0,3,3);
        ctx.fillStyle=C.bg;ctx.fillRect((wx+1)|0,(wy+1)|0,1,1);
      });
      // antenna on tall buildings
      if(b.h>55){ctx.fillStyle=C.white;ctx.fillRect((bx+b.w/2-1)|0,by-8,2,8);}
    });
  }

  // ── PACKETS (floating signals to collect) ─────────────────
  const PKTS = Array.from({length:5},(,i)=>({
    wx: 60+i*88, // world x
    wy: 60+Math.sin(i*1.4)*30,
    t:  i*0.7,
    alive: true,
    respawn: 0,
  }));

  const SPARKS = [];
  function emitSparks(x,y) {
    for(let i=0;i<10;i++){
      const a=Math.random()*Math.PI*2,s=30+Math.random()*60;
      SPARKS.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1});
    }
  }

  function drawPackets(dt) {
    PKTS.forEach(p=>{
      p.t+=dt*3;
      if(!p.alive){
        if(frame>p.respawn){p.wx=HERO.wx+100+Math.random()*120;p.wy=35+Math.random()*60;p.alive=true;}
        return;
      }
      const sx=((p.wx-scroll*0.88)%W+W)%W;
      const sy=p.wy+Math.sin(p.t)*5;
      const pulse=0.6+0.4*Math.sin(p.t);
      const s=Math.round(7*pulse);
      ctx.save();
      ctx.strokeStyle=C.amber;ctx.lineWidth=2;ctx.globalAlpha=pulse;
      ctx.strokeRect((sx-s)|0,(sy-s)|0,s*2,s*2);
      ctx.fillStyle=C.amber;
      ctx.fillRect((sx-1)|0,(sy-4)|0,2,8);ctx.fillRect((sx-4)|0,(sy-1)|0,8,2);
      ctx.fillRect((sx-s+1)|0,(sy-s+1)|0,2,2);ctx.fillRect((sx+s-3)|0,(sy-s+1)|0,2,2);
      ctx.restore();

      // collect check
      const dx=sx-HERO.x, dy2=sy-(HERO.y+HERO.bob);
      if(Math.abs(dx)<16&&Math.abs(dy2)<16){
        p.alive=false;p.respawn=frame+200;
        signals++;
        emitSparks(sx,sy);
        const el=document.getElementById('hero-signal-count');
        if(el)el.textContent='SIGNALS: '+signals;
      }
    });
  }

  function drawSparks(dt) {
    for(let i=SPARKS.length-1;i>=0;i--){
      const s=SPARKS[i];
      s.x+=s.vx*dt;s.y+=s.vy*dt;s.vx*=0.88;s.vy*=0.88;s.life-=dt*2.5;
      if(s.life<=0){SPARKS.splice(i,1);continue;}
      ctx.save();ctx.globalAlpha=s.life*0.9;ctx.fillStyle=C.amber;
      ctx.fillRect(s.x|0,s.y|0,2,2);ctx.restore();
    }
  }

  // ── HERO CHARACTER ────────────────────────────────────────
  // Same pixel-block style as game.js drawPlayer, but bigger+cooler
  const HERO = {
    x: W*0.32, y: H*0.50,
    bob:0, bobDir:1,
    trail: [],
    wx: 0, // world x for packet collision
  };

  function drawHero(dt) {
    HERO.bob += HERO.bobDir * dt * 28;
    if(HERO.bob> 5){HERO.bobDir=-1;}
    if(HERO.bob<-5){HERO.bobDir= 1;}

    const px = HERO.x|0;
    const py = (HERO.y+HERO.bob)|0;

    // Trail
    if(frame%2===0){
      HERO.trail.push({x:px,y:py,l:1});
      if(HERO.trail.length>12)HERO.trail.shift();
    }
    HERO.trail.forEach(t=>{
      t.l-=dt*3;
      if(t.l<=0)return;
      ctx.save();ctx.globalAlpha=t.l*0.25;ctx.fillStyle=C.white;
      ctx.fillRect(t.x-7,t.y-12,14,24);ctx.restore();
    });

    ctx.save();

    // BODY DITHER glow
    dither(px-16,py-20,32,40,0.18);

    // ── CLOAK / CAPE (behind body) ──
    // Cape billows left (going right) — animated wave
    const capeWave = Math.sin(frame*0.08)*6;
    ctx.fillStyle=C.white;
    // Cape shape — 3 layers
    ctx.fillRect(px-16,py-4,5,18);  // left hang
    ctx.fillRect(px-20,py+2,6,12);  // outer drape
    // Cape bottom fringe animated
    for(let i=0;i<4;i++){
      const fy=py+14+Math.sin(frame*0.06+i)*3;
      ctx.fillRect(px-19+i*2,fy|0,2,4);
    }
    // cape inner shadow cutout
    ctx.fillStyle=C.bg;
    ctx.fillRect(px-18,py-2,3,14);

    // ── LEGS ──
    ctx.fillStyle=C.white;
    // walk cycle
    const walk = Math.sin(frame*0.10);
    ctx.fillRect(px-6, py+12+(walk>0?2:0), 5, 8+(walk>0?1:0));
    ctx.fillRect(px+1,  py+12+(walk<0?2:0), 5, 8+(walk<0?1:0));
    // boots
    ctx.fillRect(px-7, py+19+(walk>0?2:0), 6, 4);
    ctx.fillRect(px+1,  py+19+(walk<0?2:0), 6, 4);

    // ── BODY / JACKET ──
    ctx.fillStyle=C.white;
    ctx.fillRect(px-8, py-6, 16, 19);
    // jacket detail lines
    ctx.fillStyle=C.bg;
    ctx.fillRect(px-1, py-5, 2, 14); // center seam
    ctx.fillRect(px-7, py+2, 2, 8);  // left pocket
    ctx.fillRect(px+5,  py+2, 2, 8);  // right pocket

    // ── SUN SIGIL on chest ──
    const rot=frame*0.03;
    ctx.strokeStyle=C.amber;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(px,py+4,4,0,Math.PI*2);
    ctx.fillStyle=C.amber;ctx.fill();
    ctx.fillStyle=C.bg;ctx.fillRect(px-1,py+2,2,4);ctx.fillRect(px-2,py+3,4,2);
    // rays
    for(let i=0;i<6;i++){
      const a=i/6*Math.PI*2+rot;
      ctx.strokeStyle=C.amber;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(px+Math.cos(a)*5,py+4+Math.sin(a)*5);
      ctx.lineTo(px+Math.cos(a)*7,py+4+Math.sin(a)*7);ctx.stroke();
    }

    // ── SHOULDERS (armor pads) ──
    ctx.fillStyle=C.white;
    ctx.fillRect(px-11,py-6,5,7);   // left pad
    ctx.fillRect(px+6,  py-6,5,7);   // right pad
    ctx.fillStyle=C.bg;
    ctx.fillRect(px-11,py-5,2,2);   // left detail
    ctx.fillRect(px+9,  py-5,2,2);   // right detail

    // ── HEAD ──
    ctx.fillStyle=C.white;
    ctx.fillRect(px-6,py-18,12,12); // head block

    // ── HOOD ──
    ctx.fillRect(px-8, py-22, 16, 8);  // hood brim
    ctx.fillRect(px-7, py-28, 14, 8);  // hood upper
    ctx.fillRect(px-5, py-32, 10, 6);  // hood peak
    // hood shadow inside
    ctx.fillStyle=C.bg;
    ctx.fillRect(px-4, py-20, 8, 8);   // face shadow

    // ── HELMET BAND ──
    ctx.fillStyle=C.amber;
    ctx.fillRect(px-8, py-24, 16, 2);  // amber band on hood
    // indicator dot
    ctx.fillRect(px-1, py-25, 3, 2);

    // ── EYE (single glowing amber) ──
    ctx.fillStyle=C.amber;
    ctx.fillRect(px-3,py-18,3,2);  // left eye glow
    // flicker
    if(frame%40<35){
      ctx.fillRect(px-4,py-19,5,3);
      ctx.fillStyle=C.white;
      ctx.fillRect(px-3,py-18,2,1); // glint
    }

    // ── ARM + HAND (right, raising signal) ──
    const armRaise = Math.sin(frame*0.07)*8;
    // arm
    ctx.fillStyle=C.white;
    ctx.fillRect(px+8, py-4+(armRaise*0.4)|0, 4, 12-Math.abs(armRaise*0.3)|0);
    // hand raised
    ctx.fillRect(px+8, py-8+armRaise|0, 6, 6);
    // signal emitting from hand
    if(frame%20<10){
      ctx.fillStyle=C.amber;
      ctx.fillRect(px+10, py-14+armRaise|0, 2, 4);
      ctx.fillRect(px+8,  py-12+armRaise|0, 6, 1);
    }

    // ── LEFT ARM (down, holding data) ──
    ctx.fillStyle=C.white;
    ctx.fillRect(px-12,py-4,4,10);
    ctx.fillRect(px-13,py+5,5,5); // hand
    // data cube in hand
    ctx.strokeStyle=C.amber;ctx.lineWidth=1.5;
    ctx.strokeRect(px-14,py+9,5,5);
    ctx.fillStyle=C.amber;ctx.fillRect(px-13,py+10,3,3);
    ctx.fillStyle=C.bg;ctx.fillRect(px-12,py+11,1,1);

    ctx.restore();
  }

  // ── FLOATING DATA PARTICLES ───────────────────────────────
  const BITS = Array.from({length:18},()=>({
    x:Math.random()*W, y:Math.random()*(H*0.75),
    spd:0.2+Math.random()*0.4,
    phase:Math.random()*Math.PI*2,
    ch:Math.random()>0.5?'0':'1',
    t:Math.random()*60,
  }));

  function drawBits(dt) {
    ctx.font='7px monospace';
    BITS.forEach(b=>{
      b.x-=b.spd;b.t+=dt*2;
      if(b.x<-10)b.x=W+10;
      const alpha=0.25+0.20*Math.sin(b.t+b.phase);
      ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=C.white;
      ctx.fillText(b.ch,b.x|0,(b.y+Math.sin(b.t+b.phase)*4)|0);
      ctx.restore();
    });
  }

  // ── STATUS BAR ────────────────────────────────────────────
  function drawHUD() {
    // Bottom bar background
    ctx.fillStyle=C.bg;
    ctx.fillRect(0,H-22,W,22);
    ctx.fillStyle=C.white;
    ctx.fillRect(0,H-23,W,1); // top border of bar

    ctx.font='bold 9px monospace';ctx.letterSpacing='2px';
    ctx.fillStyle=C.white;ctx.textAlign='left';
    ctx.fillText('☀ RE / DATA OPS ACTIVE',8,H-8);

    ctx.textAlign='right';
    ctx.fillStyle=C.amber;
    ctx.fillText('SIGNALS: '+signals,W-8,H-8);

    ctx.textAlign='left';
  }

  // ── MAIN LOOP ─────────────────────────────────────────────
  function loop(ts) {
    const dt = Math.min((ts-lastTs)/1000, 0.05);
    lastTs=ts;
    frame++;

    // Scroll world
    scroll += 55*dt;
    HERO.wx = scroll*0.88;

    // Clear
    ctx.fillStyle=C.bg;
    ctx.fillRect(0,0,W,H);

    // Grid
    grid();

    // Dither corners (same as game title screen)
    for(let x=0;x<W*0.18;x+=3)for(let y=0;y<H-22;y+=3)
      if(Math.random()<(1-x/(W*0.18))*0.5){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}
    for(let x=W*0.82;x<W;x+=3)for(let y=0;y<H-22;y+=3)
      if(Math.random()<((x-W*0.82)/(W*0.18))*0.5){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}

    // Sun in sky (same drawSun from game)
    drawSun(W*0.72, H*0.25, 22+Math.sin(frame*0.02)*2, frame*0.016);

    // City
    drawCity();

    // Packets
    drawPackets(dt);
    drawSparks(dt);

    // Floating bits
    drawBits(dt);

    // HERO
    drawHero(dt);

    // HUD bar
    drawHUD();

    // Scanlines
    scanlines();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
