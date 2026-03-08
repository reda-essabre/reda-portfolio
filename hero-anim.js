/* ============================================================
   HERO-ANIM.JS — SIGNALIS-style scene
   Character: bold ink figure, top-down isometric, flying
   Reference: Zelda GBC + SIGNALIS 1-bit dithered aesthetic
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const IW = 240, IH = 150;
  canvas.width  = IW;
  canvas.height = IH;
  canvas.style.imageRendering = 'pixelated';
  canvas.style.imageRendering = 'crisp-edges';

  const C = { bg:'#000000', white:'#ffffff', amber:'#d4a843' };
  let frame = 0, lastTs = 0, signals = 0, scroll = 0;

  // ── BAYER 4×4 DITHER MATRIX ───────────────────────────────
  const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  function dither(x, y, threshold) {
    return BAYER[((y&3)<<2)+(x&3)] / 16 < threshold;
  }

  // ── PIXEL CHARACTER (SIGNALIS / Zelda GBC style) ──────────
  // Top-down isometric, flying left-to-right
  // Cape streams right, bold 1-bit ink outline, Bayer shading
  function drawFigure(ox, oy, t) {
    ctx.save();

    // SHADOW (dithered ellipse on ground)
    const sy = oy + 4;
    for (let dx = -8; dx <= 8; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        const dist = (dx*dx)/64 + (dy*dy)/4;
        if (dist <= 1.0 && dither(ox+dx, sy+dy, (1-dist)*0.5)) {
          ctx.fillStyle = C.white;
          ctx.fillRect((ox+dx)|0, (sy+dy)|0, 1, 1);
        }
      }
    }

    // CAPE (streams right / behind)
    const cw = Math.sin(t*3.2)*1.5;
    // Three cape strips
    const capeSegs = [{cx:3,cy:-18,cw:6,ch:10},{cx:7,cy:-15,cw:4,ch:7},{cx:11,cy:-12,cw:3,ch:5}];
    capeSegs.forEach((cs,i) => {
      const wave = cw*(i+1)*0.4;
      ctx.fillStyle = C.bg;
      ctx.fillRect((ox+cs.cx)|0,(oy+cs.cy+wave)|0,cs.cw,cs.ch);
      ctx.fillStyle = C.white;
      ctx.fillRect((ox+cs.cx-1)|0,(oy+cs.cy+wave-1)|0,cs.cw+2,1);
      ctx.fillRect((ox+cs.cx-1)|0,(oy+cs.cy+wave+cs.ch)|0,cs.cw+2,1);
      ctx.fillRect((ox+cs.cx-1)|0,(oy+cs.cy+wave-1)|0,1,cs.ch+2);
      ctx.fillRect((ox+cs.cx+cs.cw)|0,(oy+cs.cy+wave-1)|0,1,cs.ch+2);
      // dither shading on cape
      for (let dx=0;dx<cs.cw;dx++) for (let dy=1;dy<cs.ch-1;dy++) {
        if (dither((ox+cs.cx+dx)|0,(oy+cs.cy+dy+wave)|0,0.35-(i*0.07)))
          { ctx.fillStyle=C.white; ctx.fillRect((ox+cs.cx+dx)|0,(oy+cs.cy+dy+wave)|0,1,1); }
      }
    });

    // LEGS
    // Left leg
    ctx.fillStyle = C.bg;
    ctx.fillRect((ox-5)|0,(oy-7)|0,4,7);
    ctx.fillStyle = C.white;
    ctx.fillRect((ox-6)|0,(oy-8)|0,1,9);
    ctx.fillRect((ox-5)|0,(oy-8)|0,5,1);
    ctx.fillRect((ox-2)|0,(oy)|0,2,1);
    // Right leg
    ctx.fillStyle = C.bg;
    ctx.fillRect((ox+1)|0,(oy-7)|0,4,7);
    ctx.fillStyle = C.white;
    ctx.fillRect((ox+5)|0,(oy-8)|0,1,9);
    ctx.fillRect((ox+1)|0,(oy-8)|0,4,1);
    ctx.fillRect((ox+1)|0,(oy)|0,2,1);
    // Leg dither
    for (let dx=-5;dx<=4;dx++) for (let dy=-7;dy<=-1;dy++) {
      if (dx===0||dx===-1) continue;
      if (dither((ox+dx)|0,(oy+dy)|0,0.28)) { ctx.fillStyle=C.white; ctx.fillRect((ox+dx)|0,(oy+dy)|0,1,1); }
    }

    // TORSO (wider, hero build)
    ctx.fillStyle = C.bg;
    ctx.fillRect((ox-7)|0,(oy-20)|0,14,13);
    ctx.fillStyle = C.white;
    ctx.fillRect((ox-8)|0,(oy-21)|0,16,1);
    ctx.fillRect((ox-8)|0,(oy-8)|0,16,1);
    ctx.fillRect((ox-8)|0,(oy-21)|0,1,14);
    ctx.fillRect((ox+7)|0,(oy-21)|0,1,14);
    // Torso Bayer shading (light from right)
    for (let dx=-7;dx<=6;dx++) for (let dy=-20;dy<=-9;dy++) {
      const shade = dx>2 ? 0.60 : (dx>-2 ? 0.32 : 0.14);
      if (dither((ox+dx)|0,(oy+dy)|0,shade)) { ctx.fillStyle=C.white; ctx.fillRect((ox+dx)|0,(oy+dy)|0,1,1); }
    }
    // Belt line
    ctx.fillStyle = C.white;
    ctx.fillRect((ox-7)|0,(oy-10)|0,14,1);
    // Belt buckle
    ctx.fillRect((ox-1)|0,(oy-11)|0,2,2);
    ctx.fillStyle = C.bg;
    ctx.fillRect((ox)|0,(oy-10)|0,1,1);

    // LEFT ARM (reaching forward)
    const arm = Math.sin(t*3.2)*2;
    ctx.fillStyle = C.bg;
    ctx.fillRect((ox-11)|0,(oy-20+arm)|0,5,4);
    ctx.fillStyle = C.white;
    ctx.fillRect((ox-12)|0,(oy-21+arm)|0,7,1);
    ctx.fillRect((ox-12)|0,(oy-21+arm)|0,1,6);
    ctx.fillRect((ox-6)|0,(oy-17+arm)|0,1,1);
    // Hand
    ctx.fillStyle = C.white;
    ctx.fillRect((ox-13)|0,(oy-20+arm)|0,3,3);
    ctx.fillStyle = C.bg;
    ctx.fillRect((ox-12)|0,(oy-19+arm)|0,1,1);

    // RIGHT ARM (back)
    ctx.fillStyle = C.bg;
    ctx.fillRect((ox+7)|0,(oy-20-arm)|0,4,4);
    ctx.fillStyle = C.white;
    ctx.fillRect((ox+6)|0,(oy-21-arm)|0,7,1);
    ctx.fillRect((ox+11)|0,(oy-21-arm)|0,1,5);

    // HEAD (3/4 view, slightly turned)
    const hx=ox-2, hy=oy-31;
    ctx.fillStyle = C.bg;
    ctx.fillRect((hx-4)|0,(hy-6)|0,11,8);
    ctx.fillStyle = C.white;
    ctx.fillRect((hx-5)|0,(hy-7)|0,13,1);
    ctx.fillRect((hx-5)|0,(hy+1)|0,13,1);
    ctx.fillRect((hx-5)|0,(hy-7)|0,1,9);
    ctx.fillRect((hx+7)|0,(hy-7)|0,1,9);
    // Face dither
    for (let dx=-4;dx<=6;dx++) for (let dy=-6;dy<=0;dy++) {
      const shade = dx>3?0.65:(dx>0?0.38:0.12);
      if (dither((hx+dx)|0,(hy+dy)|0,shade)) { ctx.fillStyle=C.white; ctx.fillRect((hx+dx)|0,(hy+dy)|0,1,1); }
    }
    // Eyes
    ctx.fillStyle = C.white;
    ctx.fillRect((hx-2)|0,(hy-4)|0,2,2);
    ctx.fillRect((hx+2)|0,(hy-4)|0,2,2);
    ctx.fillStyle = C.bg;
    ctx.fillRect((hx-1)|0,(hy-3)|0,1,1);
    ctx.fillRect((hx+3)|0,(hy-3)|0,1,1);

    // HAIR / HOOD
    ctx.fillStyle = C.bg;
    ctx.fillRect((hx-4)|0,(hy-10)|0,12,4);
    ctx.fillStyle = C.white;
    ctx.fillRect((hx-5)|0,(hy-11)|0,14,1);
    ctx.fillRect((hx-5)|0,(hy-11)|0,1,5);
    ctx.fillRect((hx+8)|0,(hy-11)|0,1,5);
    for (let dx=-4;dx<=7;dx++) for (let dy=-10;dy<=-7;dy++) {
      if (dither((hx+dx)|0,(hy+dy)|0,0.28)) { ctx.fillStyle=C.white; ctx.fillRect((hx+dx)|0,(hy+dy)|0,1,1); }
    }

    // MOTION TRAIL (speed lines behind)
    for (let i=1;i<=7;i++) {
      const tx=ox+i*5, ty=oy-14+Math.sin((frame-i*4)*0.07)*3;
      ctx.globalAlpha = 0.55 - i*0.07;
      ctx.fillStyle = C.white;
      for (let q=0;q<3;q++) {
        if (dither(tx+q,ty-q*3,0.42)) ctx.fillRect((tx+q)|0,(ty-q)|0,1,1);
      }
    }
    ctx.globalAlpha=1;
    ctx.restore();
  }

  // ── STARS ─────────────────────────────────────────────────
  const STARS = Array.from({length:65},()=>({
    x:Math.random()*IW, y:Math.random()*(IH*0.78),
    bright:Math.random(), spd:0.04+Math.random()*0.09,
    tw:Math.random()*Math.PI*2
  }));
  function drawStars(dt) {
    STARS.forEach(s=>{
      s.x-=s.spd; if(s.x<0){s.x=IW;s.y=Math.random()*(IH*0.78);}
      s.tw+=dt*2;
      ctx.globalAlpha=0.5+0.5*Math.abs(Math.sin(s.tw));
      ctx.fillStyle=C.white;
      if(s.bright>0.9){ctx.fillRect(s.x|0,(s.y-2)|0,1,5);ctx.fillRect((s.x-2)|0,s.y|0,5,1);}
      else ctx.fillRect(s.x|0,s.y|0,s.bright>0.6?2:1,s.bright>0.6?2:1);
      ctx.globalAlpha=1;
    });
  }

  // ── SUN ───────────────────────────────────────────────────
  function drawSun(t) {
    const x=IW*0.83,y=IH*0.19,r=13;
    ctx.save();
    ctx.strokeStyle=C.white;ctx.lineWidth=1;
    for(let i=0;i<12;i++){
      const a=(i/12)*Math.PI*2+t*0.5,r1=r+2,r2=r+(i%2===0?7:4);
      ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1);
      ctx.lineTo(x+Math.cos(a)*r2,y+Math.sin(a)*r2);ctx.stroke();
    }
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=C.bg;ctx.fill();ctx.strokeStyle=C.white;ctx.lineWidth=1;ctx.stroke();
    for(let dy=-r;dy<r;dy+=2) for(let dx=-r;dx<r;dx+=2)
      if(dx*dx+dy*dy<r*r-3) {
        const d=Math.sqrt(dx*dx+dy*dy)/r;
        if(dither((x+dx)|0,(y+dy)|0,(1-d)*0.55)){ctx.fillStyle=C.white;ctx.fillRect((x+dx)|0,(y+dy)|0,1,1);}
      }
    ctx.restore();
  }

  // ── CITY ──────────────────────────────────────────────────
  const BLDGS=[];
  for(let i=0;i<22;i++){
    const bx=i*55+Math.random()*15,bh=14+Math.random()*40|0,bw=10+Math.random()*16|0;
    const wins=[];
    for(let wy=4;wy<bh-5;wy+=6) for(let wx=3;wx<bw-3;wx+=5)
      wins.push({ox:wx,oy:wy,lit:Math.random()>0.4,t:Math.random()*80});
    BLDGS.push({x:bx,h:bh,w:bw,wins});
  }
  const WORLD_W=22*60+60;
  function drawCity(){
    const ground=IH-16;
    ctx.fillStyle=C.white;ctx.fillRect(0,ground,IW,1);
    for(let dy=0;dy<5;dy++) for(let dx=0;dx<IW;dx++)
      if(dither(dx,ground+1+dy,0.28-dy*0.05)){ctx.fillStyle=C.white;ctx.fillRect(dx,ground+1+dy,1,1);}
    BLDGS.forEach(b=>{
      const bx=((b.x-scroll*0.38)%WORLD_W+WORLD_W)%WORLD_W-10;
      if(bx>IW+30||bx<-b.w-10)return;
      const by=ground-b.h;
      ctx.fillStyle=C.bg;ctx.fillRect(bx|0,by|0,b.w,b.h);
      ctx.fillStyle=C.white;
      ctx.fillRect(bx|0,by|0,b.w,1);ctx.fillRect(bx|0,by|0,1,b.h);ctx.fillRect((bx+b.w-1)|0,by|0,1,b.h);
      if(b.h>28){ctx.fillRect((bx+b.w/2)|0,(by-5)|0,1,5);ctx.fillRect((bx+b.w/2-2)|0,(by-6)|0,4,1);}
      for(let dy=1;dy<b.h-1;dy++) for(let dx=b.w-5;dx<b.w-1;dx++)
        if(dither((bx+dx)|0,(by+dy)|0,0.45)){ctx.fillStyle=C.white;ctx.fillRect((bx+dx)|0,(by+dy)|0,1,1);}
      b.wins.forEach(w=>{
        w.t--;if(w.t<=0){w.lit=Math.random()>0.35;w.t=40+Math.random()*100;}
        if(!w.lit)return;
        ctx.fillStyle=C.white;ctx.fillRect((bx+w.ox)|0,(by+w.oy)|0,2,2);
        ctx.fillStyle=C.bg;ctx.fillRect((bx+w.ox+1)|0,(by+w.oy+1)|0,1,1);
      });
    });
  }

  // ── PACKETS ───────────────────────────────────────────────
  const PKTS=Array.from({length:4},(_,i)=>({
    wx:60+i*55,wy:20+Math.sin(i*1.4)*28,t:i*0.7,alive:true,respawn:0
  }));
  const SPARKS=[];
  function emitSparks(x,y){
    for(let i=0;i<10;i++){const a=Math.random()*Math.PI*2,s=20+Math.random()*50;
    SPARKS.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1});}
  }
  const HERO_X=IW*0.42;
  function drawPackets(dt){
    PKTS.forEach(p=>{
      p.t+=dt*2.5;
      if(!p.alive){if(frame>p.respawn){p.wx=scroll*0.72+60+Math.random()*100;p.wy=16+Math.random()*55;p.alive=true;}return;}
      const sx=((p.wx-scroll*0.72)%IW+IW)%IW,sy=p.wy+Math.sin(p.t)*4;
      const pulse=0.6+0.4*Math.sin(p.t),s=Math.round(5*pulse);
      ctx.save();ctx.globalAlpha=pulse;ctx.strokeStyle=C.amber;ctx.lineWidth=1;
      ctx.strokeRect((sx-s)|0,(sy-s)|0,s*2,s*2);
      ctx.fillStyle=C.amber;
      ctx.fillRect((sx-1)|0,(sy-s+1)|0,2,s*2-2);ctx.fillRect((sx-s+1)|0,(sy-1)|0,s*2-2,2);
      ctx.restore();
      const heroBob=Math.sin(frame*0.04)*4;
      if(Math.abs(sx-HERO_X)<14&&Math.abs(sy-(IH*0.44+heroBob))<14){
        p.alive=false;p.respawn=frame+180;signals++;emitSparks(sx,sy);
        const el=document.getElementById('hero-signal-count');if(el)el.textContent='SIGNALS:'+signals;
      }
    });
  }
  function drawSparks(dt){
    for(let i=SPARKS.length-1;i>=0;i--){
      const s=SPARKS[i];s.x+=s.vx*dt;s.y+=s.vy*dt;s.vx*=0.85;s.vy*=0.85;s.life-=dt*2.2;
      if(s.life<=0){SPARKS.splice(i,1);continue;}
      ctx.globalAlpha=s.life*0.85;ctx.fillStyle=C.amber;ctx.fillRect(s.x|0,s.y|0,1,1);ctx.globalAlpha=1;
    }
  }

  // ── SCANLINES ─────────────────────────────────────────────
  function scanlines(){
    for(let y=0;y<IH;y+=3){ctx.fillStyle='rgba(0,0,0,0.10)';ctx.fillRect(0,y,IW,1);}
    for(let i=0;i<6;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.03})`;
    ctx.fillRect(Math.random()*IW|0,Math.random()*IH|0,1,1);}
  }

  // ── HUD ───────────────────────────────────────────────────
  function drawHUD(){
    ctx.fillStyle=C.bg;ctx.fillRect(0,IH-12,IW,12);
    ctx.fillStyle=C.white;ctx.fillRect(0,IH-13,IW,1);
    ctx.font='bold 6px monospace';
    ctx.fillStyle=C.white;ctx.textAlign='left';ctx.fillText('RE / DATA OPS',4,IH-4);
    ctx.textAlign='right';ctx.fillStyle=C.amber;ctx.fillText('SIG:'+signals,IW-4,IH-4);
    ctx.textAlign='left';
  }

  // ── LOOP ──────────────────────────────────────────────────
  function loop(ts){
    const dt=Math.min((ts-lastTs)/1000,0.05);lastTs=ts;frame++;scroll+=28*dt;
    ctx.fillStyle=C.bg;ctx.fillRect(0,0,IW,IH);
    ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
    for(let x=0;x<IW;x+=12){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,IH);ctx.stroke();}
    for(let y=0;y<IH;y+=12){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(IW,y);ctx.stroke();}
    // Vignette dither
    for(let x=0;x<IW*0.12;x+=2) for(let y=0;y<IH-12;y+=2)
      if(dither(x,y,(1-x/(IW*0.12))*0.48)){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}
    for(let x=IW*0.88;x<IW;x+=2) for(let y=0;y<IH-12;y+=2)
      if(dither(x,y,((x-IW*0.88)/(IW*0.12))*0.48)){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}
    drawStars(dt);
    drawSun(frame*0.012);
    drawCity();
    drawPackets(dt);
    drawSparks(dt);
    const bob=Math.sin(frame*0.04)*4;
    drawFigure(HERO_X|0,(IH*0.44+bob)|0,frame*0.022);
    drawHUD();
    scanlines();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();