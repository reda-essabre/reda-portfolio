/* ============================================================
   SIGNAL-GLOBE.JS
   Foundation: particle swarm (InstancedMesh + LERP + Bloom)
   Adapted: globe sphere · cities · arcs · hover glow
   ============================================================ */
import * as THREE from 'three';
import { OrbitControls }   from 'three/addons/controls/OrbitControls.js';
import { EffectComposer }  from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ── Config ────────────────────────────────────────────────────
const COUNT      = 15000;
const GLOBE_R    = 20;     // matches provided code's sphere radius
const SPIN_SPEED = 0.3;    // slow auto-rotate

// ── Cities + connections ──────────────────────────────────────
const CITIES = [
  { name: 'Paris',       country: 'FR', lat:  48.85, lon:   2.35 },
  { name: 'Milan',       country: 'IT', lat:  45.46, lon:   9.19 },
  { name: 'Dublin',      country: 'IE', lat:  53.33, lon:  -6.25 },
  { name: 'Manchester',  country: 'UK', lat:  53.48, lon:  -2.24 },
  { name: 'London',      country: 'UK', lat:  51.51, lon:  -0.13 },
  { name: 'Ottawa',      country: 'CA', lat:  45.42, lon: -75.69 },
  { name: 'Calgary',     country: 'CA', lat:  51.05, lon:-114.07 },
  { name: 'La Paz',      country: 'BO', lat: -16.50, lon: -68.15 },
  { name: 'Santa Cruz',  country: 'BO', lat: -17.78, lon: -63.18 },
  { name: 'Cochabamba',  country: 'BO', lat: -17.39, lon: -66.16 },
];

const CONNECTIONS = [
  [4, 0], [4, 2], [4, 3], [0, 1], [2, 0],
  [4, 5], [0, 5], [5, 6], [5, 7], [6, 7],
  [7, 8], [7, 9], [8, 9],
];

// ── Utils ─────────────────────────────────────────────────────
function latLon3(lat, lon, r) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

function greatCircle(lat1, lon1, lat2, lon2, steps, r) {
  const a     = latLon3(lat1, lon1, 1).normalize();
  const b     = latLon3(lat2, lon2, 1).normalize();
  const omega = Math.acos(Math.max(-1, Math.min(1, a.dot(b))));
  const lift  = r + Math.min(omega * 5, 5.5);   // natural arc height
  const sinO  = Math.sin(omega);
  const pts   = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const v = omega < 1e-6
      ? a.clone().lerp(b, t)
      : a.clone().multiplyScalar(Math.sin((1 - t) * omega) / sinO)
           .add(b.clone().multiplyScalar(Math.sin(t * omega) / sinO));
    pts.push(v.normalize().multiplyScalar(r + (lift - r) * Math.sin(t * Math.PI)));
  }
  return pts;
}

// ── Main ──────────────────────────────────────────────────────
const canvas    = document.getElementById('sg-globe-canvas');
const container = canvas && canvas.closest('.sg-map');
if (!canvas || !container) throw new Error('[signal-globe] container not found');

let W = container.clientWidth;
let H = container.clientHeight;

// Scene
const scene = new THREE.Scene();
scene.fog   = new THREE.FogExp2(0x000000, 0.0025);

// Camera
const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 2000);
camera.position.set(0, 0, 65);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias:        true,
  powerPreference: 'high-performance',
});
renderer.setSize(W, H);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping         = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// OrbitControls — slow, drag-only (from provided code)
const controls = new OrbitControls(camera, canvas);
controls.enableDamping   = true;
controls.dampingFactor   = 0.05;
controls.autoRotate      = true;
controls.autoRotateSpeed = SPIN_SPEED;
controls.enableZoom      = false;
controls.enablePan       = false;
controls.minPolarAngle   = Math.PI * 0.18;
controls.maxPolarAngle   = Math.PI * 0.82;

// Post-processing — UnrealBloom (from provided code)
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(W, H), 1.5, 0.4, 0);
bloomPass.strength  = 1.4;
bloomPass.radius    = 0.5;
bloomPass.threshold = 0;
composer.addPass(bloomPass);

// Stars
{
  const N   = 3000;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r     = 300 + Math.random() * 400;
    const phi   = Math.acos(-1 + 2 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi);
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.45, sizeAttenuation: true,
    transparent: true, opacity: 0.55,
  })));
}

// ── Particle swarm (from provided code's foundation) ──────────
// Provided code: TetrahedronGeometry, InstancedMesh, positions[].lerp
const dummy    = new THREE.Object3D();
const pColor   = new THREE.Color();
const pTarget  = new THREE.Vector3();

// Particle start positions — scattered inside a shell
const positions = Array.from({ length: COUNT }, () => {
  const r     = GLOBE_R * (0.7 + Math.random() * 0.8);
  const phi   = Math.acos(-1 + 2 * Math.random());
  const theta = Math.random() * Math.PI * 2;
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
});

