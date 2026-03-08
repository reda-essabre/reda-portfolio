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

  // ── HERO — smooth outline art, flying pose ─────────────────
  // Drawn with ctx paths/arcs matching the reference illustration style
  const HERO = { x:W*0.48, y:H*0.40, bob:0, bobDir:1, trail:[] };

  function drawHero(dt) {
    HERO.bob += HERO.bobDir*dt*20;
    if(HERO.bob> 5) HERO.bobDir=-1;
    if(HERO.bob<-5) HERO.bobDir= 1;

    const px = HERO.x, py = HERO.y + HERO.bob;

    // ── SPEED LINES (long diagonal streaks like reference) ──
    ctx.save();
    ctx.strokeStyle = C.white; ctx.lineWidth = 1;
    const lineCount = 11;
    for(let i=0;i<lineCount;i++){
      const spread = (i - lineCount/2) * 7;
      const len = 90 + i*8 + Math.sin(frame*0.05+i)*6;
      const alpha = 0.12 + (lineCount-i)/lineCount*0.22;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(px - 55 + spread*0.3, py + 30 + spread*0.8);
      ctx.lineTo(px - 55 - len + spread*0.3, py + 30 + spread*0.8 + len*0.35);
      ctx.stroke();
    }
    ctx.restore();

    // ── HERO OUTLINE ART ──────────────────────────────────────
    ctx.save();
    ctx.translate(px, py);

    // --- Transform for flying angle (slight tilt) ---
    ctx.rotate(-0.18); // tilt body upward-left

    const lw = 1.5; // line width
    ctx.strokeStyle = C.white;
    ctx.fillStyle   = C.bg;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';

    // ── CAPE (drawn behind body) ──
    ctx.save();
    const capeFlap = Math.sin(frame*0.055)*5;
    ctx.lineWidth = lw;
    ctx.beginPath();
    // Cape starts at left shoulder, sweeps dramatically back-left
    ctx.moveTo(-5, -28);           // shoulder
    ctx.bezierCurveTo(-10,-18, -35,-5, -60, 15+capeFlap);   // top edge
    ctx.bezierCurveTo(-70,25+capeFlap, -68,40+capeFlap, -55, 55+capeFlap*1.5); // tip
    ctx.bezierCurveTo(-40,48+capeFlap, -20,30, 0, 10);     // bottom back
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Cape inner fold lines
    ctx.globalAlpha=0.55;
    for(let i=1;i<=4;i++){
      const t=i/5;
      ctx.beginPath();
      ctx.moveTo(-5+(-55-(-5))*t*0.4, -28+(15+capeFlap-(-28))*t);
      ctx.bezierCurveTo(
        -5+(-68-(-5))*t*0.5, -28+(25+capeFlap-(-28))*t*1.1,
        -5+(-60-(-5))*t*0.7, -28+(45+capeFlap-(-28))*t,
        -5+(-45-(-5))*t*0.8, -28+(52+capeFlap*1.5-(-28))*t
      );
      ctx.stroke();
    }
    ctx.globalAlpha=1;
    ctx.restore();

    // ── LEGS ──
    ctx.lineWidth = lw;
    // Right leg (upper, in front)
    ctx.beginPath();
    ctx.moveTo(5, 20);
    ctx.bezierCurveTo(12,26, 18,32, 22,42);
    ctx.bezierCurveTo(24,48, 20,54, 16,58);
    ctx.stroke();
    // Right boot
    ctx.beginPath();
    ctx.moveTo(16,58); ctx.bezierCurveTo(12,62, 8,64, 4,62);
    ctx.bezierCurveTo(0,60, 2,56, 6,54);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Left leg (behind, slightly back)
    ctx.save(); ctx.globalAlpha=0.7;
    ctx.beginPath();
    ctx.moveTo(-4, 22);
    ctx.bezierCurveTo(2,28, 6,36, 8,46);
    ctx.bezierCurveTo(10,52, 6,56, 2,58);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(2,58); ctx.bezierCurveTo(-2,62,-8,63,-10,60);
    ctx.bezierCurveTo(-12,57,-8,54,-4,54);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();

    // Leg muscle details
    ctx.save(); ctx.globalAlpha=0.45; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(8,28); ctx.quadraticCurveTo(16,35,18,42); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4,30); ctx.quadraticCurveTo(10,38,12,44); ctx.stroke();
    ctx.restore();

    // ── TORSO ──
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(-12,-28); // left shoulder
    ctx.bezierCurveTo(-16,-22,-16,-8,-14,8);  // left side
    ctx.bezierCurveTo(-12,16,-6,20,0,22);      // left hip
    ctx.bezierCurveTo(6,20,12,16,14,8);        // right hip
    ctx.bezierCurveTo(16,-8,16,-22,12,-28);    // right side
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Torso muscle lines
    ctx.save(); ctx.globalAlpha=0.40; ctx.lineWidth=1;
    // Pec divide
    ctx.beginPath(); ctx.moveTo(0,-28); ctx.lineTo(0,-10); ctx.stroke();
    // Abs
    for(let i=0;i<3;i++){
      const ay=-6+i*9;
      ctx.beginPath(); ctx.moveTo(-11,ay); ctx.lineTo(-1,ay+1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1,ay+1); ctx.lineTo(11,ay); ctx.stroke();
    }
    // Pecs
    ctx.beginPath(); ctx.moveTo(-12,-22); ctx.bezierCurveTo(-8,-14,0,-14,0,-22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12,-22); ctx.bezierCurveTo(8,-14,0,-14,0,-22); ctx.stroke();
    ctx.restore();

    // ── BELT ──
    ctx.fillStyle=C.amber; ctx.lineWidth=lw;
    ctx.beginPath();
    ctx.moveTo(-14,8); ctx.bezierCurveTo(-12,12,12,12,14,8);
    ctx.bezierCurveTo(12,14,-12,14,-14,8);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // Buckle
    ctx.fillStyle=C.white;
    ctx.fillRect(-3,8,6,5);
    ctx.fillStyle=C.bg; ctx.fillRect(-2,9,4,3);
    ctx.fillStyle=C.amber; ctx.fillRect(-1,10,2,1);
    ctx.fillStyle=C.bg;

    // ── SHOULDERS ──
    ctx.lineWidth=lw;
    // Right shoulder
    ctx.beginPath();
    ctx.arc(14,-28,8,Math.PI*1.1,Math.PI*0.1);
    ctx.stroke();
    // Left shoulder
    ctx.beginPath();
    ctx.arc(-14,-28,8,Math.PI*0.9,Math.PI*1.9);
    ctx.stroke();

    // ── LEFT ARM (fist forward, outstretched toward viewer-left) ──
    ctx.lineWidth=lw;
    ctx.beginPath();
    ctx.moveTo(-14,-22);                            // shoulder
    ctx.bezierCurveTo(-22,-20,-32,-18,-40,-14);     // upper arm
    ctx.bezierCurveTo(-48,-10,-52,-6,-50,0);        // elbow bend
    ctx.stroke();
    // Forearm
    ctx.beginPath();
    ctx.moveTo(-50,0);
    ctx.bezierCurveTo(-52,6,-50,12,-46,16);
    ctx.stroke();
    // FIST
    ctx.beginPath();
    ctx.moveTo(-46,16);
    ctx.bezierCurveTo(-50,14,-56,12,-58,8);
    ctx.bezierCurveTo(-60,4,-58,-2,-54,-4);
    ctx.bezierCurveTo(-50,-6,-44,-4,-42,0);
    ctx.bezierCurveTo(-40,4,-40,10,-42,14);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // Knuckle lines
    ctx.save(); ctx.globalAlpha=0.5; ctx.lineWidth=1;
    for(let k=0;k<3;k++){
      ctx.beginPath();
      ctx.moveTo(-55+k*3,-1); ctx.lineTo(-54+k*3,4);
      ctx.stroke();
    }
    ctx.restore();
    // Arm muscle
    ctx.save(); ctx.globalAlpha=0.38; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(-18,-20); ctx.bezierCurveTo(-26,-18,-34,-14,-38,-10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-20,-16); ctx.bezierCurveTo(-28,-14,-36,-10,-40,-6); ctx.stroke();
    ctx.restore();

    // ── RIGHT ARM (alongside body, slightly back) ──
    ctx.lineWidth=lw; ctx.save(); ctx.globalAlpha=0.75;
    ctx.beginPath();
    ctx.moveTo(14,-22);
    ctx.bezierCurveTo(20,-18,24,-10,24,0);
    ctx.bezierCurveTo(24,8,22,16,20,22);
    ctx.stroke();
    // Right fist
    ctx.beginPath();
    ctx.moveTo(20,22);
    ctx.bezierCurveTo(22,24,24,28,22,32);
    ctx.bezierCurveTo(20,34,16,34,14,30);
    ctx.bezierCurveTo(12,26,14,22,18,22);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();

    // ── NECK ──
    ctx.lineWidth=lw;
    ctx.beginPath();
    ctx.moveTo(-4,-28); ctx.lineTo(-4,-36);
    ctx.moveTo(4,-28);  ctx.lineTo(4,-36);
    ctx.stroke();

    // ── HEAD ──
    ctx.lineWidth=lw;
    // Head shape
    ctx.beginPath();
    ctx.moveTo(-8,-36);
    ctx.bezierCurveTo(-12,-36,-14,-40,-12,-46);
    ctx.bezierCurveTo(-10,-52,-4,-56,0,-56);
    ctx.bezierCurveTo(4,-56,10,-52,12,-46);
    ctx.bezierCurveTo(14,-40,12,-36,8,-36);
    ctx.bezierCurveTo(4,-34,0,-34,-4,-34);
    ctx.bezierCurveTo(-6,-34,-8,-35,-8,-36);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Jaw/chin
    ctx.beginPath();
    ctx.moveTo(-8,-36); ctx.bezierCurveTo(-6,-30,6,-30,8,-36);
    ctx.stroke();

    // Ear left
    ctx.beginPath(); ctx.arc(-14,-44,3,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // Ear right
    ctx.beginPath(); ctx.arc(14,-44,3,0,Math.PI*2); ctx.fill(); ctx.stroke();

    // ── MASK (over eyes only — like reference) ──
    ctx.fillStyle=C.white;
    ctx.beginPath();
    ctx.moveTo(-12,-46);
    ctx.bezierCurveTo(-10,-50,10,-50,12,-46);
    ctx.bezierCurveTo(10,-42,-10,-42,-12,-46);
    ctx.closePath(); ctx.fill();

    // Eye holes (dark)
    ctx.fillStyle=C.bg;
    ctx.beginPath(); ctx.ellipse(-5,-46,3,2.5,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(5,-46,3,2.5,0,0,Math.PI*2); ctx.fill();

    // Eye whites
    ctx.fillStyle=C.white;
    ctx.beginPath(); ctx.ellipse(-5,-46,2,1.5,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(5,-46,2,1.5,0,0,Math.PI*2); ctx.fill();

    // Pupils
    ctx.fillStyle=C.bg;
    ctx.beginPath(); ctx.ellipse(-4,-46,1,1,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(6,-46,1,1,0,0,Math.PI*2); ctx.fill();

    // Nose
    ctx.strokeStyle=C.white; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(0,-44); ctx.lineTo(-2,-40); ctx.lineTo(2,-40); ctx.stroke();

    // Mouth — determined set
    ctx.beginPath(); ctx.moveTo(-4,-38); ctx.lineTo(4,-38); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4,-38); ctx.lineTo(6,-37); ctx.stroke(); // smirk

    // Hair
    ctx.lineWidth=1.5; ctx.strokeStyle=C.white;
    ctx.beginPath();
    ctx.moveTo(-12,-46);
    ctx.bezierCurveTo(-14,-50,-12,-56,-8,-58);
    ctx.bezierCurveTo(-4,-60,4,-60,8,-58);
    ctx.bezierCurveTo(12,-56,14,-50,12,-46);
    ctx.stroke();
    // Hair detail
    ctx.save(); ctx.globalAlpha=0.4; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(-6,-56); ctx.lineTo(-4,-60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-58); ctx.lineTo(2,-62); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6,-56); ctx.lineTo(8,-60); ctx.stroke();
    ctx.restore();

    // Chest S-style emblem (sun mark)
    ctx.fillStyle=C.bg;
    ctx.strokeStyle=C.white; ctx.lineWidth=lw;
    ctx.beginPath(); ctx.arc(0,-18,6,0,Math.PI*2);
    ctx.fill(); ctx.stroke();
    // Rotating sun mark
    const rot=frame*0.025;
    ctx.save(); ctx.translate(0,-18);
    ctx.strokeStyle=C.amber; ctx.lineWidth=1;
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+rot;
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*4,Math.sin(a)*4);
      ctx.lineTo(Math.cos(a)*7,Math.sin(a)*7); ctx.stroke();
    }
    ctx.restore();

    ctx.restore(); // untranslate
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