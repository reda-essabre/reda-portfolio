/* ============================================================
   HERO-ANIM.JS — Flying Pixel Superhero Scene
   Style: Image 2 pixel art (white+amber blocks like game.js)
   Pose: Image 1 flying diagonal toward viewer, cape flowing
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const W = 480, H = 300;
  canvas.width  = W;
  canvas.height = H;

  const TILE = 20;
  const C = { bg:'#000000', white:'#ffffff', amber:'#d4a843', gray:'#555555' };

  let frame = 0, lastTs = 0, signals = 0;

  // ── HELPERS ───────────────────────────────────────────────
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
    for(let dy=0;dy<h;dy+=3)for(let dx=0;dx<w;dx+=3)
      if(Math.random()<density)ctx.fillRect((x+dx)|0,(y+dy)|0,1,1);
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

  // ── SCROLLING CITY ────────────────────────────────────────
  let scroll = 0;
  const BLDGS = [];
  for(let i=0;i<22;i++){
    const bx=i*58+Math.random()*18;
    const bh=30+Math.random()*75;
    const bw=18+Math.random()*26;
    const wins=[];
    for(let wy=4;wy<bh-8;wy+=10)
      for(let wx=4;wx<bw-4;wx+=8)
        wins.push({ox:wx,oy:wy,lit:Math.random()>0.42,t:Math.random()*120});
    BLDGS.push({x:bx,h:bh|0,w:bw|0,wins});
  }
  const WORLD_W = 22*62+80;

  function drawCity() {
    const ground=H-26;
    ctx.fillStyle=C.white;ctx.fillRect(0,ground,W,1);
    dither(0,ground+1,W,H-ground-1,0.22);

    BLDGS.forEach(b=>{
      const bx=((b.x-scroll*0.45)%WORLD_W+WORLD_W)%WORLD_W-10;
      if(bx>W+50||bx<-b.w-10)return;
      const by=ground-b.h;
      ctx.fillStyle=C.bg;ctx.fillRect(bx,by,b.w,b.h);
      ctx.fillStyle=C.white;
      ctx.fillRect(bx,by,b.w,1);
      ctx.fillRect(bx,by,1,b.h);
      ctx.fillRect(bx+b.w-1,by,1,b.h);
      b.wins.forEach(w=>{
        w.t--;if(w.t<=0){w.lit=Math.random()>0.38;w.t=60+Math.random()*160;}
        if(!w.lit)return;
        const wx2=bx+w.ox,wy2=by+w.oy;
        ctx.fillStyle=C.white;ctx.fillRect(wx2|0,wy2|0,3,3);
        ctx.fillStyle=C.bg;ctx.fillRect((wx2+1)|0,(wy2+1)|0,1,1);
      });
      if(b.h>50){ctx.fillStyle=C.white;ctx.fillRect((bx+b.w/2-1)|0,by-7,2,7);}
    });
  }

  // ── SIGNAL PACKETS ────────────────────────────────────────
  const PKTS = Array.from({length:5},(_,i)=>({
    wx:80+i*82, wy:45+Math.sin(i*1.5)*28,
    t:i*0.8, alive:true, respawn:0,
  }));
  const SPARKS=[];

  function emitSparks(x,y){
    for(let i=0;i<12;i++){
      const a=Math.random()*Math.PI*2,s=28+Math.random()*55;
      SPARKS.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1});
    }
  }

  function drawPackets(dt){
    PKTS.forEach(p=>{
      p.t+=dt*3;
      if(!p.alive){
        if(frame>p.respawn){p.wx=scroll*0.82+90+Math.random()*130;p.wy=30+Math.random()*60;p.alive=true;}
        return;
      }
      const sx=((p.wx-scroll*0.82)%W+W)%W;
      const sy=p.wy+Math.sin(p.t)*5;
      const pulse=0.55+0.45*Math.sin(p.t);
      const s=Math.round(7*pulse);
      ctx.save();ctx.strokeStyle=C.amber;ctx.lineWidth=2;ctx.globalAlpha=pulse;
      ctx.strokeRect((sx-s)|0,(sy-s)|0,s*2,s*2);
      ctx.fillStyle=C.amber;
      ctx.fillRect((sx-1)|0,(sy-4)|0,2,8);ctx.fillRect((sx-4)|0,(sy-1)|0,8,2);
      ctx.fillRect((sx-s+1)|0,(sy-s+1)|0,2,2);ctx.fillRect((sx+s-3)|0,(sy-s+1)|0,2,2);
      ctx.restore();

      // collect: hero is at roughly (HERO.x, HERO.y)
      const hx=HERO.x,hy=HERO.y+HERO.bob;
      if(Math.abs(sx-hx)<22&&Math.abs(sy-hy)<22){
        p.alive=false;p.respawn=frame+220;
        signals++;emitSparks(sx,sy);
        const el=document.getElementById('hero-signal-count');
        if(el)el.textContent='SIGNALS: '+signals;
      }
    });
  }

  function drawSparks(dt){
    for(let i=SPARKS.length-1;i>=0;i--){
      const s=SPARKS[i];
      s.x+=s.vx*dt;s.y+=s.vy*dt;s.vx*=0.88;s.vy*=0.88;s.life-=dt*2.8;
      if(s.life<=0){SPARKS.splice(i,1);continue;}
      ctx.save();ctx.globalAlpha=s.life*0.9;ctx.fillStyle=C.amber;
      ctx.fillRect(s.x|0,s.y|0,2,2);ctx.restore();
    }
  }

  // ── FLYING PIXEL SUPERHERO ────────────────────────────────
  // Pose: diagonal flying like image 1 — body tilted ~30deg,
  // one arm stretched forward, cape streaming behind
  // Style: pixel blocks like image 2 — white body, amber accents

  const HERO = { x:W*0.38, y:H*0.42, bob:0, bobDir:1, trail:[] };

  // Each pixel block: [dx, dy, w, h, color]
  // Coordinate origin = hero center, tilted flying pose
  // Body tilted left-up to right-down (flying toward viewer-right)

  function drawHero(dt){
    HERO.bob += HERO.bobDir*dt*22;
    if(HERO.bob> 6)HERO.bobDir=-1;
    if(HERO.bob<-6)HERO.bobDir= 1;

    const px=HERO.x|0;
    const py=(HERO.y+HERO.bob)|0;

    // ── TRAIL ──
    if(frame%2===0){
      HERO.trail.push({x:px,y:py,l:1});
      if(HERO.trail.length>14)HERO.trail.shift();
    }
    HERO.trail.forEach(t=>{
      t.l-=dt*3;
      if(t.l<=0)return;
      ctx.save();ctx.globalAlpha=t.l*0.18;ctx.fillStyle=C.white;
      // trail is a tilted streak
      ctx.fillRect(t.x+4,t.y-2,12,6);
      ctx.restore();
    });

    // motion lines ahead of hero
    ctx.save();ctx.strokeStyle=C.white;ctx.lineWidth=1;
    for(let i=0;i<4;i++){
      const lx=px-32-i*14, ly=py-8+i*6;
      ctx.globalAlpha=0.12+i*0.06;
      ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+22,ly-4);ctx.stroke();
    }
    ctx.restore();

    ctx.save();

    // ── CAPE (behind body, streaming back-right) ──
    // Cape as several layered rectangles fanning right
    const capeFlap=Math.sin(frame*0.07)*4;
    ctx.fillStyle=C.white;
    // Cape main body — angled blocks streaming to the right
    ctx.fillRect(px+4,  py-10, 18, 5);   // top cape
    ctx.fillRect(px+8,  py-6,  22, 5);   // mid cape
    ctx.fillRect(px+12, py-2,  20, 4);   // lower cape
    ctx.fillRect(px+14, py+2,  16, 4+capeFlap|0);  // bottom flap
    ctx.fillRect(px+18, py+5,  10, 3+capeFlap|0);
    // Cape inner shadow
    ctx.fillStyle=C.bg;
    ctx.fillRect(px+6,  py-9,  14, 3);
    ctx.fillRect(px+10, py-5,  16, 3);
    ctx.fillRect(px+14, py-1,  12, 3);
    // Cape amber trim
    ctx.fillStyle=C.amber;
    ctx.fillRect(px+4,  py-11, 18, 1);  // top trim
    ctx.fillRect(px+22, py-6,   2,  14+capeFlap|0); // right edge

    // ── BODY (torso, tilted) ──
    ctx.fillStyle=C.white;
    ctx.fillRect(px-10, py-8,  14, 16); // torso block

    // body suit lines
    ctx.fillStyle=C.bg;
    ctx.fillRect(px-9, py-2,  12, 1);  // belt line
    ctx.fillRect(px-4, py-7,   2, 6);  // center chest seam

    // ── SUN EMBLEM on chest ──
    ctx.fillStyle=C.amber;
    ctx.fillRect(px-6, py-7,  8, 8);   // emblem bg square
    ctx.fillStyle=C.bg;
    ctx.fillRect(px-5, py-6,  6, 6);   // cut inside
    ctx.fillStyle=C.amber;
    ctx.fillRect(px-4, py-5,  4, 4);   // inner fill
    ctx.fillStyle=C.bg;
    ctx.fillRect(px-3, py-4,  2, 2);   // center cut
    // animated sun rays on emblem
    const rot2=frame*0.06;
    ctx.fillStyle=C.amber;
    for(let i=0;i<4;i++){
      const a=(i/4)*Math.PI*2+rot2;
      ctx.fillRect((px-2+Math.cos(a)*5)|0,(py-3+Math.sin(a)*5)|0,2,2);
    }

    // ── BELT ──
    ctx.fillStyle=C.amber;
    ctx.fillRect(px-11,py-1, 16, 4);   // belt strap
    ctx.fillStyle=C.white;
    ctx.fillRect(px-4, py,    4, 3);   // belt buckle
    ctx.fillStyle=C.bg;
    ctx.fillRect(px-3, py+1,  2, 1);   // buckle detail

    // ── LEGS (angled — flying horizontal, legs back-right) ──
    ctx.fillStyle=C.white;
    // Left leg goes back (upper)
    ctx.fillRect(px-6,  py+8,  5, 8);
    ctx.fillRect(px-4,  py+16, 4, 5);  // left boot
    // Right leg tucked slightly higher
    ctx.fillRect(px-1,  py+6,  5, 7);
    ctx.fillRect(px+1,  py+13, 4, 5);  // right boot
    // Boot tops amber stripe
    ctx.fillStyle=C.amber;
    ctx.fillRect(px-6,  py+14, 5, 2);
    ctx.fillRect(px-1,  py+12, 5, 2);

    // ── OUTSTRETCHED ARM (left, forward toward viewer) ──
    ctx.fillStyle=C.white;
    ctx.fillRect(px-26, py-6, 16, 6);   // upper arm
    ctx.fillRect(px-34, py-5,  9, 5);   // forearm
    // Gauntlet
    ctx.fillRect(px-38, py-6,  6, 7);
    ctx.fillStyle=C.amber;
    ctx.fillRect(px-37, py-7,  5, 2);   // gauntlet top band
    ctx.fillRect(px-37, py-1,  5, 2);   // gauntlet bottom band
    // FIST (reaching forward)
    ctx.fillStyle=C.white;
    ctx.fillRect(px-44, py-5,  8, 7);   // fist block
    ctx.fillStyle=C.bg;
    ctx.fillRect(px-43, py-4,  2, 2);   // knuckle 1
    ctx.fillRect(px-40, py-4,  2, 2);   // knuckle 2
    ctx.fillRect(px-37, py-4,  2, 2);   // knuckle 3

    // signal emitting from fist
    if(frame%18<9){
      ctx.fillStyle=C.amber;
      ctx.fillRect(px-50,py-3, 5,3);    // energy burst
      ctx.fillRect(px-52,py-5, 3,2);
      ctx.fillRect(px-52,py+1, 3,2);
      ctx.fillStyle=C.white;
      ctx.fillRect(px-54,py-2, 2,3);
    }

    // ── BACK ARM (right, tucked alongside body) ──
    ctx.fillStyle=C.white;
    ctx.fillRect(px+4,  py-5,  8, 5);   // upper arm back
    ctx.fillRect(px+8,  py-1,  6, 4);   // forearm
    ctx.fillRect(px+10, py+2,  5, 4);   // hand

    // ── NECK ──
    ctx.fillStyle=C.white;
    ctx.fillRect(px-4, py-12, 5, 5);

    // ── HEAD (tilted slightly forward, flying) ──
    ctx.fillStyle=C.white;
    ctx.fillRect(px-8,  py-24, 13, 12); // head block

    // Hair / top of head
    ctx.fillRect(px-8,  py-26, 13, 3);
    ctx.fillRect(px-9,  py-25,  3, 2);  // hair left tuft
    ctx.fillRect(px+3,  py-27,  4, 3);  // hair right

    // ── MASK / VISOR ──
    ctx.fillStyle=C.amber;
    ctx.fillRect(px-8,  py-22, 13, 5);  // mask band across eyes
    ctx.fillStyle=C.bg;
    ctx.fillRect(px-7,  py-21,  5, 3);  // left eye hole
    ctx.fillRect(px+1,  py-21,  4, 3);  // right eye hole
    ctx.fillStyle=C.white;
    ctx.fillRect(px-6,  py-21,  2, 2);  // left eye white
    ctx.fillRect(px+2,  py-21,  2, 2);  // right eye white
    // Determined expression
    ctx.fillStyle=C.bg;
    ctx.fillRect(px-4,  py-14,  6, 1);  // mouth line
    ctx.fillRect(px+1,  py-15,  2, 1);  // smirk uptick

    // ── EAR/SIDE HEAD ──
    ctx.fillStyle=C.white;
    ctx.fillRect(px-9,  py-21,  2, 4);  // left ear nub
    ctx.fillRect(px+5,  py-21,  2, 4);  // right ear

    // ── COLLAR ──
    ctx.fillStyle=C.white;
    ctx.fillRect(px-9,  py-12, 15, 4);  // collar/shoulders
    ctx.fillStyle=C.amber;
    ctx.fillRect(px-9,  py-12, 15, 1);  // collar trim

    // ── SPEED MARKS FROM BODY ──
    ctx.fillStyle=C.white;
    ctx.globalAlpha=0.35+0.15*Math.sin(frame*0.08);
    ctx.fillRect(px+28, py-4, 8, 1);
    ctx.fillRect(px+26, py-1, 12, 1);
    ctx.fillRect(px+28, py+2, 6, 1);
    ctx.globalAlpha=1;

    ctx.restore();
  }

  // ── FLOATING BITS ─────────────────────────────────────────
  const BITS=Array.from({length:16},()=>({
    x:Math.random()*W, y:10+Math.random()*(H*0.72),
    spd:0.18+Math.random()*0.38, phase:Math.random()*Math.PI*2,
    ch:Math.random()>0.5?'0':'1', t:Math.random()*60,
  }));

  function drawBits(dt){
    ctx.font='7px monospace';
    BITS.forEach(b=>{
      b.x-=b.spd;b.t+=dt*2;if(b.x<-10)b.x=W+8;
      ctx.save();ctx.globalAlpha=0.22+0.18*Math.sin(b.t+b.phase);
      ctx.fillStyle=C.white;
      ctx.fillText(b.ch,b.x|0,(b.y+Math.sin(b.t+b.phase)*4)|0);
      ctx.restore();
    });
  }

  // ── HUD BAR ───────────────────────────────────────────────
  function drawHUD(){
    ctx.fillStyle=C.bg;ctx.fillRect(0,H-22,W,22);
    ctx.fillStyle=C.white;ctx.fillRect(0,H-23,W,1);
    ctx.font='bold 9px monospace';ctx.letterSpacing='2px';
    ctx.fillStyle=C.white;ctx.textAlign='left';
    ctx.fillText('☀ RE / DATA OPS ACTIVE',8,H-8);
    ctx.textAlign='right';ctx.fillStyle=C.amber;
    ctx.fillText('SIGNALS: '+signals,W-8,H-8);
    ctx.textAlign='left';ctx.letterSpacing='0';
  }

  // ── MAIN LOOP ─────────────────────────────────────────────
  function loop(ts){
    const dt=Math.min((ts-lastTs)/1000,0.05);
    lastTs=ts; frame++;

    scroll+=52*dt;

    ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
    grid();

    // dither corners
    for(let x=0;x<W*0.16;x+=3)for(let y=0;y<H-22;y+=3)
      if(Math.random()<(1-x/(W*0.16))*0.45){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}
    for(let x=W*0.84;x<W;x+=3)for(let y=0;y<H-22;y+=3)
      if(Math.random()<((x-W*0.84)/(W*0.16))*0.45){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}

    drawSun(W*0.74,H*0.23,22+Math.sin(frame*0.022)*2,frame*0.016);
    drawCity();
    drawPackets(dt);
    drawSparks(dt);
    drawBits(dt);
    drawHero(dt);
    drawHUD();
    scanlines();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();