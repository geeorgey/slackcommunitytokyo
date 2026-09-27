/* =========================================================
   Slack Community :Tokyo — 1,000 members celebration page
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. Event data -> timeline
     --------------------------------------------------------- */
  var MONTHS_JA = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

  function parseDate(str) {
    // "2026-09-28" or "2026-08" (month precision)
    var parts = String(str).split('-');
    return {
      year: Number(parts[0]),
      month: Number(parts[1]),
      day: parts.length > 2 ? Number(parts[2]) : null
    };
  }

  function formatWhen(d) {
    var main = d.day ? MONTHS_JA[d.month - 1] + d.day + '日' : MONTHS_JA[d.month - 1];
    return '<span class="tl-year">' + d.year + '</span>' + main;
  }

  function renderTimeline(events) {
    var list = document.getElementById('timeline');
    if (!list) return;

    var frag = document.createDocumentFragment();

    events.forEach(function (ev) {
      var d = parseDate(ev.date);
      var li = document.createElement('li');
      li.className = 'tl-item reveal' + (ev.upcoming ? ' is-upcoming' : '');

      var when = document.createElement('div');
      when.className = 'tl-when';
      when.innerHTML = formatWhen(d);

      var card = document.createElement('div');
      card.className = 'tl-card';

      var tags = document.createElement('p');
      tags.className = 'tl-tags';
      if (ev.upcoming) {
        tags.appendChild(makeTag('次回', 'is-next'));
      }
      if (ev.milestone) {
        tags.appendChild(makeTag(ev.milestone, 'is-milestone'));
      }
      if (ev.category) {
        tags.appendChild(makeTag(ev.category, 'is-category'));
      }
      if (ev.format) {
        tags.appendChild(makeTag(ev.format, ''));
      }

      var title = document.createElement('h3');
      title.className = 'tl-title';
      if (ev.url) {
        var a = document.createElement('a');
        a.href = ev.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = ev.title;
        title.appendChild(a);
      } else {
        title.textContent = ev.title;
      }

      card.appendChild(tags);
      card.appendChild(title);

      if (ev.summary) {
        var p = document.createElement('p');
        p.className = 'tl-summary';
        p.textContent = ev.summary;
        card.appendChild(p);
      }

      var meta = [];
      if (ev.time) meta.push(ev.time + ' JST');
      if (ev.venue) meta.push(ev.venue);
      if (meta.length) {
        var mp = document.createElement('p');
        mp.className = 'tl-meta';
        mp.textContent = meta.join(' / ');
        card.appendChild(mp);
      }

      li.appendChild(when);
      li.appendChild(card);
      frag.appendChild(li);
    });

    list.appendChild(frag);
  }

  function makeTag(text, extra) {
    var span = document.createElement('span');
    span.className = 'tl-tag' + (extra ? ' ' + extra : '');
    span.textContent = text;
    return span;
  }

  var DATA = window.SCT_DATA || {};
  var events = Array.isArray(DATA.events) ? DATA.events : [];

  renderTimeline(events);

  /* ---------------------------------------------------------
     2. Stats
     --------------------------------------------------------- */
  var heldCount = events.filter(function (ev) { return !ev.upcoming; }).length;
  var statEvents = document.getElementById('stat-events');
  if (statEvents) statEvents.textContent = heldCount + '回';

  var note = document.getElementById('history-note');
  if (note) {
    note.innerHTML =
      '掲載しているのは 2025年8月のリブート以降に開催された ' + heldCount +
      ' 件と、開催予定の ' + (events.length - heldCount) + ' 件（合計 ' + events.length +
      ' 件）です。日付・内容は公式チャプターページの情報にもとづいています。' +
      '追記や修正は <a href="https://github.com/geeorgey/slackcommunitytokyo" target="_blank" rel="noopener">リポジトリ</a> の ' +
      '<code>data/events.js</code> を編集すると、このページに反映されます。';
  }

  /* ---------------------------------------------------------
     3. Member counter
     --------------------------------------------------------- */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function runCounter() {
    var el = document.getElementById('counter');
    if (!el) return;
    var members = (DATA.members && DATA.members.count) || Number(el.getAttribute('data-target')) || 0;
    var target = members;
    el.setAttribute('aria-label', members + '人');
    var statMembers = document.getElementById('stat-members');
    if (statMembers) statMembers.textContent = members.toLocaleString('en-US');

    if (reduceMotion) {
      el.textContent = target.toLocaleString('en-US');
      return;
    }

    var duration = 2200;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var value = Math.round(easeOutCubic(p) * target);
      el.textContent = value.toLocaleString('en-US');
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-US');
        stage.show('finale');
      }
    }
    requestAnimationFrame(step);
  }

  function runMilestoneBar() {
    var track = document.getElementById('milestone-track');
    if (!track) return;
    requestAnimationFrame(function () { track.style.width = '100%'; });
  }

  /* ---------------------------------------------------------
     4. Celebration particles
     Confetti cannons, fireworks shells, glitter and a slow
     bokeh layer that keeps the hero alive between bursts.
     --------------------------------------------------------- */
  var CONFETTI_COLORS = ['#36C5F0', '#2EB67D', '#ECB22E', '#E01E5A', '#FFFFFF', '#C9A0CB'];
  var GOLD_COLORS = ['#FFE9A8', '#FFD166', '#FFF6DA', '#F7C94B'];
  var SPARK_COLORS = ['#FFFFFF', '#FFE9A8', '#9BE7FF', '#FFC4DC', '#BDFFD9'];

  function pick(list) { return list[(Math.random() * list.length) | 0]; }

  function toRgb(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgba(hex, a) {
    var c = toRgb(hex);
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  }

  function shade(hex, k) {
    var c = toRgb(hex);
    return 'rgb(' + Math.round(c[0] * k) + ',' + Math.round(c[1] * k) + ',' + Math.round(c[2] * k) + ')';
  }

  // Pre-rendered radial sprites: glow without the cost of shadowBlur.
  var glowSprites = {};
  function glowSprite(color) {
    if (glowSprites[color]) return glowSprites[color];
    var s = document.createElement('canvas');
    s.width = s.height = 64;
    var g = s.getContext('2d');
    var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, rgba(color, 1));
    grad.addColorStop(0.2, rgba(color, 0.7));
    grad.addColorStop(0.5, rgba(color, 0.2));
    grad.addColorStop(1, rgba(color, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    glowSprites[color] = s;
    return s;
  }

  var stage = (function () {
    var canvas = document.getElementById('confetti');
    var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
    var ambientCanvas = document.getElementById('hero-sparks');
    var actx = ambientCanvas && ambientCanvas.getContext ? ambientCanvas.getContext('2d') : null;
    var hero = document.querySelector('.hero');

    var pieces = [];
    var motes = [];
    var timers = [];
    var raf = null;
    var last = 0;
    var clock = 0;
    var hadPieces = false;
    var ambientOn = false;
    var small = false;
    var maxPieces = 1100;
    var box = { w: 0, h: 0 };
    var showIndex = 1;
    var SHOWS = ['finale', 'fireworks', 'cannons', 'gold'];

    /* ---- sizing ---- */
    function sizeAll() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      small = window.innerWidth < 700;
      maxPieces = small ? 460 : 1100;

      if (canvas && ctx) {
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      if (ambientCanvas && actx && hero) {
        box.w = hero.clientWidth;
        box.h = hero.clientHeight;
        ambientCanvas.width = Math.floor(box.w * dpr);
        ambientCanvas.height = Math.floor(box.h * dpr);
        actx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (motes.length) seedMotes();
      }
    }

    /* ---- ambient bokeh inside the hero ---- */
    function newMote(y) {
      return {
        x: Math.random() * box.w,
        y: y,
        r: 1.2 + Math.random() * (small ? 2.2 : 3.4),
        vy: -(0.08 + Math.random() * 0.26),
        sway: 6 + Math.random() * 22,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.022,
        alpha: 0.22 + Math.random() * 0.46,
        twinkle: 0.4 + Math.random() * 1.6,
        color: Math.random() < 0.55 ? pick(GOLD_COLORS) : pick(SPARK_COLORS)
      };
    }

    function seedMotes() {
      var count = small ? 16 : 34;
      motes = [];
      for (var i = 0; i < count; i++) motes.push(newMote(Math.random() * box.h));
    }

    function drawAmbient(dt) {
      actx.clearRect(0, 0, box.w, box.h);
      actx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.y += m.vy * dt;
        m.phase += m.speed * dt;
        if (m.y < -24) { motes[i] = newMote(box.h + 24); continue; }
        var a = m.alpha * (0.5 + 0.5 * Math.sin(clock * 0.0016 * m.twinkle + m.phase));
        if (a <= 0.02) continue;
        var s = m.r * 7;
        actx.globalAlpha = Math.min(a, 1);
        actx.drawImage(glowSprite(m.color), m.x + Math.sin(m.phase) * m.sway - s / 2, m.y - s / 2, s, s);
      }
      actx.globalAlpha = 1;
      actx.globalCompositeOperation = 'source-over';
    }

    /* ---- particle factories ---- */
    function add(p) {
      if (pieces.length >= maxPieces) pieces.shift();
      pieces.push(p);
    }

    function confetti(o) {
      var color = o.color || pick(CONFETTI_COLORS);
      var roll = Math.random();
      var kind = roll < 0.12 ? 'star' : (roll < 0.3 ? 'circle' : 'ribbon');
      var size = (o.size || 1) * (6 + Math.random() * 9);
      return {
        kind: kind,
        x: o.x, y: o.y,
        vx: o.vx, vy: o.vy,
        w: size,
        h: kind === 'ribbon' ? size * (0.3 + Math.random() * 0.28) : size,
        color: color,
        back: shade(color, 0.55),
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.26,
        flip: Math.random() * Math.PI * 2,
        vflip: 0.07 + Math.random() * 0.15,
        sway: (0.12 + Math.random() * 0.5) * (Math.random() < 0.5 ? -1 : 1),
        phase: Math.random() * Math.PI * 2,
        gravity: 0.042 + Math.random() * 0.03,
        drag: 0.988,
        life: 1,
        decay: 0.0022 + Math.random() * 0.0012
      };
    }

    function spark(x, y, color, power, sizeMul) {
      var a = Math.random() * Math.PI * 2;
      var sp = power * (0.2 + Math.random() * Math.random() + Math.random() * 0.6);
      return {
        kind: 'spark',
        x: x, y: y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        r: (sizeMul || 1) * (1.3 + Math.random() * 2.2),
        color: color || pick(SPARK_COLORS),
        gravity: 0.013 + Math.random() * 0.02,
        drag: 0.958,
        life: 1,
        decay: 0.008 + Math.random() * 0.013,
        trail: 1.4 + Math.random() * 1.6
      };
    }

    function ring(x, y, color) {
      return {
        kind: 'ring',
        x: x, y: y,
        r: 4,
        vr: small ? 4.2 : 6,
        color: color,
        life: 1,
        decay: 0.05
      };
    }

    /* ---- fireworks ---- */
    function launchShell(x, color) {
      var h = window.innerHeight;
      add({
        kind: 'shell',
        x: x,
        y: h + 8,
        vx: (Math.random() - 0.5) * 0.9,
        vy: -(h * 0.0148 + Math.random() * 2.2),
        r: 2.4,
        color: color || pick(SPARK_COLORS),
        gravity: 0.13,
        drag: 0.996,
        life: 1,
        decay: 0,
        trail: 2.2,
        fuse: 44 + Math.random() * 26
      });
    }

    function explode(p) {
      var count = small ? 48 : 96;
      var power = small ? 3.6 : 5;
      var mono = Math.random() < 0.55 ? p.color : null;
      var i;
      for (i = 0; i < count; i++) add(spark(p.x, p.y, mono || pick(SPARK_COLORS), power, 1));
      for (i = 0; i < (small ? 6 : 14); i++) {
        var a = Math.random() * Math.PI * 2;
        var sp = power * 0.45 * (0.4 + Math.random());
        add(confetti({ x: p.x, y: p.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 0.8 }));
      }
      add(ring(p.x, p.y, mono || '#FFFFFF'));
    }

    /* ---- shows ---- */
    function cannon(side) {
      var w = window.innerWidth;
      var h = window.innerHeight;
      var x = side < 0 ? w * 0.05 : w * 0.95;
      var y = h * 0.97;
      var base = side < 0 ? -Math.PI / 3 : -Math.PI * 2 / 3;
      var power = Math.max(w, h) * 0.021;
      var i, a, sp;

      for (i = 0; i < (small ? 62 : 120); i++) {
        a = base + (Math.random() - 0.5) * 0.52;
        sp = power * (0.55 + Math.random() * 0.7);
        add(confetti({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp }));
      }
      for (i = 0; i < (small ? 16 : 34); i++) {
        a = base + (Math.random() - 0.5) * 0.46;
        sp = power * (0.7 + Math.random() * 0.8);
        var sk = spark(x, y, pick(GOLD_COLORS), 0, 0.9);
        sk.vx = Math.cos(a) * sp;
        sk.vy = Math.sin(a) * sp;
        sk.decay = 0.006 + Math.random() * 0.008;
        add(sk);
      }
    }

    function rain(count, gold) {
      var w = window.innerWidth;
      var h = window.innerHeight;
      var n = Math.round(count * (small ? 0.5 : 1));
      for (var i = 0; i < n; i++) {
        add(confetti({
          x: Math.random() * w,
          y: -30 - Math.random() * h * 0.7,
          vx: (Math.random() - 0.5) * 1.8,
          vy: 1.2 + Math.random() * 3,
          color: gold ? pick(GOLD_COLORS) : null
        }));
      }
    }

    function later(ms, fn) {
      timers.push(setTimeout(function () { fn(); wake(); }, ms));
    }

    function fireworks(n) {
      var w = window.innerWidth;
      for (var i = 0; i < n; i++) {
        later(i * (190 + Math.random() * 190), function () {
          launchShell(w * (0.14 + Math.random() * 0.72));
        });
      }
    }

    function pulseHero() {
      if (!hero) return;
      hero.classList.remove('is-celebrating');
      // reflow so the animation restarts on repeated clicks
      void hero.offsetWidth;
      hero.classList.add('is-celebrating');
      later(1000, function () { hero.classList.remove('is-celebrating'); });
    }

    function show(name) {
      if (reduceMotion || !ctx) return;
      if (!name) {
        name = SHOWS[showIndex % SHOWS.length];
        showIndex++;
      }

      if (name === 'finale') {
        cannon(-1);
        cannon(1);
        rain(150);
        fireworks(small ? 3 : 5);
        later(540, function () { cannon(-1); cannon(1); });
      } else if (name === 'fireworks') {
        fireworks(small ? 4 : 7);
        rain(50, true);
      } else if (name === 'cannons') {
        cannon(-1);
        cannon(1);
        rain(70);
        later(280, function () { cannon(-1); cannon(1); });
      } else {
        rain(180, true);
        fireworks(small ? 2 : 3);
      }

      pulseHero();
      wake();
    }

    /* ---- drawing ---- */
    function star(g, r) {
      g.beginPath();
      for (var i = 0; i < 10; i++) {
        var rad = i % 2 ? r * 0.44 : r;
        var a = (Math.PI / 5) * i - Math.PI / 2;
        var px = Math.cos(a) * rad;
        var py = Math.sin(a) * rad;
        if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.closePath();
      g.fill();
    }

    function drawPieces(dt) {
      var w = window.innerWidth;
      var h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (var i = pieces.length - 1; i >= 0; i--) {
        var p = pieces[i];

        p.vy += p.gravity * dt;
        p.vx *= Math.pow(p.drag, dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.kind === 'shell') {
          p.fuse -= dt;
          if (p.fuse <= 0 || p.vy > -0.6) {
            explode(p);
            pieces.splice(i, 1);
            continue;
          }
        } else if (p.kind === 'spark' || p.kind === 'ring') {
          p.life -= p.decay * dt;
          if (p.life <= 0) { pieces.splice(i, 1); continue; }
          if (p.kind === 'ring') p.r += p.vr * dt;
        } else {
          p.life -= p.decay * dt;
          if (p.life <= 0) { pieces.splice(i, 1); continue; }
          p.rot += p.vr * dt;
          p.flip += p.vflip * dt;
          p.x += Math.sin(p.phase + clock * 0.004) * p.sway * dt;
        }

        if (p.y > h + 80 || p.x < -140 || p.x > w + 140) { pieces.splice(i, 1); continue; }

        if (p.kind === 'spark' || p.kind === 'shell') {
          var sprite = glowSprite(p.color);
          var s = p.r * 8 * (p.kind === 'shell' ? 1 : 0.5 + p.life * 0.7);
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = Math.min(1, Math.max(0, p.life));
          ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
          ctx.globalAlpha *= 0.32;
          ctx.drawImage(
            sprite,
            p.x - p.vx * p.trail - s * 0.35,
            p.y - p.vy * p.trail - s * 0.35,
            s * 0.7, s * 0.7
          );
        } else if (p.kind === 'ring') {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = Math.min(1, p.life * 0.7);
          ctx.strokeStyle = rgba(p.color, 1);
          ctx.lineWidth = 1 + 5 * p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          var f = Math.cos(p.flip);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = Math.min(0.92, p.life * 3);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(f, 1);
          ctx.fillStyle = f < 0 ? p.back : p.color;
          if (p.kind === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.w * 0.42, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.kind === 'star') {
            star(ctx, p.w * 0.6);
          } else {
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          }
          ctx.restore();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    /* ---- loop ---- */
    function busy() { return pieces.length > 0 || (ambientOn && motes.length > 0); }

    function wake() {
      if (reduceMotion || document.hidden) return;
      if (!raf && busy()) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    }

    function frame(ts) {
      raf = null;
      var dt = last ? Math.min((ts - last) / 16.6667, 3) : 1;
      last = ts;
      clock += dt * 16.6667;

      if (ambientOn && actx) drawAmbient(dt);

      if (pieces.length) {
        drawPieces(dt);
        hadPieces = true;
      } else if (hadPieces && ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        hadPieces = false;
      }

      if (busy() && !document.hidden) raf = requestAnimationFrame(frame);
    }

    /* ---- wiring ---- */
    function watchHero() {
      if (!actx || !hero) return;
      if (!('IntersectionObserver' in window)) {
        ambientOn = true;
        seedMotes();
        wake();
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          ambientOn = entry.isIntersecting;
          if (ambientOn) {
            if (!motes.length) seedMotes();
            wake();
          } else if (actx) {
            actx.clearRect(0, 0, box.w, box.h);
          }
        });
      }, { threshold: 0 });
      io.observe(hero);
    }

    function init() {
      sizeAll();
      if (reduceMotion) return;
      watchHero();
      window.addEventListener('resize', sizeAll);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          while (timers.length) clearTimeout(timers.pop());
        } else {
          wake();
        }
      });
    }

    return { init: init, show: show };
  })();

  /* ---------------------------------------------------------
     5. Reveal on scroll
     --------------------------------------------------------- */
  function setupReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------
     Go
     --------------------------------------------------------- */
  stage.init();
  setupReveal();
  runCounter();
  runMilestoneBar();

  var celebrateBtn = document.getElementById('celebrate');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', function () { stage.show(); });
  }
})();
