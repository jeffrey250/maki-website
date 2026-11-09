// MĀKI interactive company profile — turns the <section class="pg"> pages into
// a flip book (wide screens) or a swipeable strip (phones). ?print=1 leaves the
// pages stacked for the PDF. No libraries; the 3D pond model loads its own code
// (model.js + three.js) only when its page is first opened.
(function () {
  'use strict';
  var book = document.getElementById('book');
  var pages = Array.prototype.slice.call(book.querySelectorAll(':scope > .pg'));
  var N = pages.length;
  var printMode = /[?&]print=1/.test(location.search);
  var mode = null;         // 'book' | 'strip'
  var cur = 0;             // book: spread index (0..N/2); strip: page index
  var leaves = [];
  var numEl = document.querySelector('.ctrl-num');
  var prevBtn = document.querySelector('[data-act="prev"]');
  var nextBtn = document.querySelector('[data-act="next"]');
  var seen = {};

  pages.forEach(function (pg, i) {
    pg.dataset.n = i + 1;
    var inner = pg.querySelector('.pg-in');
    if (inner && i > 0 && i < N - 1) inner.setAttribute('data-folio', 'MĀKI Company Profile 2026 · ' + (i + 1));
  });

  if (printMode) {
    document.body.classList.add('print');
    // Lazy images below the fold would print blank; videos print as their poster.
    document.querySelectorAll('img[loading="lazy"]').forEach(function (i) { i.loading = 'eager'; });
    // The PDF is generated from a local copy, so site links must be absolute.
    document.querySelectorAll('a[href^="/"]').forEach(function (a) { a.href = 'https://www.maki.nz' + a.getAttribute('href'); });
    return;
  }

  // ---------- motion targets: cards and figures rise in, staggered ----------
  ['.stats > *', '.badges > *', '.chips > li', '.caps > *', '.fleet > *', '.facts > *', '.outcomes > *', '.mosaic > *',
   '.logos > *', '.cs-index > li', '.steps > li', '.why > *', '.assure > *', '.duo > *', '.split', '.story',
   '.road-item', '.toc > li', '.contact > li', '.media', '.yt', '.model', '.map > *', '.big-cta'
  ].forEach(function (sel) {
    var groups = {};
    book.querySelectorAll('.pg-in ' + sel).forEach(function (el) {
      var pg = el.closest('.pg').id; groups[pg] = (groups[pg] || 0);
      el.setAttribute('data-rise', '');
      el.style.setProperty('--i', Math.min(groups[pg]++, 14));
    });
  });

  // ---------- lightbox for photos ----------
  book.querySelectorAll('.pg-in img').forEach(function (img) {
    if (img.closest('a, .logos, .yt, .model, .pg-cover, .pg-back, .band-img') || img.classList.contains('band-img') || img.classList.contains('bg')) return;
    img.classList.add('zoomable');
  });
  document.addEventListener('click', function (e) {
    var img = e.target.closest('img.zoomable');
    if (!img) return;
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<button type="button" aria-label="Close">&times;</button><img alt=""><p></p>';
    lb.querySelector('img').src = img.currentSrc || img.src;
    lb.querySelector('img').alt = img.alt;
    var cap = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    lb.querySelector('p').textContent = cap ? cap.textContent : img.alt;
    document.body.appendChild(lb);
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    function close() { lb.classList.remove('is-open'); setTimeout(function () { lb.remove(); }, 250); document.removeEventListener('keydown', esc, true); }
    function esc(ev) { if (ev.key === 'Escape' || ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') { ev.stopPropagation(); close(); } }
    lb.addEventListener('click', close);
    document.addEventListener('keydown', esc, true);
    track('profile_image_zoom', { page_slug: img.closest('.pg').id });
  });

  // ---------- fullscreen ----------
  var fsBtn = document.querySelector('[data-act="fs"]');
  if (document.fullscreenEnabled && fsBtn) {
    document.documentElement.classList.add('can-fs');
    fsBtn.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen();
    });
    document.addEventListener('fullscreenchange', function () { fsBtn.textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen'; });
  }

  // ---------- analytics ----------
  function track(name, params) {
    try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch (e) {}
  }

  // ---------- page activity (videos, counters, 3D) ----------
  function visiblePages() {
    if (mode === 'book') {
      var l = 2 * cur - 1, r = 2 * cur;
      return [pages[l], pages[r]].filter(Boolean);
    }
    return [pages[cur]];
  }
  function activate() {
    var vis = visiblePages();
    pages.forEach(function (pg) {
      var on = vis.indexOf(pg) !== -1;
      pg.dispatchEvent(new CustomEvent('pg-vis', { detail: on }));
      // Entrance motion: start at once on arrival; reset only once the page has
      // finished turning away, so nothing vanishes mid-turn.
      clearTimeout(pg._out);
      if (on) pg.classList.add('is-in');
      else if (pg.classList.contains('is-in')) pg._out = setTimeout(function () { pg.classList.remove('is-in'); }, 900);
      pg.querySelectorAll('video[data-pv]').forEach(function (v) {
        if (on) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
      if (!on) return;
      if (!seen[pg.id]) {
        seen[pg.id] = 1;
        track('profile_page_view', { page_slug: pg.id, page_number: +pg.dataset.n });
        countUp(pg);
      }
      var m = pg.querySelector('.model');
      if (m) loadModel(m);
    });
    updateUi();
  }

  function countUp(pg) {
    pg.querySelectorAll('[data-count]').forEach(function (el) {
      var to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null, dur = 1200;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(to * e).toLocaleString('en-NZ') + suf;
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  var modelLoading = false;
  function loadModel(el) {
    if (modelLoading) return; modelLoading = true;
    function add(src, cb) { var s = document.createElement('script'); s.src = src; s.onload = cb; document.head.appendChild(s); }
    add('/assets/profile/three.min.js', function () { add('/profile/model.js?v=b1f2b9d8', function () { if (window.makiModel) window.makiModel(el); }); });
  }

  // ---------- YouTube: thumbnail until clicked ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest('.yt-play');
    if (!a) return;
    e.preventDefault();
    var box = a.closest('.yt');
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + box.dataset.yt + '?autoplay=1&rel=0';
    f.title = box.dataset.ytTitle || 'Video';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    box.appendChild(f);
    a.remove();
    track('video_start', { video_id: box.dataset.yt, page_slug: box.closest('.pg').id });
  });

  // ---------- BOOK ----------
  var spreads = Math.ceil(N / 2); // spread s shows leaf s-1 back (left) + leaf s front (right)
  function buildBook() {
    for (var i = 0; i < N; i += 2) {
      var leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.innerHTML = '<div class="face front"></div><div class="face back"></div><div class="shade"></div>';
      leaf.children[0].appendChild(pages[i]);
      if (pages[i + 1]) leaf.children[1].appendChild(pages[i + 1]);
      book.appendChild(leaf);
      leaves.push(leaf);
    }
    var l = document.createElement('button'), r = document.createElement('button');
    l.className = 'edge edge-l'; l.setAttribute('aria-label', 'Previous page'); l.type = 'button';
    r.className = 'edge edge-r'; r.setAttribute('aria-label', 'Next page'); r.type = 'button';
    l.addEventListener('click', function () { go(cur - 1); });
    r.addEventListener('click', function () { go(cur + 1); });
    book.appendChild(l); book.appendChild(r);
    book.classList.add('is-book');
    document.body.classList.add('is-book');
    layoutBook();
    setLeaves(true);
  }
  function layoutBook() {
    var top = 56, bottom = 70, side = 40;
    var availH = innerHeight - top - bottom - 20, availW = innerWidth - side * 2;
    var ph = Math.min(availH, (availW / 2) * 4 / 3);
    var pw = ph * 3 / 4;
    book.style.width = (pw * 2) + 'px';
    book.style.height = ph + 'px';
    book.style.left = ((innerWidth - pw * 2) / 2) + 'px';
    book.style.top = (top + 10 + (availH - ph) / 2) + 'px';
    var l = book.querySelector('.edge-l'), r = book.querySelector('.edge-r');
    if (l) { l.style.width = (pw * .07) + 'px'; r.style.width = (pw * .07) + 'px'; }
  }
  function setLeaves(instant) {
    leaves.forEach(function (leaf, i) {
      var flipped = i < cur;
      if (instant) leaf.style.transition = 'none';
      leaf.classList.toggle('is-flipped', flipped);
      leaf.style.zIndex = flipped ? (i + 1) : (leaves.length - i + 1);
      if (instant) { leaf.offsetWidth; leaf.style.transition = ''; }
    });
    book.classList.toggle('is-closed-front', cur === 0);
    book.classList.toggle('is-closed-back', cur === spreads);
    book.querySelector('.edge-l').hidden = cur === 0;
    book.querySelector('.edge-r').hidden = cur === spreads;
  }
  function goBook(s) {
    s = Math.max(0, Math.min(spreads, s));
    if (s === cur) return;
    var from = cur, dir = s > from ? 1 : -1, steps = Math.abs(s - from);
    cur = s;
    // Leaves that change side turn one after another, like riffling pages.
    var changed = [];
    for (var i = Math.min(from, s); i < Math.max(from, s); i++) changed.push(i);
    if (dir < 0) changed.reverse();
    changed.forEach(function (i, k) {
      var leaf = leaves[i];
      leaf.style.zIndex = 200 + k;
      leaf.style.transitionDelay = (steps > 1 ? k * 70 : 0) + 'ms';
      leaf.classList.add('is-turning');
      leaf.classList.toggle('is-flipped', i < s);
    });
    book.classList.toggle('is-closed-front', s === 0);
    book.classList.toggle('is-closed-back', s === spreads);
    book.querySelector('.edge-l').hidden = s === 0;
    book.querySelector('.edge-r').hidden = s === spreads;
    clearTimeout(goBook.t);
    goBook.t = setTimeout(function () {
      leaves.forEach(function (l) { l.classList.remove('is-turning'); l.style.transitionDelay = ''; });
      setLeaves(false);
    }, 950 + steps * 70);
    // Pause what's leaving at once; start what's arriving as the page lands.
    pages.forEach(function (pg) { pg.querySelectorAll('video[data-pv]').forEach(function (v) { v.pause(); }); });
    setTimeout(activate, 500);
    updateUi();
  }

  // ---------- STRIP ----------
  function buildStrip() {
    var hint = document.querySelector('.cover-hint');
    if (hint) hint.textContent = 'Swipe to turn the page →';
    book.classList.add('is-strip');
    document.body.classList.add('is-strip');
    var t;
    book.addEventListener('scroll', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var i = Math.round(book.scrollLeft / book.clientWidth);
        if (i !== cur) { cur = i; activate(); }
      }, 90);
    }, { passive: true });
  }
  function goStrip(i, instant) {
    i = Math.max(0, Math.min(N - 1, i));
    cur = i;
    book.scrollTo({ left: i * book.clientWidth, behavior: instant ? 'auto' : 'smooth' });
    activate();
  }

  // ---------- shared ----------
  function pageIndexToPos(i) { return mode === 'book' ? Math.ceil(i / 2) : i; }
  function posToFirstPage() { return mode === 'book' ? Math.max(0, 2 * cur - 1) : cur; }
  function go(pos, instant) { if (mode === 'book') goBook(pos); else goStrip(pos, instant); }
  function goToPage(i, instant) { if (mode === 'book' && instant) { cur = pageIndexToPos(i); setLeaves(true); activate(); } else go(pageIndexToPos(i), instant); }

  function updateUi() {
    var label;
    if (mode === 'book') {
      var l = 2 * cur - 1, r = 2 * cur;
      label = cur === 0 ? '1' : (r >= N ? String(N) : (l + 1) + '–' + (r + 1));
      prevBtn.disabled = cur === 0; nextBtn.disabled = cur === spreads;
    } else {
      label = String(cur + 1);
      prevBtn.disabled = cur === 0; nextBtn.disabled = cur === N - 1;
    }
    numEl.textContent = label + ' / ' + N;
    var frac = mode === 'book' ? cur / spreads : cur / (N - 1);
    document.querySelector('.progress').style.width = (frac * 100) + '%';
    if (mode === 'book') { // page-stack thickness either side of the spine
      book.style.setProperty('--ls', Math.min(10, Math.round(cur * 0.8)) + 'px');
      book.style.setProperty('--rs', Math.min(10, Math.round((spreads - cur) * 0.8)) + 'px');
    }
    var first = pages[posToFirstPage()];
    if (first && history.replaceState) history.replaceState(null, '', first.id === 'cover' ? location.pathname : '#' + first.id);
    document.querySelectorAll('.drawer-list a').forEach(function (a) { a.classList.toggle('is-on', visiblePages().some(function (p) { return '#' + p.id === a.getAttribute('href'); })); });
  }

  function chooseMode() { return (innerWidth >= 900 && innerWidth / innerHeight >= 1.15) ? 'book' : 'strip'; }

  function init() {
    mode = chooseMode();
    if (mode === 'book') buildBook(); else buildStrip();
    var start = 0;
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); var i = pages.indexOf(t && t.closest('.pg')); if (i > 0) start = i; }
    goToPage(start, true);
    if (start === 0) activate();
  }

  // Internal links (#page-id) turn to that page instead of jumping the scroll.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var target = document.getElementById(a.getAttribute('href').slice(1));
    var i = pages.indexOf(target);
    if (i < 0) return;
    e.preventDefault();
    closeDrawer();
    goToPage(i);
  });

  prevBtn.addEventListener('click', function () { go(cur - 1); });
  nextBtn.addEventListener('click', function () { go(cur + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.target.closest('input, textarea, select')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(mode === 'book' ? spreads : N - 1);
    else if (e.key === 'Escape') closeDrawer();
  });

  // Swipe in book mode (tablets / touch laptops). Not on the 3D model.
  var sx = null, sy = null;
  book.addEventListener('pointerdown', function (e) { if (mode !== 'book' || e.pointerType === 'mouse' || e.target.closest('.model')) return; sx = e.clientX; sy = e.clientY; });
  book.addEventListener('pointerup', function (e) {
    if (sx === null) return;
    var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx < 0 ? 1 : -1));
  });

  // Pages drawer
  var drawer = document.getElementById('drawer'), list = drawer.querySelector('.drawer-list');
  pages.forEach(function (pg, i) {
    var li = document.createElement('li');
    li.innerHTML = '<a href="#' + pg.id + '"><b>' + (i + 1) + '</b><span></span></a>';
    li.querySelector('span').textContent = pg.dataset.title || pg.id;
    list.appendChild(li);
  });
  function closeDrawer() { drawer.hidden = true; }
  document.querySelector('[data-act="toc"]').addEventListener('click', function () { drawer.hidden = !drawer.hidden; });
  drawer.querySelector('[data-act="toc-close"]').addEventListener('click', closeDrawer);

  // Switching between book and strip means moving the pages, so rebuild.
  var rt;
  addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      var want = chooseMode();
      if (want === mode) { if (mode === 'book') layoutBook(); else book.scrollLeft = cur * book.clientWidth; return; }
      var first = posToFirstPage();
      pages.forEach(function (pg) { book.appendChild(pg); });
      leaves.forEach(function (l) { l.remove(); }); leaves = [];
      book.querySelectorAll('.edge').forEach(function (b) { b.remove(); });
      book.className = 'book'; book.removeAttribute('style');
      document.body.classList.remove('is-book', 'is-strip');
      mode = want; cur = 0;
      if (mode === 'book') buildBook(); else buildStrip();
      goToPage(first, true);
    }, 200);
  });

  // ---------- cover: the lake ripples gently ----------
  // A canvas over the cover photo redraws the water in thin rows, each nudged
  // sideways by a slow wave (bigger near the camera, tiny at the horizon).
  // The boat and its antennas are masked out so only the water moves.
  (function water() {
    var cover = document.getElementById('cover');
    var img = cover && cover.querySelector('.bg');
    if (!img) return; // slow and gentle, so it runs even with reduced motion on
    // In photo pixels (cover-usv.jpg is 920 x 2000).
    var HZ = 850, BOAT = [[226, 800, 560, 1200], [185, 1130, 760, 1350]];
    var cv = document.createElement('canvas');
    cv.className = 'water'; cv.setAttribute('aria-hidden', 'true');
    img.parentNode.appendChild(cv);
    var ctx = cv.getContext('2d'), mask = document.createElement('canvas'), mctx = mask.getContext('2d');
    var W, H, s, ox, oy, on = false, raf = 0, last = 0;

    function size() {
      var dpr = Math.min(devicePixelRatio || 1, 1.5);
      // offsetWidth ignores the slow cover zoom, which the wrapper applies to both layers.
      W = Math.round(cv.offsetWidth * dpr); H = Math.round(cv.offsetHeight * dpr);
      if (!W || !H || !img.naturalWidth) return false;
      cv.width = mask.width = W; cv.height = mask.height = H;
      var iw = img.naturalWidth, ih = img.naturalHeight, k = iw / 920;
      s = Math.max(W / iw, H / ih); ox = (W - iw * s) * 0.5; oy = (H - ih * s) * 0.6;
      // Mask: opaque water, feathered hole around the boat.
      mctx.clearRect(0, 0, W, H);
      mctx.fillStyle = '#000'; mctx.fillRect(0, 0, W, H);
      mctx.globalCompositeOperation = 'destination-out';
      mctx.filter = 'blur(' + Math.round(10 * s * k + 4) + 'px)';
      BOAT.forEach(function (b) {
        mctx.fillRect(ox + b[0] * k * s, oy + b[1] * k * s, (b[2] - b[0]) * k * s, (b[3] - b[1]) * k * s);
      });
      mctx.filter = 'none'; mctx.globalCompositeOperation = 'source-over';
      return true;
    }

    function frame(t) {
      raf = on ? requestAnimationFrame(frame) : 0;
      if (t - last < 33) return; // ~30 fps is plenty for slow water
      last = t;
      if (!W && !size()) return;
      var iw = img.naturalWidth, ih = img.naturalHeight, k = iw / 920, hz = HZ * k;
      var y0 = Math.max(0, Math.floor(oy + hz * s)), sec = t / 1000, step = 2;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      for (var y = y0; y < H; y += step) {
        var sy = (y - oy) / s;                       // row in photo pixels
        var d = Math.max(0, (sy - hz) / (ih - hz));   // 0 at horizon, 1 at bottom
        var u = W / 600, ph = 30 * Math.sqrt(d);      // ripples widen toward camera
        var amp = (0.8 + 9 * d) * u;                  // sideways sway, px
        var off = amp * (0.65 * Math.sin(ph * 5.1 - sec * 1.1) + 0.35 * Math.sin(ph * 11.7 + sec * 0.7));
        // Rows also bob up and down a little, so reflections stretch and squeeze.
        var bob = (0.6 + 6 * d) * u * Math.sin(ph * 3.7 - sec * 0.8) / s;
        var src = Math.min(ih - step / s - 1, Math.max(hz, sy + bob));
        ctx.drawImage(img, 0, src, iw, step / s + 0.5, ox + off, y, iw * s, step + 0.5);
      }
      // Fade the canvas in from the horizon, then keep the boat still.
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(mask, 0, 0);
    }

    function start() { if (!on) { on = true; if (!raf) raf = requestAnimationFrame(frame); } }
    function stop() { on = false; }
    cover.addEventListener('pg-vis', function (e) { if (e.detail) start(); else stop(); });
    addEventListener('resize', function () { W = 0; });
    if (!img.complete) img.addEventListener('load', function () { W = 0; });
    start();
  })();

  // ---------- Waikato mission replay: a small USV runs the round trip ----------
  // Illustrative: readings are taken from the small-multiple lines on the same
  // page (so the readout and the charts agree); four sampling stops; % done.
  (function replay() {
    var pg = document.getElementById('wrc-long-range');
    var line = pg && pg.querySelector('.wq-route .line');
    var boat = pg && pg.querySelector('.wq-route .usv');
    if (!line || !boat || !line.getTotalLength) return;
    var svgNS = 'http://www.w3.org/2000/svg';
    var L = line.getTotalLength(), KM = 22.3;
    var done = line.cloneNode(); done.setAttribute('class', 'done'); line.parentNode.insertBefore(done, line.nextSibling);
    var hud = {}; pg.querySelectorAll('[data-hud]').forEach(function (el) { hud[el.dataset.hud] = el; });
    // sparkline series -> value lookups
    var sms = pg.querySelectorAll('.sm svg'), curs = [];
    function series(i) {
      var pts = sms[i].querySelector('polyline').getAttribute('points').trim().split(/\s+/).map(function (p) { return +p.split(',')[1]; });
      var lo = Math.min.apply(0, pts), hi = Math.max.apply(0, pts);
      return function (u) { var x = u * (pts.length - 1), k = Math.floor(x), f = x - k; var y = pts[k] + ((pts[Math.min(k + 1, pts.length - 1)] - pts[k]) * f); return 1 - (y - lo) / (hi - lo); };
    }
    var chl = series(0), pc = series(1);
    sms.forEach(function (svg) { var c = document.createElementNS(svgNS, 'line'); c.setAttribute('class', 'cur'); c.setAttribute('y1', 0); c.setAttribute('y2', 44); svg.appendChild(c); curs.push(c); });

    var STOPS = [0.17, 0.36, 0.5, 0.74], STOP_MS = 1500, MOVE_MS = 30000, HOLD_MS = 3000;
    // timeline: map elapsed ms -> {u, stop}
    var plan = [], t = 0, last = 0;
    STOPS.forEach(function (s, i) { var d = (s - last) * MOVE_MS; plan.push({ t0: t, t1: t + d, u0: last, u1: s }); t += d; plan.push({ t0: t, t1: t + STOP_MS, stop: i }); t += STOP_MS; last = s; });
    plan.push({ t0: t, t1: t + (1 - last) * MOVE_MS, u0: last, u1: 1 }); t += (1 - last) * MOVE_MS;
    var TOTAL = t + HOLD_MS;

    function at(ms) {
      for (var i = 0; i < plan.length; i++) {
        var p = plan[i];
        if (ms < p.t1) {
          if (p.stop != null) return { u: STOPS[p.stop], stop: p.stop };
          return { u: p.u0 + (p.u1 - p.u0) * (ms - p.t0) / (p.t1 - p.t0) };
        }
      }
      return { u: 1, end: true };
    }
    function pos(u) { var l = u < 0.5 ? L * (1 - 2 * u) : L * (2 * u - 1); return Math.max(0, Math.min(L, l)); }
    function draw(ms) {
      var s = at(ms), u = s.u, l = pos(u), p = line.getPointAtLength(l);
      var dir = u < 0.5 ? -1 : 1, q = line.getPointAtLength(Math.max(0, Math.min(L, l + dir * 4)));
      var ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
      if (Math.abs(q.x - p.x) + Math.abs(q.y - p.y) < 0.1) ang = u < 0.5 ? -40 : 140;
      boat.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(1.4)');
      boat.classList.toggle('is-sampling', s.stop != null);
      // travelled part: outbound covers [l, L]; on the way back the whole line is done
      var cov = u < 0.5 ? L - l : L;
      done.setAttribute('stroke-dasharray', '0 ' + (L - cov).toFixed(1) + ' ' + cov.toFixed(1) + ' ' + L.toFixed(1));
      // readout
      var near = Math.min.apply(0, STOPS.map(function (x) { return Math.abs(x - u); }).concat([u, 1 - u]));
      var spd = (s.stop != null || s.end) ? 0 : (1.1 + 0.12 * Math.sin(ms / 1900) + 0.05 * Math.sin(ms / 530)) * Math.min(1, near / 0.012);
      hud.chl.textContent = (41 + 15 * chl(u)).toFixed(1);
      hud.pc.textContent = (31 + 11 * pc(u)).toFixed(1);
      hud.spd.textContent = spd.toFixed(1);
      hud.pct.textContent = Math.round(u * 100);
      hud.bar.style.width = (u * 100).toFixed(1) + '%';
      hud.status.textContent = s.end ? 'Mission complete · ' + KM + ' km' :
        s.stop != null ? 'Sampling · site ' + (s.stop + 1) + ' of 4' + (s.stop === 2 ? ' (turnaround)' : '') :
        (u < 0.5 ? 'Heading out' : 'Returning') + ' · ' + (u * KM).toFixed(1) + ' km';
      curs.forEach(function (c) { c.setAttribute('x1', u * 200); c.setAttribute('x2', u * 200); });
    }
    var on = false, raf = 0, t0 = null, pausedAt = 0;
    function frame(now) {
      raf = 0; if (!on) return;
      if (t0 == null) t0 = now - pausedAt;
      var ms = (now - t0) % TOTAL;
      draw(ms); pausedAt = ms;
      raf = requestAnimationFrame(frame);
    }
    pg.addEventListener('pg-vis', function (e) {
      on = e.detail;
      if (on) { t0 = null; pg.classList.add('is-replay'); if (!raf) raf = requestAnimationFrame(frame); }
    });
    draw(0);
  })();

  init();
})();
