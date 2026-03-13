const CITIES = [
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Milan', country: 'Italy', lat: 45.4642, lon: 9.19 },
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lon: -6.2603 },
  { name: 'Manchester', country: 'United Kingdom', lat: 53.4808, lon: -2.2426 },
  { name: 'London', country: 'United Kingdom', lat: 51.5072, lon: -0.1276 },
  { name: 'Ottawa', country: 'Canada', lat: 45.4215, lon: -75.6972 },
  { name: 'Calgary', country: 'Canada', lat: 51.0447, lon: -114.0719 },
  { name: 'La Paz', country: 'Bolivia', lat: -16.4897, lon: -68.1193 },
  { name: 'Santa Cruz', country: 'Bolivia', lat: -17.8146, lon: -63.1561 },
  { name: 'Cochabamba', country: 'Bolivia', lat: -17.3895, lon: -66.1568 }
];

const CONNECTIONS = [
  [4, 0], [4, 2], [4, 3], [0, 1], [2, 0],
  [4, 5], [0, 5], [5, 6], [5, 7], [6, 7],
  [7, 8], [7, 9], [8, 9], [0, 7]
];

const COUNTRY_LABELS = [
  { text: 'FRANCE', lat: 48.8566, lon: 2.3522 },
  { text: 'ITALY', lat: 45.4642, lon: 9.19 },
  { text: 'IRELAND', lat: 53.3498, lon: -6.2603 },
  { text: 'UK', lat: 52.2, lon: -1.9 },
  { text: 'CANADA', lat: 50.5, lon: -96.0 },
  { text: 'BOLIVIA', lat: -17.2, lon: -65.8 }
];

const LAND = [
  [[71,-141],[68,-136],[60,-140],[58,-136],[56,-130],[52,-128],[50,-124],[48,-124],[45,-124],[42,-124],[38,-122],[36,-122],[34,-120],[32,-117],[28,-110],[24,-110],[22,-105],[22,-97],[25,-97],[28,-97],[30,-94],[29,-90],[30,-88],[28,-87],[26,-82],[25,-80],[25,-77],[27,-80],[30,-81],[33,-79],[36,-76],[38,-75],[40,-74],[41,-72],[42,-70],[44,-66],[47,-53],[52,-55],[58,-62],[60,-64],[63,-78],[68,-82],[70,-86],[70,-92],[70,-100],[70,-120],[70,-130],[71,-141]],
  [[83,-42],[80,-25],[77,-18],[72,-24],[60,-44],[62,-50],[65,-54],[68,-54],[70,-54],[74,-58],[78,-62],[83,-42]],
  [[12,-71],[11,-63],[10,-62],[8,-60],[6,-52],[4,-52],[2,-50],[0,-50],[-2,-48],[-5,-35],[-10,-37],[-15,-39],[-20,-40],[-23,-43],[-26,-48],[-30,-50],[-34,-53],[-38,-58],[-40,-62],[-42,-64],[-50,-69],[-54,-68],[-55,-66],[-54,-64],[-50,-68],[-48,-66],[-45,-65],[-40,-62],[-36,-58],[-30,-50],[-22,-43],[-10,-37],[-3,-40],[2,-50],[8,-60],[10,-62]],
  [[71,28],[70,24],[68,18],[67,14],[65,14],[64,12],[62,6],[60,5],[59,10],[58,6],[57,8],[56,10],[55,9],[54,8],[53,8],[52,4],[51,2],[51,1],[50,2],[48,2],[46,2],[44,2],[43,3],[43,5],[42,3],[41,2],[40,0],[38,-1],[37,-4],[36,-6],[36,-9],[37,-9],[38,-9],[39,-9],[40,-9],[41,-9],[42,-9],[43,-9],[43,-7],[44,-8],[44,0],[46,2],[46,6],[44,8],[44,12],[42,14],[40,14],[38,14],[38,16],[38,20],[36,22],[36,28],[38,28],[40,26],[41,28],[42,28],[43,28],[44,28],[46,30],[47,32],[47,38],[48,36],[50,30],[54,26],[56,20],[58,22],[60,26],[62,28],[65,25],[68,20],[70,24],[71,28]],
  [[58,-5],[57,-6],[56,-6],[55,-6],[54,-5],[53,-5],[52,-5],[51,-5],[51,-3],[51,0],[51,1],[52,2],[53,0],[53,0],[54,0],[56,0],[58,-2],[58,-5]],
  [[55,-6],[54,-8],[52,-10],[52,-8],[53,-6],[55,-6]],
  [[37,10],[36,10],[33,12],[30,32],[28,34],[22,37],[18,40],[12,43],[10,42],[8,44],[11,44],[12,44],[8,44],[4,42],[0,42],[-4,40],[-10,40],[-18,36],[-26,33],[-30,30],[-34,26],[-34,22],[-32,18],[-28,17],[-22,14],[-17,12],[-10,14],[-4,10],[-1,9],[4,8],[8,12],[10,14],[14,14],[16,14],[22,14],[26,14],[30,32],[37,10]],
  [[70,30],[68,40],[65,60],[62,75],[60,90],[58,100],[56,120],[55,130],[52,140],[50,140],[48,136],[44,132],[40,140],[38,142],[36,138],[32,130],[28,122],[24,120],[22,114],[18,110],[14,108],[10,105],[6,104],[2,104],[0,104],[0,108],[4,108],[6,116],[-4,116],[-8,115],[-8,118],[0,110],[6,100],[10,100],[14,98],[16,94],[18,92],[20,90],[22,88],[22,80],[20,74],[18,74],[14,74],[10,76],[8,77],[10,78],[14,78],[18,74],[22,74],[22,68],[24,62],[26,56],[28,50],[30,48],[32,44],[34,40],[36,36],[38,36],[40,40],[42,36],[44,38],[46,34],[46,30],[48,34],[50,36],[52,42],[54,38],[56,36],[58,36],[60,44],[62,50],[65,60],[68,40],[70,30]]
];

