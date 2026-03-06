/* ============================================================
   GAME.JS v2 — Sun Runner: Collect Signals
   SIGNALIS 1-bit aesthetic, Canvas 2D
   ============================================================ */
(function () {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const W = 640, H = 400;
  canvas.width = W;
  canvas.height = H;

  // Pixel font helper
  const C = {
    bg: '#000000',
    white: '#ffffff',
    amber: '#d4a843',
    dgray: '#222222',
    mgray: '#555555',
  };

  const GAME_TIME = 90;
  const TILE = 20;
  const PLAYER_W = 12, PLAYER_H = 22;

  let state = 'title'; // title | play | dead | win | over
  let score = 0, lives = 3, timeLeft = GAME_TIME;
  let timerAcc = 0, spawnAcc = 0, frameN = 0;
  let lastTs = 0;
  let diff = 1;

  // Input
  const K = {};
  window.addEventListener('keydown', e => {
    K[e.key] = true;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter',' '].includes(e.key)) e.preventDefault();
    if ((e.key === 'Enter') && (state === 'title' || state === 'over' || state === 'win')) startGame();
  });
  window.addEventListener('keyup', e => K[e.key] = false);

  // Mobile
  ['up','down','left','right'].forEach(d => {
    const b = document.getElementById('btn-' + d);
    if (!b) return;
    b.addEventListener('touchstart', e => { e.preventDefault(); K['_'+d]=true; }, {passive:false});
    b.addEventListener('touchend', e => { e.preventDefault(); K['_'+d]=false; }, {passive:false});
    b.addEventListener('mousedown', () => K['_'+d]=true);
    b.addEventListener('mouseup', () => K['_'+d]=false);
  });

  canvas.addEventListener('click', () => {
    if (state === 'title' || state === 'over' || state === 'win') startGame();
  });

  function inp() {
    return {
      u: K.ArrowUp||K.w||K.W||K['_up'],
      d: K.ArrowDown||K.s||K.S||K['_down'],
      l: K.ArrowLeft||K.a||K.A||K['_left'],
      r: K.ArrowRight||K.d||K.D||K['_right'],
    };
  }

  // Entities
  let player = {};
  let packets = [], enemies = [], sparks = [];

  function startGame() {
    score=0; lives=3; timeLeft=GAME_TIME; timerAcc=0; spawnAcc=0; frameN=0; diff=1;
    packets=[]; enemies=[]; sparks=[];
    player = { x:W/2, y:H/2, vx:0, vy:0, spd:185, inv:0, trail:[], dead:false };
    for(let i=0;i<5;i++) spawnPkt();
    state='play';
    const eb = document.getElementById('end-btns');
    if(eb) eb.style.display='none';
  }

  function spawnPkt() {
    const m=36;
    packets.push({ x:m+Math.random()*(W-m*2), y:m+Math.random()*(H-m*2), t:0 });
  }

  function spawnEnemy() {
    const side = (Math.random()*4)|0;
    let x,y,vx,vy;
    const spd = (55+Math.random()*55)*diff;
    if(side===0){x=Math.random()*W;y=-20;vx=(Math.random()-.5)*30;vy=spd;}
    else if(side===1){x=W+20;y=Math.random()*H;vx=-spd;vy=(Math.random()-.5)*30;}
    else if(side===2){x=Math.random()*W;y=H+20;vx=(Math.random()-.5)*30;vy=-spd;}
    else{x=-20;y=Math.random()*H;vx=spd;vy=(Math.random()-.5)*30;}
    const track = Math.random()<0.28;
    enemies.push({x,y,vx,vy,track,t:Math.random()*6});
  }

  function emitSparks(x,y,col,n) {
    for(let i=0;i<n;i++) {
      const a=Math.random()*Math.PI*2, s=25+Math.random()*70;
      sparks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,color:col,sz:1+Math.random()*2.5});
    }
  }

  function hitbox(a,b,am=4) {
    const AHW=8,AHH=10,BHW=8,BHH=8;
    return a.x-AHW<b.x+BHW-am && a.x+AHW>b.x-BHW+am &&
           a.y-AHH<b.y+BHH-am && a.y+AHH>b.y-BHH+am;
  }

  function update(dt) {
    frameN++;
    const i = inp();

    // Move player
    player.vx = (i.r?1:0)-(i.l?1:0);
    player.vy = (i.d?1:0)-(i.u?1:0);
    if(player.vx&&player.vy){player.vx*=0.707;player.vy*=0.707;}
    player.vx *= player.spd;
    player.vy *= player.spd;
    player.x = Math.max(8, Math.min(W-8, player.x+player.vx*dt));
    player.y = Math.max(11, Math.min(H-11, player.y+player.vy*dt));

    // Trail
    if(frameN%2===0) {
      player.trail.push({x:player.x,y:player.y,l:1});
      if(player.trail.length>10) player.trail.shift();
    }
    player.trail.forEach(t=>t.l-=dt*3.5);

    if(player.inv>0) player.inv-=dt;

    // Timer
    timerAcc+=dt;
    if(timerAcc>=1){timeLeft--;timerAcc-=1;diff=1+(GAME_TIME-timeLeft)/GAME_TIME*1.8;}
    if(timeLeft<=0){state='win';showEndBtns();return;}

    // Spawning
    spawnAcc+=dt;
    const SI = Math.max(0.55, 2.2-(GAME_TIME-timeLeft)*0.018);
    if(spawnAcc>=SI){spawnAcc=0;spawnEnemy();if(packets.length<6)spawnPkt();}
    if(packets.length<3)spawnPkt();

    // Update packets
    packets.forEach(p=>p.t+=dt*3);

    // Update enemies
    for(let i=enemies.length-1;i>=0;i--) {
      const e=enemies[i]; e.t+=dt*2;
      if(e.track){
        const dx=player.x-e.x,dy=player.y-e.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d>1){const ts=80*diff;e.vx+=(dx/d)*ts*dt*2.5;e.vy+=(dy/d)*ts*dt*2.5;
          const vs=Math.sqrt(e.vx*e.vx+e.vy*e.vy);if(vs>ts*1.6){e.vx=e.vx/vs*ts*1.6;e.vy=e.vy/vs*ts*1.6;}}
      }
      e.x+=e.vx*dt; e.y+=e.vy*dt;
      if(e.x<-100||e.x>W+100||e.y<-100||e.y>H+100) enemies.splice(i,1);
    }

    // Packet collect
    for(let i=packets.length-1;i>=0;i--) {
      if(hitbox(player,packets[i],0)){score+=10;emitSparks(packets[i].x,packets[i].y,C.amber,8);packets.splice(i,1);spawnPkt();}
    }

    // Enemy hit
    if(player.inv<=0){
      for(let i=enemies.length-1;i>=0;i--){
        if(hitbox(player,enemies[i],3)){lives--;emitSparks(player.x,player.y,C.white,14);enemies.splice(i,1);
          if(lives<=0){state='over';showEndBtns();return;}
          player.x=W/2;player.y=H/2;player.inv=2.5;break;
        }
      }
    }

    // Sparks
    for(let i=sparks.length-1;i>=0;i--){
      const s=sparks[i];s.x+=s.vx*dt;s.y+=s.vy*dt;s.vx*=0.88;s.vy*=0.88;s.life-=dt*2.2;
      if(s.life<=0)sparks.splice(i,1);
    }

    updateHUD();
  }

  function updateHUD() {
    const s=document.getElementById('hud-score');
    const l=document.getElementById('hud-lives');
    const t=document.getElementById('hud-timer');
    if(s) s.textContent = 'SCORE: '+score;
    if(l) l.textContent = '◆'.repeat(lives)+'◇'.repeat(Math.max(0,3-lives));
    if(t) t.textContent = 'TIME: '+Math.max(0,timeLeft)+'s';
  }

  // ---- DRAW ----
  function scanlines() {
    for(let y=0;y<H;y+=4){ctx.fillStyle='rgba(0,0,0,0.12)';ctx.fillRect(0,y,W,2);}
    for(let i=0;i<20;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.025})`;ctx.fillRect(Math.random()*W|0,Math.random()*H|0,1,1);}
  }

  function grid() {
    ctx.save();
    ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
    for(let x=0;x<W;x+=TILE){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=TILE){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.restore();
  }

  function dither(x,y,w,h,density) {
    // Render halftone dither block at position
    ctx.save();
    ctx.fillStyle=C.white;
    const step = 4-density*1.5; // denser = smaller step
    for(let dy=y;dy<y+h;dy+=Math.max(2,step)) {
      for(let dx=x;dx<x+w;dx+=Math.max(2,step)) {
        if(Math.random()<density) {ctx.fillRect(dx|0,dy|0,1,1);}
      }
    }
    ctx.restore();
  }

  function drawSun(x,y,r,t) {
    ctx.save();
    ctx.strokeStyle=C.white; ctx.lineWidth=2;
    const rays=12;
    for(let i=0;i<rays;i++){
      const a=(i/rays)*Math.PI*2+t*0.5;
      const r1=r+4, r2=r+(i%2===0?12:8);
      ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1);ctx.lineTo(x+Math.cos(a)*r2,y+Math.sin(a)*r2);ctx.stroke();
    }
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=C.bg;ctx.fill();ctx.strokeStyle=C.white;ctx.stroke();
    // dither inside
    for(let dy=-r;dy<r;dy+=3) for(let dx=-r;dx<r;dx+=3){
      if(dx*dx+dy*dy<r*r-4){const d=Math.sqrt(dx*dx+dy*dy)/r;if(Math.random()<(1-d)*0.5){ctx.fillStyle=C.white;ctx.fillRect((x+dx)|0,(y+dy)|0,2,2);}}
    }
    ctx.restore();
  }

  function drawTitle(ts) {
    ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
    grid();
    // Dark corners dither
    for(let x=0;x<W*0.22;x+=3) for(let y=0;y<H;y+=3){if(Math.random()<(1-x/(W*0.22))*0.6){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}}
    for(let x=W*0.78;x<W;x+=3) for(let y=0;y<H;y+=3){if(Math.random()<((x-W*0.78)/(W*0.22))*0.6){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}}

    const t=ts/1000;
    drawSun(W/2,H/2-65,32+Math.sin(t)*3,t);

    ctx.fillStyle=C.white;ctx.textAlign='center';
    ctx.font='bold 38px monospace';ctx.letterSpacing='4px';
    ctx.fillText('SUN RUNNER',W/2,H/2+10);

    ctx.fillStyle=C.amber;ctx.font='11px monospace';ctx.letterSpacing='2px';
    ctx.fillText('COLLECT SIGNALS — AVOID NOISE',W/2,H/2+36);

    if(Math.floor(ts/600)%2===0){ctx.fillStyle=C.white;ctx.font='10px monospace';ctx.letterSpacing='1px';ctx.fillText('[ ENTER OR TAP TO START ]',W/2,H/2+70);}

    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='9px monospace';ctx.letterSpacing='0';
    ctx.fillText('WASD / ARROWS TO MOVE',W/2,H/2+94);
    scanlines();
  }

  function drawPlayer() {
    // Trail
    player.trail.forEach((t,i)=>{
      if(t.l<=0)return;
      ctx.save();ctx.globalAlpha=t.l*0.3;ctx.fillStyle=C.white;
      ctx.fillRect((t.x-4)|0,(t.y-8)|0,8,16);ctx.restore();
    });
    if(player.inv>0&&Math.floor(player.inv*8)%2===0)return;
    const px=player.x|0,py=player.y|0;
    ctx.save();
    // Shadow/dither beneath
    for(let dy=-11;dy<11;dy+=2)for(let dx=-6;dx<6;dx+=2)
      if(dx*dx+dy*dy<80&&Math.random()<0.4){ctx.fillStyle=C.white;ctx.fillRect(px+dx,py+dy,1,1);}

    // Legs
    ctx.fillStyle=C.white;
    ctx.fillRect(px-5,py+7,4,5);ctx.fillRect(px+1,py+7,4,5);
    // Body
    ctx.fillRect(px-6,py-4,12,12);
    // Head
    ctx.fillRect(px-4,py-12,8,9);
    // Antenna
    ctx.fillStyle=C.amber;ctx.fillRect(px-1,py-18,2,7);ctx.fillRect(px-3,py-18,6,2);
    // Eyes
    ctx.fillStyle=C.bg;ctx.fillRect(px-3,py-11,2,2);ctx.fillRect(px+1,py-11,2,2);
    // Mouth smile
    ctx.fillRect(px-2,py-5,1,1);ctx.fillRect(px+1,py-5,1,1);
    ctx.restore();
  }

  function drawPackets() {
    packets.forEach(p=>{
      const pulse=0.6+0.4*Math.sin(p.t);
      const s=7*pulse;
      ctx.save();
      ctx.strokeStyle=C.amber;ctx.lineWidth=2;
      ctx.strokeRect((p.x-s)|0,(p.y-s)|0,s*2,s*2);
      // Inner cross signal
      ctx.fillStyle=C.amber;ctx.globalAlpha=pulse;
      ctx.fillRect((p.x-1)|0,(p.y-4)|0,2,8);
      ctx.fillRect((p.x-4)|0,(p.y-1)|0,8,2);
      // Corner dots
      ctx.fillRect((p.x-s+1)|0,(p.y-s+1)|0,2,2);
      ctx.fillRect((p.x+s-3)|0,(p.y-s+1)|0,2,2);
      ctx.restore();
    });
  }

  function drawEnemies() {
    enemies.forEach(e=>{
      const pulse=0.7+0.3*Math.sin(e.t);
      const s=9;
      ctx.save();
      ctx.fillStyle=C.white;ctx.globalAlpha=pulse;
      // Solid square
      ctx.fillRect((e.x-s)|0,(e.y-s)|0,s*2,s*2);
      // Dark cutout
      ctx.fillStyle=C.bg;ctx.globalAlpha=0.85;
      ctx.fillRect((e.x-s+3)|0,(e.y-s+3)|0,s*2-6,s*2-6);
      // X
      ctx.fillStyle=C.white;ctx.globalAlpha=pulse;
      ctx.fillRect((e.x-1)|0,(e.y-6)|0,2,12);
      ctx.fillRect((e.x-6)|0,(e.y-1)|0,12,2);
      ctx.restore();
    });
  }

  function drawSparks() {
    sparks.forEach(s=>{
      ctx.save();ctx.globalAlpha=s.life*0.85;ctx.fillStyle=s.color;
      ctx.fillRect((s.x-s.sz/2)|0,(s.y-s.sz/2)|0,s.sz,s.sz);ctx.restore();
    });
  }

  function drawPlay() {
    ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
    grid();
    drawPackets();drawEnemies();drawPlayer();drawSparks();
    // Low time warning border
    if(timeLeft<=15&&Math.floor(Date.now()/250)%2===0){
      ctx.save();ctx.strokeStyle=C.white;ctx.lineWidth=3;ctx.strokeRect(1.5,1.5,W-3,H-3);ctx.restore();
    }
    scanlines();
  }

  function drawEndScreen(title, sub1, sub2) {
    ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
    grid();
    // Heavy dither corners
    for(let x=0;x<W*0.25;x+=3) for(let y=0;y<H;y+=3){if(Math.random()<(1-x/(W*0.25))*0.7){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}}
    for(let x=W*0.75;x<W;x+=3) for(let y=0;y<H;y+=3){if(Math.random()<((x-W*0.75)/(W*0.25))*0.7){ctx.fillStyle=C.white;ctx.fillRect(x,y,1,1);}}

    ctx.textAlign='center';
    ctx.fillStyle=C.white;ctx.font='bold 34px monospace';ctx.letterSpacing='3px';
    ctx.fillText(title,W/2,H/2-40);
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='12px monospace';ctx.letterSpacing='1px';
    ctx.fillText(sub1,W/2,H/2-8);
    ctx.fillStyle=C.amber;ctx.font='11px monospace';ctx.letterSpacing='2px';
    ctx.fillText(sub2,W/2,H/2+24);
    ctx.fillStyle=C.amber;ctx.font='12px monospace';
    ctx.fillText('→ HIRE REDA — AUTOMATE YOUR DATA OPS ←',W/2,H/2+60);
    if(Math.floor(Date.now()/600)%2===0){ctx.fillStyle=C.white;ctx.font='10px monospace';ctx.letterSpacing='0';ctx.fillText('[ ENTER OR TAP TO RETRY ]',W/2,H/2+88);}
    scanlines();
  }

  function showEndBtns() {
    const el=document.getElementById('end-btns');
    if(el) el.style.display='flex';
  }

  // Main loop
  function loop(ts) {
    const dt = Math.min((ts-lastTs)/1000, 0.05);
    lastTs=ts;

    if(state==='title') drawTitle(ts);
    else if(state==='play'){update(dt);drawPlay();}
    else if(state==='over') drawEndScreen('SIGNAL LOST','FINAL SCORE: '+score,'NOISE OVERWHELMED THE PIPELINE.');
    else if(state==='win') drawEndScreen('SYSTEMS ONLINE',score+' SIGNALS PROCESSED','PIPELINE INTEGRITY: MAINTAINED.');

    requestAnimationFrame(loop);
  }

  window.replayGame = function() {
    const el=document.getElementById('end-btns');
    if(el) el.style.display='none';
    startGame();
  };
  window.hireReda = function() { location.href='contact.html'; };

  requestAnimationFrame(loop);
})();
