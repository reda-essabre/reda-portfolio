import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const BLUE = 0x38c5e8;
const LIME = 0xd6f17e;
const GLOBE_RADIUS = 1.46;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CITIES = [
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, priority: true },
  { name: 'Milan', country: 'Italy', lat: 45.4642, lon: 9.19, priority: false },
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lon: -6.2603, priority: true },
  { name: 'Manchester', country: 'United Kingdom', lat: 53.4808, lon: -2.2426, priority: false },
  { name: 'London', country: 'United Kingdom', lat: 51.5072, lon: -0.1276, priority: true },
  { name: 'Ottawa', country: 'Canada', lat: 45.4215, lon: -75.6972, priority: true },
  { name: 'Calgary', country: 'Canada', lat: 51.0447, lon: -114.0719, priority: false },
  { name: 'La Paz', country: 'Bolivia', lat: -16.4897, lon: -68.1193, priority: true },
  { name: 'Santa Cruz', country: 'Bolivia', lat: -17.8146, lon: -63.1561, priority: false },
  { name: 'Cochabamba', country: 'Bolivia', lat: -17.3895, lon: -66.1568, priority: false }
];

const CONNECTIONS = [
  [4, 0], [4, 2], [4, 3], [0, 1], [2, 0],
  [4, 5], [0, 5], [5, 6], [5, 7], [6, 7],
  [7, 8], [7, 9], [8, 9], [0, 7]
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

function latLonToVector3(lat, lon, radius = GLOBE_RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function latLonToCanvas(lat, lon, width, height) {
  return {
    x: ((lon + 180) / 360) * width,
    y: ((90 - lat) / 180) * height
  };
}

function drawPolygon(ctx, polygon, width, height, fillStyle, strokeStyle) {
  ctx.beginPath();
  polygon.forEach(([lat, lon], index) => {
    const point = latLonToCanvas(lat, lon, width, height);
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }
}

function makeEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const ocean = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  ocean.addColorStop(0, '#09111d');
  ocean.addColorStop(0.48, '#030812');
  ocean.addColorStop(1, '#02050b');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(canvas.width * 0.42, canvas.height * 0.38, 10, canvas.width * 0.5, canvas.height * 0.52, canvas.width * 0.58);
  glow.addColorStop(0, 'rgba(61,122,255,0.18)');
  glow.addColorStop(0.45, 'rgba(21,53,104,0.1)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(110,160,255,0.07)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  LAND.forEach(shape => drawPolygon(ctx, shape, canvas.width, canvas.height, 'rgba(98,118,146,0.26)', 'rgba(185,214,255,0.08)'));

  for (let i = 0; i < 1200; i++) {
    const x = (i * 173) % canvas.width;
    const y = (i * 97) % canvas.height;
    const alpha = ((i % 7) / 7) * 0.03;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeEmissiveTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const lightClusters = [
    [51.5, -0.1, 24], [48.85, 2.35, 20], [45.46, 9.19, 18], [53.35, -6.26, 14],
    [45.42, -75.69, 18], [43.65, -79.38, 22], [40.71, -74.0, 26], [51.04, -114.07, 14],
    [-16.5, -68.15, 10], [-17.81, -63.15, 11], [-17.39, -66.16, 9], [52.52, 13.4, 15]
  ];

  lightClusters.forEach(([lat, lon, radius], index) => {
    const point = latLonToCanvas(lat, lon, canvas.width, canvas.height);
    const grad = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
    grad.addColorStop(0, index % 3 === 0 ? 'rgba(200,230,255,0.95)' : 'rgba(74,171,255,0.8)');
    grad.addColorStop(0.35, 'rgba(74,171,255,0.22)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.28, 'rgba(128,216,255,0.9)');
  grad.addColorStop(0.55, 'rgba(56,197,232,0.28)');
  grad.addColorStop(1, 'rgba(56,197,232,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function makeAtmosphereMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0x5ad7ff) },
      viewVector: { value: new THREE.Vector3(0, 0, 5) }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform vec3 viewVector;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      void main() {
        vec3 worldNormal = normalize(vNormal);
        vec3 viewDir = normalize(viewVector - vWorldPosition);
        float fresnel = pow(1.0 - max(dot(worldNormal, viewDir), 0.0), 2.6);
        float intensity = fresnel * 0.72;
        gl_FragColor = vec4(glowColor, intensity * 0.55);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

function makeRing(radiusMultiplier, color, start, end, tiltX, tiltZ) {
  const curve = new THREE.EllipseCurve(0, 0, GLOBE_RADIUS * radiusMultiplier, GLOBE_RADIUS * radiusMultiplier, start, end, false, 0);
  const points = curve.getPoints(180).map(p => new THREE.Vector3(p.x, p.y, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 });
  const line = new THREE.Line(geometry, material);
  line.rotation.x = tiltX;
  line.rotation.z = tiltZ;
  return line;
}

function buildRoute(startCity, endCity, color) {
  const start = latLonToVector3(startCity.lat, startCity.lon, GLOBE_RADIUS + 0.02);
  const end = latLonToVector3(endCity.lat, endCity.lon, GLOBE_RADIUS + 0.02);
  const altitude = 0.32 + start.clone().angleTo(end) * 0.22;
  const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS + altitude);
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const geometry = new THREE.TubeGeometry(curve, 90, 0.006, 8, false);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.34,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(geometry, material);

  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xdaf6ff, transparent: true, opacity: 0.92 })
  );
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture(),
    color,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));
  halo.scale.setScalar(0.18);
  pulse.add(halo);

  return {
    curve,
    mesh,
    pulse,
    nodes: new Set([startCity.name, endCity.name]),
    speed: reducedMotion ? 0 : 0.045 + Math.random() * 0.028,
    offset: Math.random(),
    material,
    baseColor: color
  };
}

function projectToScreen(object, camera, width, height) {
  const vector = object.getWorldPosition(new THREE.Vector3()).project(camera);
  return {
    x: (vector.x * 0.5 + 0.5) * width,
    y: (-vector.y * 0.5 + 0.5) * height,
    z: vector.z
  };
}

function createLabelLayer(container) {
  const layer = document.createElement('div');
  layer.className = 'sg-globe-labels';
  container.appendChild(layer);
  return layer;
}

function initGlobe() {
  const container = document.getElementById('sg-globe-stage');
  const tooltip = document.getElementById('sg-tooltip');
  if (!container || !tooltip) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.18, 5.25);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  const labelLayer = createLabelLayer(container);
  const clock = new THREE.Clock();
  const pointer = new THREE.Vector2();
  const pointerTarget = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const hoverTargets = [];
  const labels = [];

  const globeRig = new THREE.Group();
  const globeGroup = new THREE.Group();
  scene.add(globeRig);
  globeRig.add(globeGroup);

  const starGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < 900; i++) {
    const radius = 9 + (i % 11) * 0.08;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    starVertices.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xbfd8ff, size: 0.015, transparent: true, opacity: 0.45 }));
  scene.add(stars);

  scene.add(new THREE.HemisphereLight(0x9bbcff, 0x020406, 0.58));
  const keyLight = new THREE.DirectionalLight(0xa9d7ff, 1.55);
  keyLight.position.set(-2.8, 1.8, 3.6);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x62d5ff, 1.1);
  rimLight.position.set(2.4, -0.4, 2.2);
  scene.add(rimLight);

  const earthTexture = makeEarthTexture();
  const emissiveTexture = makeEmissiveTexture();
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96),
    new THREE.MeshStandardMaterial({
      map: earthTexture,
      emissiveMap: emissiveTexture,
      emissive: new THREE.Color(0x4f9dff),
      emissiveIntensity: 0.45,
      roughness: 0.9,
      metalness: 0.05,
      transparent: true,
      opacity: 0.98
    })
  );
  globeGroup.add(globe);

  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS * 1.045, 80, 80), makeAtmosphereMaterial());
  globeGroup.add(atmosphere);

  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS * 1.005, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x2d72ff, transparent: true, opacity: 0.045, side: THREE.BackSide })
  );
  globeGroup.add(innerGlow);

  const ringsGroup = new THREE.Group();
  ringsGroup.add(makeRing(1.18, BLUE, 3.85, 5.38, 0.26, -0.34));
  ringsGroup.add(makeRing(1.22, LIME, 5.82, 0.54, -0.22, 0.12));
  ringsGroup.add(makeRing(1.27, BLUE, 0.14, 2.16, 0.44, 0.52));
  ringsGroup.add(makeRing(1.27, LIME, 2.72, 3.7, -0.48, -0.16));
  globeRig.add(ringsGroup);

  const routeGroup = new THREE.Group();
  globeGroup.add(routeGroup);
  const routes = CONNECTIONS.map((pair, index) => {
    const route = buildRoute(CITIES[pair[0]], CITIES[pair[1]], index % 4 === 0 ? LIME : BLUE);
    routeGroup.add(route.mesh);
    routeGroup.add(route.pulse);
    return route;
  });

  const glowTexture = makeGlowTexture();
  const nodeGroup = new THREE.Group();
  globeGroup.add(nodeGroup);
  const nodes = CITIES.map(city => {
    const position = latLonToVector3(city.lat, city.lon, GLOBE_RADIUS + 0.02);
    const marker = new THREE.Group();
    marker.position.copy(position);
    marker.lookAt(position.clone().multiplyScalar(2));

    const core = new THREE.Mesh(new THREE.SphereGeometry(0.025, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf4fbff }));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture,
      color: BLUE,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    halo.scale.setScalar(city.priority ? 0.28 : 0.22);

    const hitArea = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    hitArea.userData.city = city;

    marker.add(halo);
    marker.add(core);
    marker.add(hitArea);
    nodeGroup.add(marker);
    hoverTargets.push(hitArea);

    let labelEl = null;
    if (city.priority) {
      labelEl = document.createElement('div');
      labelEl.className = 'sg-globe-label';
      labelEl.textContent = city.name;
      labelLayer.appendChild(labelEl);
      labels.push({ el: labelEl, marker, city });
    }

    return { city, marker, halo, core, hitArea };
  });

  const counts = {
    nodes: document.querySelector('[data-sg-count="nodes"]'),
    connections: document.querySelector('[data-sg-count="connections"]')
  };
  if (counts.nodes) counts.nodes.textContent = String(CITIES.length);
  if (counts.connections) counts.connections.textContent = String(CONNECTIONS.length);

  let hovered = null;

  function updateHover(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(hoverTargets, false)[0];
    hovered = hit ? hit.object.userData.city.name : null;

    if (!hovered) {
      tooltip.classList.remove('visible');
      container.style.cursor = 'default';
      return;
    }

    const node = nodes.find(item => item.city.name === hovered);
    const screen = projectToScreen(node.marker, camera, rect.width, rect.height);
    tooltip.innerHTML = `${node.city.name}<span>${node.city.country}</span>`;
    tooltip.style.left = `${screen.x + 18}px`;
    tooltip.style.top = `${screen.y - 18}px`;
    tooltip.classList.add('visible');
    container.style.cursor = 'pointer';
  }

  function clearHover() {
    hovered = null;
    tooltip.classList.remove('visible');
    container.style.cursor = 'default';
  }

  container.addEventListener('mousemove', event => {
    const rect = container.getBoundingClientRect();
    pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerTarget.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    updateHover(event.clientX, event.clientY);
  });

  container.addEventListener('mouseleave', () => {
    pointerTarget.set(0, 0);
    clearHover();
  });

  container.addEventListener('touchstart', event => {
    const touch = event.touches[0];
    if (!touch) return;
    updateHover(touch.clientX, touch.clientY);
  }, { passive: true });

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function render() {
    const elapsed = clock.getElapsedTime();
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!reducedMotion) globeGroup.rotation.y += 0.0018;
    globeRig.rotation.x = THREE.MathUtils.lerp(globeRig.rotation.x, pointerTarget.y * 0.18, 0.045);
    globeRig.rotation.z = THREE.MathUtils.lerp(globeRig.rotation.z, -pointerTarget.x * 0.18, 0.045);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointerTarget.x * 0.18, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.18 + pointerTarget.y * 0.08, 0.03);
    camera.lookAt(0, 0, 0);

    ringsGroup.rotation.y = elapsed * 0.06;
    ringsGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.04;

    nodes.forEach(node => {
      const active = hovered === node.city.name;
      const linked = hovered ? CONNECTIONS.some(pair => {
        const a = CITIES[pair[0]].name;
        const b = CITIES[pair[1]].name;
        return (a === hovered && b === node.city.name) || (b === hovered && a === node.city.name);
      }) : false;
      node.halo.material.opacity = active ? 0.92 : linked ? 0.75 : node.city.priority ? 0.58 : 0.35;
      const scale = active ? 0.34 : linked ? 0.28 : node.city.priority ? 0.28 : 0.22;
      node.halo.scale.setScalar(scale + Math.sin(elapsed * 2.2 + node.city.lat) * 0.01);
      node.core.scale.setScalar(active ? 1.5 : linked ? 1.2 : 1);
    });

    routes.forEach(route => {
      const pulsePos = route.curve.getPoint((elapsed * route.speed + route.offset) % 1);
      route.pulse.position.copy(pulsePos);
      const active = hovered ? route.nodes.has(hovered) : false;
      route.material.opacity = active ? 0.78 : hovered ? 0.11 : 0.34;
      route.material.color.setHex(active ? 0xeaffff : route.baseColor);
      route.pulse.visible = !reducedMotion;
      route.pulse.scale.setScalar(active ? 1.25 : 1);
    });

    labels.forEach(label => {
      const screen = projectToScreen(label.marker, camera, width, height);
      const visible = screen.z < 1 && screen.z > -1;
      label.el.style.left = `${screen.x}px`;
      label.el.style.top = `${screen.y - 16}px`;
      label.el.classList.toggle('visible', visible);
      label.el.classList.toggle('is-active', hovered === label.city.name);
    });

    if (hovered) {
      const node = nodes.find(item => item.city.name === hovered);
      const screen = projectToScreen(node.marker, camera, width, height);
      tooltip.style.left = `${screen.x + 18}px`;
      tooltip.style.top = `${screen.y - 18}px`;
    }

    atmosphere.material.uniforms.viewVector.value.copy(camera.position);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobe, { once: true });
} else {
  initGlobe();
}