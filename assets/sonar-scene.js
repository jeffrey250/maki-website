/* sonar-scene.js – MĀKI complete pond survey animation
   USV: multibeam sonar inside pond → hard bottom bathymetry + sludge depth
   UAV: photogrammetry of surrounding land → terrain model of banks & edges
   Photogrammetry cannot map water surface — drone stays over land only
*/
(function () {
  'use strict';

  window.initSonarScene = function (canvas) {

    // ── Renderer ────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020e1c);
    scene.fog = new THREE.FogExp2(0x020e1c, 0.022);

    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
    camera.position.set(0, 21, 29);
    camera.lookAt(0, -1, -3);

    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(canvas);

    // ── Lights ──────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x336688, 2.2));
    const sun = new THREE.DirectionalLight(0xaaccff, 1.8);
    sun.position.set(8, 16, 10);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x224466, 0.8);
    fill.position.set(-6, 8, -10);
    scene.add(fill);
    // Under-water fill to illuminate pond floor
    const underwater = new THREE.DirectionalLight(0x00AAFF, 0.6);
    underwater.position.set(0, -5, 0);
    scene.add(underwater);

    // ── Terrain constants ────────────────────────────────────────────
    const BW = 32, BD = 32, SEGS = 54;
    const vCount = (SEGS + 1) * (SEGS + 1); // 55x55 = 3025

    // Pond ellipse (semi-axes in world units)
    const PA = 9.5, PB = 7.8;

    // ── Shared vertex positions ──────────────────────────────────────
    function buildGeo() {
      const g = new THREE.PlaneGeometry(BW, BD, SEGS, SEGS);
      g.rotateX(-Math.PI / 2);
      return g;
    }

    const refGeo = buildGeo();
    const refPos = refGeo.attributes.position;
    const vx = new Float32Array(vCount);
    const vz = new Float32Array(vCount);
    const isPond = new Uint8Array(vCount);  // 1 = inside pond, 0 = land

    for (let i = 0; i < vCount; i++) {
      vx[i] = refPos.getX(i);
      vz[i] = refPos.getZ(i);
      isPond[i] = ((vx[i] / PA) ** 2 + (vz[i] / PB) ** 2 <= 1.0) ? 1 : 0;
    }
    refGeo.dispose();

    // ── Height generation ────────────────────────────────────────────
    function fbm(x, z, sc, oct) {
      let v = 0, a = 1.0;
      for (let o = 0; o < oct; o++, sc *= 1.85, a *= 0.5)
        v += (Math.sin(x * sc + o * 2.1) * Math.cos(z * sc * 0.75 + o * 1.7)) * a;
      return v;
    }

    const hardH   = new Float32Array(vCount);  // pond floor (negative Y)
    const sludgeH = new Float32Array(vCount);  // sludge top (negative Y, above hardH)
    const landH   = new Float32Array(vCount);  // surrounding terrain (positive Y)

    for (let i = 0; i < vCount; i++) {
      const x = vx[i], z = vz[i];
      if (isPond[i]) {
        const r = Math.sqrt((x / PA) ** 2 + (z / PB) ** 2);
        const depth = 3.2 - r * 0.5 + fbm(x, z, 0.32, 3) * 0.55;
        hardH[i]   = -(Math.max(1.2, depth));
        const sludgeThick = 0.45 + Math.max(0, fbm(x, z, 0.52, 2)) * 0.55;
        sludgeH[i] = hardH[i] + sludgeThick;
      } else {
        const d   = Math.sqrt((x / PA) ** 2 + (z / PB) ** 2);
        const rim = Math.max(0, d - 1.0);
        landH[i]  = Math.max(0.25, 0.35 + rim * 0.9 + fbm(x, z, 0.26, 3) * 0.65);
      }
    }

    // ── Reveal state ─────────────────────────────────────────────────
    const bedRev    = new Float32Array(vCount);   // USV reveals pond floor
    const sludgeRev = new Float32Array(vCount);   // lags behind bedRev
    const landRev   = new Float32Array(vCount);   // drone reveals surrounding land

    // ── Pond floor (hard bottom) mesh ────────────────────────────────
    const bedGeo  = buildGeo();
    const bPos    = bedGeo.attributes.position;
    const bedCols = new Float32Array(vCount * 3);
    for (let i = 0; i < vCount; i++) {
      bPos.setY(i, -15);
      const d = Math.abs(hardH[i]);
      const t = Math.min(1, (d - 1.0) / 3.0);
      // Vivid teal-blue gradient (shallow=bright cyan, deep=deep teal)
      bedCols[i*3+0] = 0.08 + t * 0.05;
      bedCols[i*3+1] = 0.72 - t * 0.18;
      bedCols[i*3+2] = 0.90 + t * 0.08;
    }
    bedGeo.setAttribute('color', new THREE.BufferAttribute(bedCols, 3));
    const bedMat  = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0 });
    scene.add(new THREE.Mesh(bedGeo, bedMat));

    // Wireframe overlay for bed
    const bWireGeo = buildGeo();
    const bWirePos = bWireGeo.attributes.position;
    for (let i = 0; i < vCount; i++) bWirePos.setY(i, -15);
    const bWireMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, wireframe: true, transparent: true, opacity: 0 });
    scene.add(new THREE.Mesh(bWireGeo, bWireMat));

    // ── Sludge mesh ──────────────────────────────────────────────────
    const sludgeGeo  = buildGeo();
    const sPos       = sludgeGeo.attributes.position;
    const sludgeCols = new Float32Array(vCount * 3);
    for (let i = 0; i < vCount; i++) {
      sPos.setY(i, -15);
      // Rich amber-brown sludge, clearly distinct from teal bed
      const v = Math.random() * 0.15;
      sludgeCols[i*3+0] = 0.88 + v * 0.1;
      sludgeCols[i*3+1] = 0.50 + v * 0.3;
      sludgeCols[i*3+2] = 0.04 + v * 0.05;
    }
    sludgeGeo.setAttribute('color', new THREE.BufferAttribute(sludgeCols, 3));
    const sludgeMat = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0 });
    scene.add(new THREE.Mesh(sludgeGeo, sludgeMat));

    // ── Land terrain mesh (photogrammetry) ───────────────────────────
    const landGeo  = buildGeo();
    const lPos     = landGeo.attributes.position;
    const landCols = new Float32Array(vCount * 3);
    for (let i = 0; i < vCount; i++) {
      lPos.setY(i, -15);
      const h = landH[i], v = Math.random() * 0.07;
      const t = Math.min(1, h / 2.5);
      landCols[i*3+0] = 0.32 + t * 0.18 + v;
      landCols[i*3+1] = 0.48 + t * 0.16 + v;
      landCols[i*3+2] = 0.18 + t * 0.08 + v * 0.5;
    }
    landGeo.setAttribute('color', new THREE.BufferAttribute(landCols, 3));
    const landMat = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0 });
    scene.add(new THREE.Mesh(landGeo, landMat));

    // Wireframe overlay for land (photogrammetry scan effect)
    const lWireGeo = buildGeo();
    const lWirePos = lWireGeo.attributes.position;
    for (let i = 0; i < vCount; i++) lWirePos.setY(i, -15);
    const lWireMat = new THREE.MeshBasicMaterial({ color: 0x44EE66, wireframe: true, transparent: true, opacity: 0 });
    scene.add(new THREE.Mesh(lWireGeo, lWireMat));

    // ── Water surface (pond only, ellipse shaped) ────────────────────
    const waterGeo = new THREE.CircleGeometry(1, 72);
    waterGeo.rotateX(-Math.PI / 2);
    const wPos = waterGeo.attributes.position;
    for (let i = 0; i < wPos.count; i++) {
      wPos.setX(i, wPos.getX(i) * PA);
      wPos.setZ(i, wPos.getZ(i) * PB);
    }
    wPos.needsUpdate = true;
    waterGeo.computeVertexNormals();
    const waterMat  = new THREE.MeshBasicMaterial({ color: 0x0a4a80, transparent: true, opacity: 0.28, depthWrite: false });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = 0.04;
    scene.add(waterMesh);

    // Shore ring highlight
    const shoreGeo = new THREE.RingGeometry(1, 1.04, 80);
    shoreGeo.rotateX(-Math.PI / 2);
    const shPos = shoreGeo.attributes.position;
    for (let i = 0; i < shPos.count; i++) {
      shPos.setX(i, shPos.getX(i) * PA);
      shPos.setZ(i, shPos.getZ(i) * PB);
    }
    shPos.needsUpdate = true;
    const shoreMat = new THREE.MeshBasicMaterial({ color: 0x00AACC, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const shoreMesh = new THREE.Mesh(shoreGeo, shoreMat);
    shoreMesh.position.y = 0.05;
    scene.add(shoreMesh);

    // ── USV model (yellow MĀKI boat) ─────────────────────────────────
    const usvGroup = new THREE.Group();

    const hullGeo = new THREE.SphereGeometry(1, 18, 10);
    hullGeo.applyMatrix4(new THREE.Matrix4().makeScale(1.15, 0.27, 0.40));
    const hullMat = new THREE.MeshLambertMaterial({ color: 0xF5A800 });
    const hull    = new THREE.Mesh(hullGeo, hullMat);
    hull.position.y = 0.08;
    usvGroup.add(hull);

    const railGeo = new THREE.TorusGeometry(0.55, 0.035, 6, 22);
    railGeo.applyMatrix4(new THREE.Matrix4().makeScale(2.0, 1, 0.68));
    const railMat = new THREE.MeshLambertMaterial({ color: 0xCC8800 });
    const rail    = new THREE.Mesh(railGeo, railMat);
    rail.position.y = 0.20;
    usvGroup.add(rail);

    const antMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    [[-0.72, 0.3, 0.22], [0.72, 0.3, 0.22], [-0.72, 0.3, -0.22], [0.72, 0.3, -0.22]].forEach(([x, y, z]) => {
      const a = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.48, 5), antMat);
      a.position.set(x, y, z);
      usvGroup.add(a);
    });

    // Sonar dome (transducer) on keel
    const domeMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const dome    = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
    dome.rotation.x = Math.PI;
    dome.position.set(0, -0.06, 0);
    usvGroup.add(dome);

    // Point light instead of sprite — sprites always render as a visible rectangle
    const usvLight = new THREE.PointLight(0x00CCFF, 1.2, 5);
    usvLight.position.set(0, 0.6, 0);
    usvGroup.add(usvLight);
    usvGroup.scale.setScalar(0.85);
    scene.add(usvGroup);

    // ── Drone model ──────────────────────────────────────────────────
    const droneGroup = new THREE.Group();
    const dBodyMat  = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
    droneGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.16, 0.45), dBodyMat));

    const dArmMat   = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const dRotorMat = new THREE.MeshLambertMaterial({ color: 0x555555, transparent: true, opacity: 0.65 });
    const rotors    = [];
    [[-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1]].forEach(([cx, cy, cz]) => {
      const ang = Math.atan2(cz, cx);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.05, 0.09), dArmMat);
      arm.rotation.y = ang;
      arm.position.set(cx * 0.48, 0, cz * 0.48);
      droneGroup.add(arm);
      const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.04, 10), dRotorMat);
      rotor.position.set(cx, 0.07, cz);
      rotors.push(rotor);
      droneGroup.add(rotor);
    });

    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00FF44 });
    const led    = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), ledMat);
    led.position.set(0, -0.1, 0.22);
    droneGroup.add(led);

    const camBox = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.14, 0.20), new THREE.MeshLambertMaterial({ color: 0x111111 }));
    camBox.position.set(0, -0.14, 0);
    droneGroup.add(camBox);

    droneGroup.scale.setScalar(0.75);
    scene.add(droneGroup);

    // Camera footprint projected onto land below drone
    const fpPts = [
      new THREE.Vector3(-3.5, 0, -3.0), new THREE.Vector3(3.5, 0, -3.0),
      new THREE.Vector3(3.5, 0,  3.0),  new THREE.Vector3(-3.5, 0, 3.0),
      new THREE.Vector3(-3.5, 0, -3.0)
    ];
    const fpGeo  = new THREE.BufferGeometry().setFromPoints(fpPts);
    const fpMat  = new THREE.LineBasicMaterial({ color: 0x44FF66, transparent: true, opacity: 0 });
    const fpLine = new THREE.Line(fpGeo, fpMat);
    scene.add(fpLine);

    // ── Sonar rings (USV, expand inside pond) ───────────────────────
    const NRINGS = 5;
    const rings  = [];
    for (let k = 0; k < NRINGS; k++) {
      const rGeo = new THREE.RingGeometry(0.08, 0.22, 40);
      rGeo.rotateX(-Math.PI / 2);
      const rMat = new THREE.MeshBasicMaterial({
        color: 0x00E5FF, transparent: true, opacity: 0.8,
        side: THREE.DoubleSide, depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.userData.phase = k / NRINGS;
      scene.add(ring);
      rings.push(ring);
    }

    // Photogrammetry scan-line effect on land
    const scanPts = [new THREE.Vector3(-BW / 2, 0.12, 0), new THREE.Vector3(BW / 2, 0.12, 0)];
    const scanGeo = new THREE.BufferGeometry().setFromPoints(scanPts);
    const scanMat = new THREE.LineBasicMaterial({ color: 0x44EE66, transparent: true, opacity: 0 });
    const scanLine = new THREE.Line(scanGeo, scanMat);
    scene.add(scanLine);

    // ── USV row-scan path (inside pond) ──────────────────────────────
    const USV_SWATH    = 2.7;
    const USV_SPEED    = 0.12;
    const USV_ROW_STEP = 2.1;

    let usvX   = 0;
    let usvZ   = -PB + 1.2;
    let usvDir = 1;

    function pondHalfW(z) {
      const t = 1 - (z / PB) ** 2;
      return t <= 0 ? 0 : PA * Math.sqrt(t);
    }

    // ── Drone orbit over surrounding land ────────────────────────────
    const D_SWATH  = 3.8;
    const D_DSPEED = 0.009;
    let droneAngle = 0;
    let droneR     = PA + 2.8;

    // ── Reveal functions ─────────────────────────────────────────────
    function revealBed(ax, az) {
      const sw2 = USV_SWATH * USV_SWATH;
      for (let i = 0; i < vCount; i++) {
        if (!isPond[i] || bedRev[i] >= 1) continue;
        const dx = vx[i] - ax, dz = vz[i] - az;
        if (dx * dx + dz * dz < sw2) bedRev[i] = Math.min(1, bedRev[i] + 0.07);
      }
    }

    function revealLand(ax, az) {
      const sw2 = D_SWATH * D_SWATH;
      for (let i = 0; i < vCount; i++) {
        if (isPond[i] || landRev[i] >= 1) continue;
        const dx = vx[i] - ax, dz = vz[i] - az;
        if (dx * dx + dz * dz < sw2) landRev[i] = Math.min(1, landRev[i] + 0.045);
      }
    }

    function revealSludge() {
      for (let i = 0; i < vCount; i++) {
        if (!isPond[i] || sludgeRev[i] >= 1) continue;
        if (bedRev[i] > 0.55) sludgeRev[i] = Math.min(1, sludgeRev[i] + 0.028);
      }
    }

    // ── Animation loop ────────────────────────────────────────────────
    let startTime     = null;
    let droneLaunched = false;
    let animId;

    function animate(ts) {
      animId = requestAnimationFrame(animate);
      if (!startTime) startTime = ts;
      const elapsed = (ts - startTime) / 1000;

      // ── USV update ─────────────────────────────────────────────────
      const hw = pondHalfW(usvZ);
      if (hw < 0.5) {
        usvZ += USV_ROW_STEP; usvDir = 1; usvX = 0;
      } else {
        usvX += USV_SPEED * usvDir;
        if (Math.abs(usvX) >= hw) {
          usvDir = -usvDir;
          usvZ  += USV_ROW_STEP;
          usvX   = Math.sign(usvX) * hw * 0.98;
          if (usvZ > PB - 0.5) { usvZ = -PB + 1.2; usvX = 0; usvDir = 1; }
        }
      }
      usvGroup.position.set(usvX, 0.10, usvZ);
      usvGroup.rotation.y = usvDir > 0 ? 0 : Math.PI;
      revealBed(usvX, usvZ);

      // Sonar rings expand from USV position
      const ringMaxR = Math.min(USV_SWATH * 1.4, Math.max(0.5, pondHalfW(usvZ)));
      rings.forEach(ring => {
        ring.userData.phase = (ring.userData.phase + 0.012) % 1;
        const p = ring.userData.phase;
        ring.scale.setScalar(p * ringMaxR);
        ring.position.set(usvX, -0.06, usvZ);
        ring.material.opacity = (1 - p) * 0.75;
      });

      // ── Drone update (launches after 4.5s, stays over land) ────────
      if (elapsed >= 4.5) {
        if (!droneLaunched) { droneLaunched = true; droneAngle = 0; droneR = PA + 2.8; }
        droneAngle += D_DSPEED;
        droneR = Math.min(PA + 8.5, droneR + 0.004);

        // Orbit outside pond ellipse by using elliptical path
        const dx = Math.cos(droneAngle) * droneR;
        const dz = Math.sin(droneAngle) * droneR * (PB / PA);
        droneGroup.position.set(dx, 5.8, dz);
        droneGroup.rotation.y = -droneAngle + Math.PI / 2;

        fpLine.position.set(dx, 0.15, dz);
        fpLine.rotation.y = -droneAngle;
        fpMat.opacity = 0.35 + Math.sin(ts * 0.0025) * 0.12;

        scanLine.position.z = dz;
        scanMat.opacity = 0.25 + Math.sin(ts * 0.003) * 0.1;

        rotors.forEach((r, k) => { r.rotation.y += 0.28 * (k % 2 === 0 ? 1 : -1); });

        revealLand(dx, dz);
        revealSludge();
      } else {
        droneGroup.position.set(0, 200, 0);
        fpLine.position.set(0, 200, 0);
        fpMat.opacity = 0;
        scanMat.opacity = 0;
        revealSludge();
      }

      // ── Update terrain vertex positions ────────────────────────────
      let anyBed = false, anySludge = false, anyLand = false;
      for (let i = 0; i < vCount; i++) {
        if (isPond[i]) {
          if (bedRev[i] > 0) {
            const r = Math.min(1, bedRev[i]), e = r * r * (3 - 2 * r);
            const ny = (hardH[i] - 12) + 12 * e;
            if (Math.abs(bPos.getY(i) - ny) > 0.003) { bPos.setY(i, ny); bWirePos.setY(i, ny + 0.01); anyBed = true; }
          }
          if (sludgeRev[i] > 0) {
            const r = Math.min(1, sludgeRev[i]), e = r * r * (3 - 2 * r);
            const ny = (sludgeH[i] - 12) + 12 * e;
            if (Math.abs(sPos.getY(i) - ny) > 0.003) { sPos.setY(i, ny); anySludge = true; }
          }
        } else {
          if (landRev[i] > 0) {
            const r = Math.min(1, landRev[i]), e = r * r * (3 - 2 * r);
            const ny = (landH[i] - 12) + 12 * e;
            if (Math.abs(lPos.getY(i) - ny) > 0.003) { lPos.setY(i, ny); lWirePos.setY(i, ny + 0.02); anyLand = true; }
          }
        }
      }
      if (anyBed)    { bPos.needsUpdate = true;  bWirePos.needsUpdate = true;  bedGeo.computeVertexNormals();    bWireGeo.computeVertexNormals(); }
      if (anySludge) { sPos.needsUpdate = true;  sludgeGeo.computeVertexNormals(); }
      if (anyLand)   { lPos.needsUpdate = true;  lWirePos.needsUpdate = true;  landGeo.computeVertexNormals();   lWireGeo.computeVertexNormals(); }

      // ── Opacities ──────────────────────────────────────────────────
      let bedCnt = 0, sludgeCnt = 0, landCnt = 0, pondTotal = 0, landTotal = 0;
      for (let i = 0; i < vCount; i++) {
        if (isPond[i]) { pondTotal++; if (bedRev[i] > 0.5) bedCnt++; if (sludgeRev[i] > 0.5) sludgeCnt++; }
        else           { landTotal++; if (landRev[i] > 0.5) landCnt++; }
      }
      const bFrac = bedCnt    / Math.max(1, pondTotal);
      const sFrac = sludgeCnt / Math.max(1, pondTotal);
      const lFrac = landCnt   / Math.max(1, landTotal);

      bedMat.opacity    = Math.min(0.92, bFrac * 1.5);
      bWireMat.opacity  = Math.min(0.18, bFrac * 0.22);
      sludgeMat.opacity = Math.min(0.88, sFrac * 1.6);
      landMat.opacity   = Math.min(0.90, lFrac * 1.5);
      lWireMat.opacity  = Math.min(0.22, lFrac * 0.28);
      waterMat.opacity  = 0.28 - bFrac * 0.08;

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);

    return function cleanup() {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  };
})();
