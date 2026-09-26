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
        burst(160);
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
     4. Confetti
     --------------------------------------------------------- */
  var canvas = document.getElementById('confetti');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var pieces = [];
  var raf = null;
  var COLORS = ['#36C5F0', '#2EB67D', '#ECB22E', '#E01E5A', '#FFFFFF', '#C9A0CB'];

  function sizeCanvas() {
    if (!canvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function burst(count) {
    if (!ctx || reduceMotion) return;
    var w = window.innerWidth;
    for (var i = 0; i < count; i++) {
      pieces.push({
        x: w * (0.15 + Math.random() * 0.7),
        y: -20 - Math.random() * window.innerHeight * 0.3,
        vx: (Math.random() - 0.5) * 2.6,
        vy: 1.6 + Math.random() * 3.4,
        size: 5 + Math.random() * 7,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.22,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: Math.random() < 0.35 ? 'circle' : 'rect',
        life: 1
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    var h = window.innerHeight;
    for (var i = pieces.length - 1; i >= 0; i--) {
      var p = pieces[i];
      p.vy += 0.035;
      p.vx *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      if (p.y > h + 40) { pieces.splice(i, 1); continue; }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.92;
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.5);
      }
      ctx.restore();
    }

    if (pieces.length) {
      raf = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      raf = null;
    }
  }

  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  var celebrateBtn = document.getElementById('celebrate');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', function () { burst(220); });
  }

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
  setupReveal();
  runCounter();
  runMilestoneBar();
})();
