// Interactive 3D demo model for the company profile. Ground and photo come
// from a simplified (1.8 m) drone model; the pond bed is SYNTHETIC demo data:
// ground with the drone photo draped over it, the pond bed coloured by depth,
// and the water surface. "Drain the pond" lowers the water level into the
// pond (deepest parts empty last) and brings up the depth colours of the bed.
// Vertical scale is exaggerated x3 so a 3.5 m deep pond reads at this size.
window.makiModel = function (host) {
  'use strict';
  if (!window.THREE || host.dataset.ready) return;
  host.dataset.ready = '1';
  var VEX = 3;

  fetch(host.dataset.model).then(function (r) { return r.json(); }).then(function (D) {
    function b64(s, T) { var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new T(u.buffer); }
    function surf(k) { var q = b64(D[k], Int16Array), z = new Float32Array(q.length); for (var i = 0; i < q.length; i++) z[i] = q[i] === D.nodata ? NaN : D.z0 + q[i] / 100; return z; }
    var G = surf('ground'), B = surf('bed'), W = b64(D.water, Uint8Array);
    var NX = D.nx, NY = D.ny, R = D.res, EW = D.ext[0], EH = D.ext[1];
    var cx = NX * R / 2, cy = NY * R / 2, zc = D.wse;

    var RAMP = [[0, [250, 228, 150]], [0.3, [242, 168, 74]], [0.65, [206, 86, 56]], [1, [112, 30, 62]]]; // warm, so the bed never reads as water
    function ramp(t) {
      t = Math.max(0, Math.min(1, t));
      for (var k = 1; k < RAMP.length; k++) if (t <= RAMP[k][0]) {
        var a = RAMP[k - 1], b = RAMP[k], f = (t - a[0]) / (b[0] - a[0]);
        return [0, 1, 2].map(function (c) { return lin((a[1][c] + (b[1][c] - a[1][c]) * f) / 255); });
      }
      return RAMP[RAMP.length - 1][1].map(function (c) { return c / 255; });
    }
    // Vertex colours are linear; the renderer outputs sRGB, so convert or they wash out.
    function lin(c) { return Math.pow(c, 2.2); }

    function geom(z, opt) {
      var pos = new Float32Array(NX * NY * 3), uv = new Float32Array(NX * NY * 2), col = opt.color ? new Float32Array(NX * NY * 3) : null, ok = new Uint8Array(NX * NY);
      for (var j = 0; j < NY; j++) for (var i = 0; i < NX; i++) {
        var n = j * NX + i, v = z[n], good = !isNaN(v) && (!opt.keep || opt.keep(n));
        var x = (i + .5) * R, y = (j + .5) * R;
        pos[n * 3] = x - cx; pos[n * 3 + 1] = (good ? (v - zc) * VEX : 0); pos[n * 3 + 2] = y - cy;
        uv[n * 2] = x / EW; uv[n * 2 + 1] = 1 - y / EH;
        if (col && good) { var c = opt.color(n); col[n * 3] = c[0]; col[n * 3 + 1] = c[1]; col[n * 3 + 2] = c[2]; }
        ok[n] = good ? 1 : 0;
      }
      var idx = [];
      for (j = 0; j < NY - 1; j++) for (i = 0; i < NX - 1; i++) {
        var a = j * NX + i, b = a + 1, c2 = a + NX, d = c2 + 1;
        if (ok[a] && ok[b] && ok[c2] && ok[d]) idx.push(a, b, c2, b, d, c2);
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      if (col) g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    }

    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0x0d1620, 1);
    host.insertBefore(renderer.domElement, host.firstChild);
    var camera = new THREE.PerspectiveCamera(38, 1, 1, 5000);
    scene.add(new THREE.HemisphereLight(0xe6f0f8, 0x34404c, 1.0));
    var sun = new THREE.DirectionalLight(0xffffff, 0.6); sun.position.set(-300, 500, 200); scene.add(sun);

    var tex = new THREE.TextureLoader().load(host.dataset.tex, render);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Ground runs on under the pond, just below the bed, so there is no gap
    // where bank and bed meet; the depth-coloured bed sits on top of it.
    var G2 = new Float32Array(G.length);
    for (var q = 0; q < G.length; q++) G2[q] = (W[q] && !isNaN(B[q])) ? B[q] - 0.05 : G[q];
    scene.add(new THREE.Mesh(geom(G2, {}), new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide })));
    var bedMat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
    scene.add(new THREE.Mesh(geom(B, { keep: function (n) { return W[n] === 1; }, color: function (n) { return ramp(Math.pow(Math.max(0, D.wse - B[n]) / D.depth_max, 0.7)); } }), bedMat));
    var wz = new Float32Array(NX * NY);
    for (var n = 0; n < wz.length; n++) wz[n] = W[n] ? D.wse : NaN;
    var waterMat = new THREE.MeshLambertMaterial({ color: 0x1d6f9e, emissive: 0x06243a, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide });
    var water = new THREE.Mesh(geom(wz, {}), waterMat); water.renderOrder = 2; scene.add(water);

    // Drain state p: 0 = full, 1 = drained. Full water is nearly opaque and the
    // bed beneath is dimmed; draining drops the level (the bed hides it where it
    // is shallower), then the last of the water fades and the bed colours light up.
    var DIM = new THREE.Color(0x40566a), FULLC = new THREE.Color(0xffffff), dp = 0;
    function setDrain(p) {
      dp = p;
      var e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      water.position.y = -e * D.depth_max * VEX * 1.05;
      waterMat.opacity = 0.9 * (1 - Math.max(0, (e - 0.8) / 0.2));
      water.visible = waterMat.opacity > 0.01;
      bedMat.color.copy(DIM).lerp(FULLC, Math.min(1, e * 1.3));
      if (leg) leg.style.opacity = e;
    }
    var leg = null;

    // Orbit: drag to rotate, wheel/pinch to zoom, slow spin until touched.
    var az = 0.6, el = 0.78, dist = Math.max(NX, NY) * R * 1.25, spin = true, raf = 0, visible = true;
    function place() {
      camera.position.set(dist * Math.cos(el) * Math.sin(az), dist * Math.sin(el), dist * Math.cos(el) * Math.cos(az));
      camera.lookAt(0, -2, 0);
    }
    function size() {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    function render() { place(); renderer.render(scene, camera); }
    var fade = null;
    function loop() {
      raf = 0;
      if (!visible) return;
      if (spin) az += 0.0025;
      if (fade) { var k = Math.min(1, (performance.now() - fade.t0) / 2200); setDrain(fade.from + (fade.to - fade.from) * k); if (k >= 1) fade = null; }
      render();
      if (spin || fade) raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }

    var drag = null, pts = {};
    var cv = renderer.domElement;
    cv.addEventListener('pointerdown', function (e) { cv.setPointerCapture(e.pointerId); pts[e.pointerId] = [e.clientX, e.clientY]; drag = [e.clientX, e.clientY, az, el]; spin = false; e.stopPropagation(); });
    cv.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      var ids = Object.keys(pts);
      if (ids.length === 2) { // pinch
        var o = pts[ids[0] == e.pointerId ? ids[1] : ids[0]], prev = pts[e.pointerId];
        var d0 = Math.hypot(prev[0] - o[0], prev[1] - o[1]), d1 = Math.hypot(e.clientX - o[0], e.clientY - o[1]);
        if (d0 > 0) dist = Math.max(80, Math.min(1200, dist * d0 / d1));
      } else if (drag) {
        az = drag[2] - (e.clientX - drag[0]) * 0.008;
        el = Math.max(0.15, Math.min(1.45, drag[3] + (e.clientY - drag[1]) * 0.006));
      }
      pts[e.pointerId] = [e.clientX, e.clientY];
      render();
    });
    function up(e) { delete pts[e.pointerId]; if (!Object.keys(pts).length) drag = null; }
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', function (e) { e.preventDefault(); dist = Math.max(80, Math.min(1200, dist * (e.deltaY > 0 ? 1.1 : 0.9))); spin = false; render(); }, { passive: false });

    var btn = host.querySelector('[data-model-act="water"]'), drained = false;
    if (btn) btn.addEventListener('click', function () {
      drained = !drained;
      fade = { t0: performance.now(), from: dp, to: drained ? 1 : 0 };
      btn.textContent = drained ? 'Refill the pond' : 'Drain the pond';
      kick();
      if (typeof gtag === 'function') gtag('event', 'profile_model_interact', { action: drained ? 'drain' : 'refill' });
    });
    leg = document.createElement('div'); leg.className = 'model-legend';
    leg.innerHTML = 'Demo depth <i></i> 0 – ' + D.depth_max.toFixed(1) + ' m · vertical ×' + VEX;
    host.appendChild(leg);
    setDrain(0);

    // The book tells each page when it is showing; hidden leaves still
    // "intersect" the viewport, so IntersectionObserver can't be used here.
    host.closest('.pg').addEventListener('pg-vis', function (e) { visible = e.detail; if (visible) { size(); kick(); } });
    new ResizeObserver(function () { size(); render(); }).observe(host);
    size(); render(); kick();
    host.classList.add('is-live');
    // Used once to export the still image that prints in the PDF.
    window.makiModelSnap = function (w, h, a, e) {
      spin = false; if (a != null) az = a; if (e != null) el = e;
      renderer.setPixelRatio(1); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); render();
      var url = cv.toDataURL('image/jpeg', 0.86);
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); size(); render();
      return url;
    };
  });
};