// Fibonacci sphere targets (like provided code's healthy sphere)
const goldenAngle = Math.PI * (3 - Math.sqrt(5));
const fibTargets  = Array.from({ length: COUNT }, (_, i) => {
  const y     = 1 - (i / (COUNT - 1)) * 2;
  const r     = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = goldenAngle * i;
  return new THREE.Vector3(
    GLOBE_R * r * Math.cos(theta),
    GLOBE_R * y,
    GLOBE_R * r * Math.sin(theta)
  );
});

const pgeo = new THREE.TetrahedronGeometry(0.18);
const pmat = new THREE.MeshBasicMaterial();
const instancedMesh = new THREE.InstancedMesh(pgeo, pmat, COUNT);
instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
for (let i = 0; i < COUNT; i++) {
  instancedMesh.setColorAt(i, pColor.setHSL(0.56, 0.8, 0.28)); // init
}
scene.add(instancedMesh);

// ── Graticule ─────────────────────────────────────────────────
const gridMat = new THREE.LineBasicMaterial({
  color: 0x0d2232, transparent: true, opacity: 0.6,
});
for (let lat = -60; lat <= 60; lat += 30) {
  const pts = [];
  for (let lon = 0; lon <= 360; lon += 5) pts.push(latLon3(lat, lon - 180, GLOBE_R + 0.15));
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
}
for (let lon = -180; lon < 180; lon += 30) {
  const pts = [];
  for (let lat = -90; lat <= 90; lat += 5) pts.push(latLon3(lat, lon, GLOBE_R + 0.15));
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
}

// ── Arc lines ─────────────────────────────────────────────────
const ARC_STEPS = 80;
const arcPts = CONNECTIONS.map(([i, j]) =>
  greatCircle(CITIES[i].lat, CITIES[i].lon, CITIES[j].lat, CITIES[j].lon, ARC_STEPS, GLOBE_R + 0.4)
);
arcPts.forEach(pts => {
  scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0x38c5e8, transparent: true, opacity: 0.32 })
  ));
});

// ── Arc particles (signal comets) ─────────────────────────────
const arcParticles = CONNECTIONS.flatMap((_, idx) => [
  { pts: arcPts[idx], t: (idx * 0.31) % 1, speed: 0.003  + (idx % 4) * 0.0007, isAmber: true  },
  { pts: arcPts[idx], t: (idx * 0.67) % 1, speed: 0.0022 + (idx % 3) * 0.0009, isAmber: false },
]);
const arcMeshes = arcParticles.map(par => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 6, 6),
    new THREE.MeshBasicMaterial({ color: par.isAmber ? 0xd4a843 : 0x38c5e8, transparent: true })
  );
  scene.add(mesh);
  return { mesh, par };
});

// ── City nodes ────────────────────────────────────────────────
const cityNodes = CITIES.map((city, i) => {
  const pos = latLon3(city.lat, city.lon, GLOBE_R + 0.7);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  core.position.copy(pos);
  scene.add(core);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.7, 0.95, 32),
    new THREE.MeshBasicMaterial({ color: 0xd4a843, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
  );
  ring.position.copy(pos);
  ring.lookAt(pos.clone().multiplyScalar(2)); // face outward
  scene.add(ring);

  return { city, pos, core, ring, phaseOffset: i * 0.85, hovered: false };
});
const cityCoreMeshes = cityNodes.map(c => c.core);

// ── DOM: city labels ──────────────────────────────────────────
const labelContainer = document.getElementById('sgb-labels');
const cityLabels = labelContainer ? CITIES.map((city) => {
  const d = document.createElement('div');
  d.className = 'sgb-label';
  d.style.opacity = '0';
  d.innerHTML =
    `<span class="sgb-label-name">${city.name.toUpperCase()}</span>` +
    `<span class="sgb-label-country">${city.country}</span>`;
  labelContainer.appendChild(d);
  return d;
}) : [];

// ── DOM: city list panel ──────────────────────────────────────
const cityListEl    = document.getElementById('sgb-city-list');
const cityListItems = [];
if (cityListEl) {
  CITIES.forEach((city) => {
    const item = document.createElement('div');
    item.className = 'sgb-city-item';
    item.innerHTML =
      `<span class="sgb-city-dot"></span>` +
      `<span class="sgb-city-name">${city.name}</span>` +
      `<span class="sgb-city-country">${city.country}</span>`;
    cityListEl.appendChild(item);
    cityListItems.push(item);
  });
}

// ── Raycaster for hover ───────────────────────────────────────
const raycaster  = new THREE.Raycaster();
const mouse      = new THREE.Vector2(-9999, -9999);
let   hoveredIdx = -1;

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
  mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
});
canvas.addEventListener('mouseleave', () => mouse.set(-9999, -9999));

