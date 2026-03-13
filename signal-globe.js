/* ============================================================
   SIGNAL-GLOBE.JS — Three.js Premium 3D Globe
   Adapted for .sg-map section — no full-page takeover.
   Cities: Paris · Milan · Dublin · Manchester · London ·
           Ottawa · Calgary · La Paz · Santa Cruz · Cochabamba
   ============================================================ */
(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('[signal-globe] Three.js not loaded.');
    return;
  }

  // ============================================================
  // CONFIG
  // ============================================================
  const GLOBE_R   = 1.0;
  const FIB_N     = 8000;   // Fibonacci sphere particles
  const ROT_SPEED = 0.0012; // rad/frame auto-rotate (horizontal)

  // ============================================================
  // DATA
  // ============================================================
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

  // ============================================================
  // UTILITIES
  // ============================================================

  /** Lat/lon (degrees) → THREE.Vector3 on sphere of radius r */
  function latLon3(lat, lon, r) {
    const phi   = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta)
    );
  }

  /**
   * Great-circle arc between two cities.
   * Returns array of THREE.Vector3 lifted slightly above surface.
   * Arc height is proportional to chord distance (natural curve).
   */
  function greatCircleArc(lat1, lon1, lat2, lon2, steps) {
    const a    = latLon3(lat1, lon1, 1).normalize();
    const b    = latLon3(lat2, lon2, 1).normalize();
    const lift = Math.max(0.06, a.distanceTo(b) * 0.15); // max ~0.25 lift
    const pts  = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;

      // Slerp
      let dot = a.dot(b);
      dot = Math.max(-1, Math.min(1, dot));
      const omega = Math.acos(dot);

      let v;
      if (omega < 1e-6) {
        v = a.clone().lerp(b, t);
      } else {
        v = a.clone().multiplyScalar(Math.sin((1 - t) * omega) / Math.sin(omega))
             .add(b.clone().multiplyScalar(Math.sin(t * omega) / Math.sin(omega)));
      }

      // Lift peaks at t=0.5
      const height = GLOBE_R + lift * Math.sin(t * Math.PI);
      pts.push(v.normalize().multiplyScalar(height));
    }
    return pts;
  }

  // ============================================================
  // MAIN INIT
  // ============================================================
  function init() {
    const canvas    = document.getElementById('sg-globe-canvas');
    const container = canvas && canvas.closest('.sg-map');
    if (!canvas || !container) return;

    let W = container.clientWidth;
    let H = container.clientHeight;

    // ── Renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping      = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // ── Scene + Camera ─────────────────────────────────────────
    const scene  = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.z = 2.85;

    // ── Lights ────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.12));

    const keyLight = new THREE.DirectionalLight(0x88ccff, 1.0);
    keyLight.position.set(3, 2, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38c5e8, 0.5);
    rimLight.position.set(-3, -1, -2);
    scene.add(rimLight);

    // ── Stars ─────────────────────────────────────────────────
    {
      const N   = 3500;
      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const r     = 28 + Math.random() * 32;
        const phi   = Math.acos(-1 + 2 * Math.random());
        const theta = Math.random() * Math.PI * 2;
        pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.cos(phi);
        pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        // Slight blue/white variance
        const warm = Math.random();
        col[i * 3]     = 0.7 + warm * 0.3;
        col[i * 3 + 1] = 0.8 + warm * 0.1;
        col[i * 3 + 2] = 1.0;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.06, sizeAttenuation: true,
        vertexColors: true,
        transparent: true, opacity: 0.7,
      })));
    }

    // ── Globe pivot (all globe objects rotate together) ────────
    const globePivot = new THREE.Group();
    scene.add(globePivot);

    // ── Fibonacci particle sphere ──────────────────────────────
    {
      const pos = new Float32Array(FIB_N * 3);
      const col = new Float32Array(FIB_N * 3);
      const ga  = Math.PI * (3 - Math.sqrt(5)); // golden angle

      for (let i = 0; i < FIB_N; i++) {
        const y     = 1 - (i / (FIB_N - 1)) * 2;
        const r     = Math.sqrt(1 - y * y);
        const theta = ga * i;

        pos[i * 3]     = GLOBE_R * r * Math.cos(theta);
        pos[i * 3 + 1] = GLOBE_R * y;
        pos[i * 3 + 2] = GLOBE_R * r * Math.sin(theta);

        // Deep blue base with subtle brightness variation
        const b = 0.14 + Math.random() * 0.18;
        col[i * 3]     = b * 0.30; // R
        col[i * 3 + 1] = b * 0.72; // G
        col[i * 3 + 2] = b * 1.00; // B
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
      globePivot.add(new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.0075, vertexColors: true,
        sizeAttenuation: true,
        transparent: true, opacity: 0.88,
      })));
    }

    // ── Atmosphere glow (slightly larger back-face sphere) ─────
    {
      const geo = new THREE.SphereGeometry(GLOBE_R * 1.10, 32, 32);
      const mat = new THREE.MeshPhongMaterial({
        color:       0x38c5e8,
        emissive:    0x112233,
        transparent: true,
        opacity:     0.055,
        side:        THREE.BackSide,
        depthWrite:  false,
      });
      scene.add(new THREE.Mesh(geo, mat)); // not in pivot — stays fixed
    }

    // Second, softer atmosphere ring
    {
      const geo = new THREE.SphereGeometry(GLOBE_R * 1.18, 32, 32);
      const mat = new THREE.MeshPhongMaterial({
        color:       0x38c5e8,
        transparent: true,
        opacity:     0.018,
        side:        THREE.BackSide,
        depthWrite:  false,
      });
      scene.add(new THREE.Mesh(geo, mat));
    }

    // ── Graticule (lat/lon grid on surface) ────────────────────
    {
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x1a3a4a, transparent: true, opacity: 0.35,
      });

      // Latitude lines every 30°
      for (let lat = -60; lat <= 60; lat += 30) {
        const pts = [];
        for (let lon = 0; lon <= 360; lon += 4) {
          pts.push(latLon3(lat, lon - 180, GLOBE_R + 0.001));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        globePivot.add(new THREE.Line(geo, lineMat));
      }

      // Longitude lines every 30°
      for (let lon = -180; lon < 180; lon += 30) {
        const pts = [];
        for (let lat = -90; lat <= 90; lat += 4) {
          pts.push(latLon3(lat, lon, GLOBE_R + 0.001));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        globePivot.add(new THREE.Line(geo, lineMat));
      }
    }

    // ── Great-circle arc lines ─────────────────────────────────
    const ARC_STEPS = 80;
    const arcPtSets = CONNECTIONS.map(([i, j]) =>
      greatCircleArc(
        CITIES[i].lat, CITIES[i].lon,
        CITIES[j].lat, CITIES[j].lon,
        ARC_STEPS
      )
    );

    arcPtSets.forEach(pts => {
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0x38c5e8, transparent: true, opacity: 0.38,
      });
      globePivot.add(new THREE.Line(geo, mat));
    });

    // ── Arc particles (signal comets) ──────────────────────────
    const particles = CONNECTIONS.map(([, ], idx) => {
      const pts = arcPtSets[idx];
      return [
        {
          pts,
          t:       (idx * 0.31) % 1,
          speed:   0.0025 + (idx % 4) * 0.0008,
          isAmber: true,
        },
        {
          pts,
          t:       (idx * 0.67) % 1,
          speed:   0.0018 + (idx % 3) * 0.0010,
          isAmber: false,
        },
      ];
    }).flat();

    const particleMeshes = particles.map(par => {
      const geo  = new THREE.SphereGeometry(0.009, 6, 6);
      const mat  = new THREE.MeshBasicMaterial({
        color:       par.isAmber ? 0xd4a843 : 0x38c5e8,
        transparent: true,
        opacity:     0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      globePivot.add(mesh);
      return { mesh, par };
    });

    // ── City nodes ─────────────────────────────────────────────
    const cityNodes = CITIES.map((city, idx) => {
      const pos = latLon3(city.lat, city.lon, GLOBE_R + 0.012);

      // White core dot
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core    = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), coreMat);
      core.position.copy(pos);
      globePivot.add(core);

      // Amber ring — faces outward
      const ringMat = new THREE.MeshBasicMaterial({
        color:       0xd4a843,
        transparent: true,
        opacity:     0.75,
        side:        THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.026, 0.036, 24), ringMat);
      ring.position.copy(pos);
      ring.lookAt(pos.clone().multiplyScalar(2));
      globePivot.add(ring);

      return { core, ring, pos: pos.clone(), phaseOffset: idx * 0.85 };
    });

    // ── DOM City Labels ────────────────────────────────────────
    const labelContainer = document.getElementById('sgb-labels');
    const cityLabels = labelContainer
      ? CITIES.map((city, i) => {
          const d = document.createElement('div');
          d.className  = 'sgb-label';
          d.style.opacity = '0';
          d.innerHTML  =
            `<span class="sgb-label-name">${city.name.toUpperCase()}</span>` +
            `<span class="sgb-label-country">${city.country}</span>`;
          labelContainer.appendChild(d);
          return d;
        })
      : [];

    // ── City panel list ────────────────────────────────────────
    const cityListEl = document.getElementById('sgb-city-list');
    if (cityListEl) {
      CITIES.forEach(city => {
        const item = document.createElement('div');
        item.className = 'sgb-city-item';
        item.innerHTML =
          `<span class="sgb-city-dot"></span>` +
          `<span class="sgb-city-name">${city.name}</span>`;
        cityListEl.appendChild(item);
      });
    }

    // ── Drag / touch interaction ───────────────────────────────
    let isDragging = false;
    let prevMX = 0, prevMY = 0;
    let velX = 0, velY = ROT_SPEED;
    let rotX = 0.25; // initial tilt

    canvas.style.cursor = 'grab';

    canvas.addEventListener('mousedown', e => {
      isDragging = true;
      prevMX = e.clientX; prevMY = e.clientY;
      velX = velY = 0;
      canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - prevMX;
      const dy = e.clientY - prevMY;
      velY = dx * 0.005;
      velX = dy * 0.005;
      prevMX = e.clientX; prevMY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('touchstart', e => {
      isDragging = true;
      prevMX = e.touches[0].clientX;
      prevMY = e.touches[0].clientY;
      velX = velY = 0;
    }, { passive: true });

    canvas.addEventListener('touchmove', e => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - prevMX;
      const dy = e.touches[0].clientY - prevMY;
      velY = dx * 0.005;
      velX = dy * 0.005;
      prevMX = e.touches[0].clientX;
      prevMY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    // ── Resize ─────────────────────────────────────────────────
    function onResize() {
      W = container.clientWidth;
      H = container.clientHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    // ── Project 3D → 2D screen position ───────────────────────
    const _v = new THREE.Vector3();

    function toScreen(localPos) {
      _v.copy(localPos);
      globePivot.localToWorld(_v);
      _v.project(camera);
      return {
        x: (_v.x *  0.5 + 0.5) * W,
        y: (_v.y * -0.5 + 0.5) * H,
        wz: _v.z,   // < 1 means in front of camera
      };
    }

    /** Is a city node on the visible (front) hemisphere? */
    function isVisible(localPos) {
      _v.copy(localPos);
      globePivot.localToWorld(_v);
      // Camera direction from globe center = camera.position normalized (camera on +Z)
      const camDir = camera.position.clone().normalize();
      return _v.clone().normalize().dot(camDir) > 0.05;
    }

    // ── Animation loop ─────────────────────────────────────────
    let frameId;
    let rotY = 0;

    function animate() {
      frameId = requestAnimationFrame(animate);

      // Auto-rotate + inertia
      if (!isDragging) {
        velX *= 0.90;
        velY  = velY * 0.90 + ROT_SPEED;
      }
      rotX = Math.max(-1.0, Math.min(1.0, rotX + velX));
      rotY += velY;

      globePivot.rotation.x = rotX;
      globePivot.rotation.y = rotY;

      const t = performance.now() * 0.001;

      // City ring pulse
      cityNodes.forEach((cn, i) => {
        const pulse = Math.sin(t * 1.6 + cn.phaseOffset) * 0.5 + 0.5;
        cn.ring.scale.setScalar(1 + pulse * 0.45);
        cn.ring.material.opacity = 0.35 + pulse * 0.55;
      });

      // Arc particle movement
      particleMeshes.forEach(({ mesh, par }) => {
        par.t = (par.t + par.speed) % 1;
        const fIdx  = par.t * (par.pts.length - 1);
        const lo    = Math.floor(fIdx);
        const hi    = Math.min(lo + 1, par.pts.length - 1);
        const frac  = fIdx - lo;
        mesh.position.lerpVectors(par.pts[lo], par.pts[hi], frac);

        // Fade at arc endpoints
        const fade = par.t < 0.08  ? par.t / 0.08
                   : par.t > 0.92  ? (1 - par.t) / 0.08
                   : 1;
        mesh.material.opacity = 0.92 * fade;

        // Hide if behind globe
        mesh.visible = isVisible(mesh.position);
      });

      // DOM label positions
      cityLabels.forEach((label, i) => {
        if (!label) return;
        const cn  = cityNodes[i];
        const vis = isVisible(cn.pos);

        if (!vis) {
          label.style.opacity = '0';
          return;
        }

        const screen = toScreen(cn.pos);

        // Depth-based opacity (cities at globe center of view are brightest)
        _v.copy(cn.pos);
        globePivot.localToWorld(_v);
        const depth = Math.max(0, _v.clone().normalize().dot(camera.position.clone().normalize()));
        const opacity = Math.max(0, (depth - 0.05) / 0.95);

        label.style.opacity   = String(opacity.toFixed(3));
        label.style.left      = screen.x + 'px';
        label.style.top       = screen.y + 'px';
      });

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('beforeunload', () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
    });
  }

  // ── Boot ────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