function greatCircle(lat1, lon1, lat2, lon2, steps) {
  const toRad = x => x * Math.PI / 180;
  const a1 = toRad(lat1), b1 = toRad(lon1);
  const a2 = toRad(lat2), b2 = toRad(lon2);
  const v1 = [Math.cos(a1) * Math.cos(b1), Math.cos(a1) * Math.sin(b1), Math.sin(a1)];
  const v2 = [Math.cos(a2) * Math.cos(b2), Math.cos(a2) * Math.sin(b2), Math.sin(a2)];
  const dot = Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]));
  const angle = Math.acos(dot);
  if (angle < 0.0001) return [[lat1, lon1]];
  const sinA = Math.sin(angle);
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const wa = Math.sin((1 - t) * angle) / sinA;
    const wb = Math.sin(t * angle) / sinA;
    const x = wa * v1[0] + wb * v2[0];
    const y = wa * v1[1] + wb * v2[1];
    const z = wa * v1[2] + wb * v2[2];
    pts.push([
      Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI,
      Math.atan2(y, x) * 180 / Math.PI
    ]);
  }
  return pts;
}

function initPixelGlobe() {
  const stage = document.getElementById('sg-globe-stage');
  const tooltip = document.getElementById('sg-tooltip');
  if (!stage || !tooltip) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  stage.appendChild(canvas);

  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');
  bctx.imageSmoothingEnabled = false;

  const labelsLayer = document.createElement('div');
  labelsLayer.className = 'sg-globe-labels';
  stage.appendChild(labelsLayer);

  const labelEls = COUNTRY_LABELS.map(label => {
    const el = document.createElement('div');
    el.className = 'sg-globe-label';
    el.textContent = label.text;
    labelsLayer.appendChild(el);
    return { ...label, el };
  });

  const routeData = CONNECTIONS.map((pair, index) => ({
    pair,
    points: greatCircle(CITIES[pair[0]].lat, CITIES[pair[0]].lon, CITIES[pair[1]].lat, CITIES[pair[1]].lon, 72),
    speed: 0.0017 + (index % 4) * 0.00035,
    offset: index * 0.13
  }));

  let displayW = 0;
  let displayH = 0;
  let rotLon = -28;
  const rotLat = 18;
  let globeR = 0;
  let globeCX = 0;
  let globeCY = 0;
  let hoveredCity = -1;
  let projectedCities = [];
  const pointer = { x: 0, y: 0, active: false };

  function resize() {
    displayW = stage.clientWidth;
    displayH = stage.clientHeight;
    canvas.width = displayW;
    canvas.height = displayH;
    buffer.width = Math.max(240, Math.round(displayW / 4));
    buffer.height = Math.max(180, Math.round(displayH / 4));
  }

  function ortho(lat, lon) {
    const phi = lat * Math.PI / 180;
    const lambda = (lon - rotLon) * Math.PI / 180;
    const phi0 = rotLat * Math.PI / 180;
    const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda);
    if (cosC < 0) return null;
    return {
      x: globeCX + globeR * Math.cos(phi) * Math.sin(lambda),
      y: globeCY - globeR * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda)),
      depth: cosC
    };
  }

  function drawBackground(time) {
    bctx.fillStyle = '#000';
    bctx.fillRect(0, 0, buffer.width, buffer.height);

    bctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let y = 0; y < buffer.height; y += 5) {
      for (let x = (y % 10 === 0 ? 0 : 2); x < buffer.width; x += 5) {
        bctx.fillRect(x, y, 1, 1);
      }
    }

    const halo = bctx.createRadialGradient(globeCX, globeCY, globeR * 0.3, globeCX, globeCY, globeR * 1.45);
    halo.addColorStop(0, 'rgba(56,197,232,0.18)');
    halo.addColorStop(0.5, 'rgba(56,197,232,0.06)');
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    bctx.fillStyle = halo;
    bctx.beginPath();
    bctx.arc(globeCX, globeCY, globeR * 1.45, 0, Math.PI * 2);
    bctx.fill();

    const sweepY = (time * 0.02) % buffer.height;
    bctx.fillStyle = 'rgba(255,255,255,0.05)';
    bctx.fillRect(0, Math.floor(sweepY), buffer.width, 1);
  }

  function drawRings() {
    bctx.strokeStyle = 'rgba(56,197,232,0.55)';
    bctx.lineWidth = 1;
    bctx.beginPath();
    bctx.arc(globeCX, globeCY, globeR * 1.18, Math.PI * 0.16, Math.PI * 0.62);
    bctx.stroke();

    bctx.strokeStyle = 'rgba(212,168,67,0.55)';
    bctx.beginPath();
    bctx.arc(globeCX, globeCY, globeR * 1.24, Math.PI * 0.86, Math.PI * 1.34);
    bctx.stroke();

    bctx.strokeStyle = 'rgba(56,197,232,0.36)';
    bctx.beginPath();
    bctx.arc(globeCX, globeCY, globeR * 1.28, Math.PI * 1.08, Math.PI * 1.68);
    bctx.stroke();
  }

  function drawSphere() {
    bctx.save();
    bctx.beginPath();
    bctx.arc(globeCX, globeCY, globeR, 0, Math.PI * 2);
    bctx.clip();

    const ocean = bctx.createRadialGradient(globeCX - globeR * 0.22, globeCY - globeR * 0.26, 4, globeCX, globeCY, globeR);
    ocean.addColorStop(0, 'rgba(20,34,58,1)');
    ocean.addColorStop(0.55, 'rgba(5,10,20,1)');
    ocean.addColorStop(1, 'rgba(2,4,8,1)');
    bctx.fillStyle = ocean;
    bctx.fillRect(globeCX - globeR, globeCY - globeR, globeR * 2, globeR * 2);

    bctx.strokeStyle = 'rgba(255,255,255,0.08)';
    bctx.lineWidth = 1;
    for (let lat = -60; lat <= 90; lat += 30) {
      bctx.beginPath();
      let first = true;
      for (let lon = -180; lon <= 180; lon += 4) {
        const p = ortho(lat, lon);
        if (!p) { first = true; continue; }
        const px = Math.round(p.x);
        const py = Math.round(p.y);
        if (first) bctx.moveTo(px, py);
        else bctx.lineTo(px, py);
        first = false;
      }
      bctx.stroke();
    }

    for (let lon = -180; lon < 180; lon += 30) {
      bctx.beginPath();
      let first = true;
      for (let lat = -90; lat <= 90; lat += 4) {
        const p = ortho(lat, lon);
        if (!p) { first = true; continue; }
        const px = Math.round(p.x);
        const py = Math.round(p.y);
        if (first) bctx.moveTo(px, py);
        else bctx.lineTo(px, py);
        first = false;
      }
      bctx.stroke();
    }

    LAND.forEach(shape => {
      bctx.beginPath();
      let started = false;
      shape.forEach(([lat, lon]) => {
        const p = ortho(lat, lon);
        if (!p) { started = false; return; }
        const px = Math.round(p.x);
        const py = Math.round(p.y);
        if (!started) {
          bctx.moveTo(px, py);
          started = true;
        } else {
          bctx.lineTo(px, py);
        }
      });
      bctx.closePath();
      bctx.fillStyle = 'rgba(220,228,245,0.18)';
      bctx.fill();
      bctx.strokeStyle = 'rgba(255,255,255,0.16)';
      bctx.stroke();
    });

    bctx.restore();

    bctx.strokeStyle = 'rgba(56,197,232,0.24)';
    bctx.lineWidth = 1;
    bctx.beginPath();
    bctx.arc(globeCX, globeCY, globeR, 0, Math.PI * 2);
    bctx.stroke();
  }

  function drawRoutes(time) {
    routeData.forEach((route, routeIndex) => {
      const active = hoveredCity >= 0 && route.pair.includes(hoveredCity);
      bctx.strokeStyle = active ? 'rgba(255,255,255,0.9)' : 'rgba(56,197,232,0.42)';
      bctx.lineWidth = 1;
      bctx.beginPath();
      let first = true;
      route.points.forEach(([lat, lon]) => {
        const p = ortho(lat, lon);
        if (!p) { first = true; return; }
        const px = Math.round(p.x);
        const py = Math.round(p.y);
        if (first) bctx.moveTo(px, py);
        else bctx.lineTo(px, py);
        first = false;
      });
      bctx.stroke();

      const packetIndex = Math.floor(((time * route.speed + route.offset) % 1) * route.points.length);
      const packet = route.points[packetIndex];
      const pp = ortho(packet[0], packet[1]);
      if (pp) {
        bctx.fillStyle = active ? '#ffffff' : '#38c5e8';
        bctx.fillRect(Math.round(pp.x) - 1, Math.round(pp.y) - 1, 3, 3);
      }

      if (routeIndex % 3 === 0 && pp) {
        bctx.fillStyle = 'rgba(212,168,67,0.9)';
        bctx.fillRect(Math.round(pp.x) + 3, Math.round(pp.y), 1, 1);
      }
    });
  }

  function drawNodes(time) {
    projectedCities = CITIES.map(city => {
      const p = ortho(city.lat, city.lon);
      return p ? { ...p, city } : null;
    });

    projectedCities.forEach((point, index) => {
      if (!point) return;
      const active = index === hoveredCity;
      const pulse = 1 + Math.sin(time * 0.003 + index) * 0.3;
      const size = active ? 5 : 3;
      const x = Math.round(point.x);
      const y = Math.round(point.y);

      bctx.fillStyle = active ? 'rgba(255,255,255,0.35)' : 'rgba(56,197,232,0.22)';
      bctx.fillRect(x - Math.round(3 * pulse), y - Math.round(3 * pulse), Math.round(6 * pulse), Math.round(6 * pulse));
      bctx.fillStyle = '#ffffff';
      bctx.fillRect(x - 1, y - 1, size, size);
      if (active) {
        bctx.strokeStyle = 'rgba(212,168,67,0.95)';
        bctx.strokeRect(x - 4, y - 4, 9, 9);
      }
    });
  }

  function updateLabels() {
    const scaleX = displayW / buffer.width;
    const scaleY = displayH / buffer.height;
    labelEls.forEach(label => {
      const p = ortho(label.lat, label.lon);
      if (!p || p.depth < 0.18) {
        label.el.classList.remove('visible', 'is-active');
        return;
      }
      label.el.style.left = `${Math.round(p.x * scaleX)}px`;
      label.el.style.top = `${Math.round(p.y * scaleY) - 18}px`;
      label.el.classList.add('visible');
      const active = hoveredCity >= 0 && CITIES[hoveredCity].country.toUpperCase().includes(label.text.replace('UK', 'UNITED KINGDOM'));
      label.el.classList.toggle('is-active', active);
    });
  }

  function paint(time) {
    globeR = Math.min(buffer.width * 0.23, buffer.height * 0.35);
    globeCX = buffer.width * 0.52;
    globeCY = buffer.height * 0.52;
    rotLon += 0.035;

    drawBackground(time);
    drawRings();
    drawSphere();
    drawRoutes(time);
    drawNodes(time);

    ctx.clearRect(0, 0, displayW, displayH);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(buffer, 0, 0, displayW, displayH);
    updateLabels();
    requestAnimationFrame(paint);
  }

  function updateHover(clientX, clientY) {
    const rect = stage.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const scaleX = buffer.width / displayW;
    const scaleY = buffer.height / displayH;
    const bx = x * scaleX;
    const by = y * scaleY;

    let found = -1;
    projectedCities.forEach((point, index) => {
      if (!point) return;
      if (Math.hypot(point.x - bx, point.y - by) < 8) found = index;
    });
    hoveredCity = found;

    if (found === -1) {
      tooltip.classList.remove('visible');
      stage.style.cursor = 'default';
      return;
    }

    const city = CITIES[found];
    tooltip.innerHTML = `${city.country}<span>${city.name}</span>`;
    tooltip.style.left = `${x + 16}px`;
    tooltip.style.top = `${y - 42}px`;
    tooltip.classList.add('visible');
    stage.style.cursor = 'pointer';
  }

  stage.addEventListener('mousemove', e => updateHover(e.clientX, e.clientY));
  stage.addEventListener('mouseleave', () => {
    hoveredCity = -1;
    tooltip.classList.remove('visible');
    stage.style.cursor = 'default';
  });
  stage.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    if (touch) updateHover(touch.clientX, touch.clientY);
  }, { passive: true });

  const connectionsEl = document.querySelector('[data-sg-count="connections"]');
  if (connectionsEl) connectionsEl.textContent = String(CONNECTIONS.length);

  resize();
  window.addEventListener('resize', resize, { passive: true });
  requestAnimationFrame(paint);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPixelGlobe, { once: true });
} else {
  initPixelGlobe();
}