// ── Projection helper ─────────────────────────────────────────
const _v = new THREE.Vector3();
function toScreen(worldPos) {
  _v.copy(worldPos).project(camera);
  return { x: (_v.x * 0.5 + 0.5) * W, y: (_v.y * -0.5 + 0.5) * H };
}
function isFacing(worldPos) {
  // City is on visible hemisphere if its direction matches camera direction
  return worldPos.clone().normalize().dot(camera.position.clone().normalize()) > 0.05;
}

// ── Resize ────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  W = container.clientWidth;
  H = container.clientHeight;
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.setSize(W, H);
  composer.setSize(W, H);
  bloomPass.resolution.set(W, H);
});

// ── Animation loop ────────────────────────────────────────────
const startTime = performance.now();

function animate() {
  requestAnimationFrame(animate);
  const time = (performance.now() - startTime) / 1000;

  controls.update();

  // ── SWARM LOGIC (from provided code) ──────────────────────
  for (let i = 0; i < COUNT; i++) {
    pTarget.copy(fibTargets[i]);

    // LERP to target — same pattern as provided code's positions[i].lerp(target, 0.1)
    positions[i].lerp(pTarget, 0.018);

    dummy.position.copy(positions[i]);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);

    // Depth-tinted blue — analogous to provided code's HSL color update
    const depthT = (fibTargets[i].y / GLOBE_R) * 0.5 + 0.5; // 0 → 1
    pColor.setHSL(0.54 + depthT * 0.05, 0.72, 0.20 + depthT * 0.16);
    instancedMesh.setColorAt(i, pColor);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.instanceColor.needsUpdate  = true;

  // ── Hover detection ────────────────────────────────────────
  raycaster.setFromCamera(mouse, camera);
  const hits   = raycaster.intersectObjects(cityCoreMeshes);
  const newHov = hits.length > 0 ? cityCoreMeshes.indexOf(hits[0].object) : -1;

  if (newHov !== hoveredIdx) {
    if (hoveredIdx >= 0) {
      cityNodes[hoveredIdx].hovered = false;
      cityListItems[hoveredIdx] && cityListItems[hoveredIdx].classList.remove('active');
      cityLabels[hoveredIdx]    && cityLabels[hoveredIdx].classList.remove('active');
    }
    hoveredIdx = newHov;
    if (hoveredIdx >= 0) {
      cityNodes[hoveredIdx].hovered = true;
      cityListItems[hoveredIdx] && cityListItems[hoveredIdx].classList.add('active');
      cityLabels[hoveredIdx]    && cityLabels[hoveredIdx].classList.add('active');
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'default';
    }
  }

  // ── City node pulse + hover glow ────────────────────────────
  cityNodes.forEach((cn) => {
    const pulse = Math.sin(time * 1.6 + cn.phaseOffset) * 0.5 + 0.5;
    const hov   = cn.hovered;

    if (hov) {
      // Super-bright core → UnrealBloom makes it burst
      cn.core.material.color.setRGB(4, 4, 4);
      cn.core.scale.setScalar(1.9 + pulse * 0.3);
      cn.ring.material.color.setHex(0x38c5e8);
      cn.ring.material.opacity = 1.0;
      cn.ring.scale.setScalar(1.5 + pulse * 0.45);
    } else {
      cn.core.material.color.setRGB(0.9, 0.9, 0.9);
      cn.core.scale.setScalar(1.0);
      cn.ring.material.color.setHex(0xd4a843);
      cn.ring.material.opacity = 0.42 + pulse * 0.45;
      cn.ring.scale.setScalar(1.0 + pulse * 0.38);
    }
  });

  // ── Arc particle movement ──────────────────────────────────
  arcMeshes.forEach(({ mesh, par }) => {
    par.t = (par.t + par.speed) % 1;
    const fi  = par.t * (par.pts.length - 1);
    const lo  = Math.floor(fi);
    const hi  = Math.min(lo + 1, par.pts.length - 1);
    mesh.position.lerpVectors(par.pts[lo], par.pts[hi], fi - lo);
    const fade = par.t < 0.08  ? par.t / 0.08
               : par.t > 0.92  ? (1 - par.t) / 0.08
               : 1;
    mesh.material.opacity = 0.9 * fade;
  });

  // ── DOM label update ───────────────────────────────────────
  cityLabels.forEach((label, i) => {
    if (!label) return;
    const cn = cityNodes[i];
    if (!isFacing(cn.pos)) { label.style.opacity = '0'; return; }

    const screen = toScreen(cn.pos);
    const depth  = cn.pos.clone().normalize().dot(camera.position.clone().normalize());
    const base   = Math.max(0, (depth - 0.05) * 1.05);
    label.style.opacity = cn.hovered ? '1' : String(Math.min(1, base).toFixed(3));
    label.style.left    = screen.x + 'px';
    label.style.top     = screen.y + 'px';
  });

  composer.render();
}

animate();
