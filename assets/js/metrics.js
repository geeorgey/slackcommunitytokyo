/* =========================================================
   Slack Community :Tokyo — 管理ダッシュボード集計の可視化
   ---------------------------------------------------------
   data/metrics.js の値だけを読み、インラインSVGでグラフを組み立てます。
   外部チャートライブラリ・CDNは一切使いません。
   色は assets/css/style.css の CSS 変数（--viz-*）を参照するため、
   ライト/ダークの切り替えは再描画なしで追従します。

   用語の扱い（ここを崩さないこと）
     memberGrowth … 「登録メンバー累計」。新規登録者数でもイベント参加者数でもない。
     registrations … 「延べ申込」。ユニークな人数ではない。
     checkIns      … 「延べ参加（チェックイン記録）」。ユニーク参加者数でも
                      全実参加者数でもなく、未チェックインの現地参加者を含まない。
   ========================================================= */
(function () {
  'use strict';

  var M = window.SCT_METRICS;
  var D = window.SCT_DATA || {};
  if (!M) return;

  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- 検証（失敗はコンソールに大きく出す） ---------- */
  var CHECKS = window.SCT_CHECKS = { passed: [], failed: [] };
  function check(name, cond, detail) {
    var line = name + (detail ? ' — ' + detail : '');
    if (cond) { CHECKS.passed.push(line); }
    else { CHECKS.failed.push(line); console.error('[SCT metrics] 検証NG: ' + line); }
    return !!cond;
  }

  /* ---------- 小さなヘルパ ---------- */
  function el(name, attrs, cls) {
    var e = document.createElementNS(SVGNS, name);
    if (cls) e.setAttribute('class', cls);
    if (attrs) for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    return e;
  }
  function stxt(name, str, attrs, cls) {
    var e = el(name, attrs, cls);
    e.appendChild(document.createTextNode(str));
    return e;
  }
  function h(tag, cls, str) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (str !== undefined && str !== null) e.textContent = str;
    return e;
  }
  function nf(n) { return Number(n).toLocaleString('en-US'); }
  function ym(m) { var p = m.split('-'); return p[0] + '.' + p[1]; }
  function ymShort(m) { var p = m.split('-'); return p[0].slice(2) + '.' + p[1]; }
  function ymJa(m) { var p = m.split('-'); return p[0] + '年' + Number(p[1]) + '月'; }
  function monthsBetween(a, b) {
    var A = a.split('-'), B = b.split('-');
    return (Number(B[0]) - Number(A[0])) * 12 + (Number(B[1]) - Number(A[1]));
  }
  /* ざっくりのテキスト幅（和文は全角1.0、英数は約0.54） */
  function tw(s, size) {
    var w = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      w += (c < 0x2E80 ? 0.54 : 1.0) * size;
    }
    return w;
  }
  /* データ端だけ丸めた横棒のパス */
  function hbarPath(x, y, len, bh, r) {
    if (len <= 0.5) return '';
    var rr = Math.min(r, len, bh / 2);
    return 'M' + x + ',' + y +
      'H' + (x + len - rr) +
      'a' + rr + ',' + rr + ' 0 0 1 ' + rr + ',' + rr +
      'V' + (y + bh - rr) +
      'a' + rr + ',' + rr + ' 0 0 1 ' + (-rr) + ',' + rr +
      'H' + x + 'Z';
  }

  /* =========================================================
     A. 登録メンバー累計
     ========================================================= */
  var G = M.memberGrowth;
  var S = G.series;
  var base = S[0], latest = S[S.length - 1];
  var delta = latest.total - base.total;
  var pctNum = delta / base.total * 100;
  var pctStr = (Math.round(pctNum * 10) / 10).toFixed(1);
  var multNum = latest.total / base.total;
  var multStr = (Math.round(multNum * 100) / 100).toFixed(2);
  var spanMonths = monthsBetween(base.month, latest.month);

  check('登録メンバー累計: 点の数が14', S.length === 14, S.length + '点');
  check('登録メンバー累計: 起点が baselineMonth と一致', base.month === G.baselineMonth, base.month);
  check('登録メンバー累計: 最新月が latestMonth と一致', latest.month === G.latestMonth, latest.month);
  check('登録メンバー累計: 最新月が暫定（provisionalMonth）', latest.month === G.provisionalMonth, G.provisionalMonth);
  check('登録メンバー累計: 起点548 / 最新1001', base.total === 548 && latest.total === 1001, base.total + ' → ' + latest.total);
  check('1001 - 548 = 453', delta === 453, String(delta));
  check('453 / 548 = 82.7%', pctStr === '82.7', pctStr + '%');
  check('1001 / 548 = 1.83倍', multStr === '1.83', multStr + '倍');
  check('2025-08 → 2026-09 は13か月', spanMonths === 13, spanMonths + 'か月');
  check('累計なので単調非減少', S.every(function (p, i) { return i === 0 || p.total >= S[i - 1].total; }));
  check('公開ページの1,002は系列に含めない',
    S.every(function (p) { return p.total !== G.publicPage.count; }),
    '公開ページ=' + G.publicPage.count + ' / 系列最新=' + latest.total);

  /* =========================================================
     B. 参加実績
     ========================================================= */
  var A = M.attendance;
  var MO = A.months;
  var heldMonths = MO.filter(function (m) { return m.status === 'held'; });
  var regSum = 0, chkSum = 0;
  MO.forEach(function (m) {
    if (typeof m.registrations === 'number') regSum += m.registrations;
    if (typeof m.checkIns === 'number') chkSum += m.checkIns;
  });
  var rateNum = chkSum / regSum * 100;
  var rateRounded = Math.round(rateNum);

  check('延べ申込の月別合計 = 337', regSum === A.totals.registrations && regSum === 337, String(regSum));
  check('延べ参加（チェックイン記録）の月別合計 = 208', chkSum === A.totals.checkIns && chkSum === 208, String(chkSum));
  check('208 / 337 の丸めが62%', rateRounded === A.totals.checkInRatePct && rateRounded === 62,
    rateNum.toFixed(2) + '% → ' + rateRounded + '%');
  check('集計のある月は10か月', heldMonths.length === 10, heldMonths.length + 'か月');
  check('∅の月は null（0ではない）',
    MO.filter(function (m) { return m.status !== 'held'; })
      .every(function (m) { return m.registrations === null && m.checkIns === null; }));
  check('2025-12 のチェックインは数値の0（nullではない）',
    (function () { var d = MO.filter(function (m) { return m.month === '2025-12'; })[0];
      return d && d.checkIns === 0 && d.registrations === 24; })());
  check('2026-09 は開催予定（0ではない）',
    (function () { var u = MO.filter(function (m) { return m.month === '2026-09'; })[0];
      return u && u.status === 'upcoming' && u.registrations === null; })());
  check('主催者の概数50は合計に加算されていない',
    regSum === 337 && chkSum === 208 &&
    MO.some(function (m) { return m.organiserEstimate && m.organiserEstimate.estimatedAttendance === 50; }),
    '合計は 337 / 208 のまま');

  /* ---------- 月 → イベントの対応（各月1件であることを確認） ---------- */
  var events = Array.isArray(D.events) ? D.events : [];
  var byMonth = {};
  events.forEach(function (ev) {
    var k = String(ev.date).slice(0, 7);
    (byMonth[k] = byMonth[k] || []).push(ev);
  });
  var linkageOK = heldMonths.every(function (m) {
    return byMonth[m.month] && byMonth[m.month].length === 1;
  });
  var linkageDetail = heldMonths.map(function (m) {
    return m.month + ':' + ((byMonth[m.month] || []).length);
  }).join(' ');
  check('集計のある各月の開催は1件だけ（月→イベントの紐付けが一意）', linkageOK, linkageDetail);
  check('掲載イベントは11件（開催済み10＋予定1）',
    events.length === 11 && events.filter(function (e) { return e.upcoming; }).length === 1,
    events.length + '件');

  /* =========================================================
     1. 見出しと大きな数字
     ========================================================= */
  (function renderGrowthHead() {
    var title = document.getElementById('growth-title');
    if (title) {
      title.textContent = nf(base.total) + '人から、約' + spanMonths + 'か月で1,000人突破。';
    }
    var lead = document.getElementById('growth-lead');
    if (lead) {
      lead.innerHTML = '';
      lead.appendChild(document.createTextNode(
        ymJa(base.month) + '、新しいチャプターリーダー体制でチャプターは再起動しました。その時点の'));
      lead.appendChild(h('b', null, '登録メンバー累計'));
      lead.appendChild(document.createTextNode('は ' + nf(base.total) + '人。そこから約' + spanMonths + 'か月、'));
      lead.appendChild(document.createTextNode('管理ダッシュボードの登録メンバー累計は '));
      lead.appendChild(h('b', null, nf(latest.total) + '人'));
      lead.appendChild(document.createTextNode('（' + ymJa(latest.month) + '26日時点）になりました。ここに出てくる数字は、その月に新しく登録した人数でも、イベントに参加した人数でもなく、チャプターに登録しているメンバーの累計です。'));
    }

    var host = document.getElementById('growth-stats');
    if (!host) return;
    var tiles = [
      { num: '＋' + nf(delta) + '人', label: ymJa(base.month) + '比の増加',
        sub: nf(base.total) + '人 → ' + nf(latest.total) + '人（登録メンバー累計）' },
      { num: '＋' + pctStr + '%', label: '増加率',
        sub: ymJa(base.month) + 'の表示値を基準にした伸び' },
      { num: '約' + multStr + '倍', label: '倍率',
        sub: '約' + spanMonths + 'か月で' }
    ];
    tiles.forEach(function (t) {
      var d = h('div', 'growth-stat');
      d.appendChild(h('span', 'gs-num', t.num));
      d.appendChild(h('span', 'gs-label', t.label));
      d.appendChild(h('span', 'gs-sub', t.sub));
      host.appendChild(d);
    });
  })();

  /* =========================================================
     2. 登録メンバー累計の折れ線
     ========================================================= */
  function drawGrowth() {
    var host = document.getElementById('chart-growth');
    if (!host) return;
    host.textContent = '';

    var w = Math.max(280, Math.round(host.clientWidth || 320));
    var narrow = w < 560;
    var hgt = narrow ? 304 : 344;
    var padL = narrow ? 40 : 52, padR = narrow ? 16 : 24, padT = 44, padB = narrow ? 36 : 40;
    var plotW = w - padL - padR, plotH = hgt - padT - padB;
    var yMin = 500, yMax = 1050;
    var X = function (i) { return padL + i * plotW / (S.length - 1); };
    var Y = function (v) { return padT + (yMax - v) / (yMax - yMin) * plotH; };

    var descParts = S.map(function (p) { return ymJa(p.month) + ' ' + nf(p.total) + '人'; }).join('、');
    var desc = '折れ線グラフ。管理ダッシュボードの登録メンバー累計（running total of chapter memberships）の月別表示値。' +
      ymJa(base.month) + 'の' + nf(base.total) + '人（新リーダー体制での再起動時点）から一貫して増え続け、' +
      ymJa(latest.month) + 'に' + nf(latest.total) + '人となり1,000人を超えました。期間全体で＋' + nf(delta) +
      '人、＋' + pctStr + '%、約' + multStr + '倍です。最終点（' + ymJa(latest.month) + '）は月末確定値ではなく' +
      G.asOf + '時点の暫定値で、中抜きの点と破線で示しています。読み取れる値は ' + descParts +
      '。同じ数値は下の表にもあります。';

    var svg = el('svg', {
      viewBox: '0 0 ' + w + ' ' + hgt,
      width: w, height: hgt,
      role: 'img',
      'aria-label': desc
    });
    svg.appendChild(stxt('title', '登録メンバー累計の推移（' + ymJa(base.month) + '〜' + ymJa(latest.month) + '）'));
    svg.appendChild(stxt('desc', desc));

    /* --- グリッド + Y軸ラベル --- */
    for (var v = 500; v <= 1000; v += 100) {
      var gy = Y(v);
      svg.appendChild(el('line', { x1: padL, y1: gy, x2: w - padR, y2: gy },
        v === 1000 ? 'viz-ref-line' : 'viz-grid-line'));
      svg.appendChild(stxt('text', nf(v), { x: padL - 7, y: gy + 4, 'text-anchor': 'end' }, 'viz-tick'));
    }
    svg.appendChild(stxt('text', '1,000人ライン',
      { x: padL + 4, y: Y(1000) - 7 }, 'viz-anno-sub'));

    /* --- 面 + 線 --- */
    var pts = S.map(function (p, i) { return X(i) + ',' + Y(p.total); });
    var solid = pts.slice(0, S.length - 1);
    svg.appendChild(el('path', {
      d: 'M' + solid.join('L') + 'L' + X(S.length - 2) + ',' + Y(yMin) + 'L' + X(0) + ',' + Y(yMin) + 'Z'
    }, 'viz-area'));
    svg.appendChild(el('path', { d: 'M' + solid.join('L') }, 'viz-line'));
    svg.appendChild(el('path', {
      d: 'M' + pts[S.length - 2] + 'L' + pts[S.length - 1]
    }, 'viz-line-prov'));

    /* --- 起点の注記（リーダー体制交代・再起動） --- */
    var a0 = G.annotations && G.annotations[0];
    if (a0) {
      var ax = X(0), ay = Y(base.total);
      svg.appendChild(el('line', { x1: ax, y1: padT + 66, x2: ax, y2: ay - 9 }, 'viz-callout'));
      svg.appendChild(stxt('text', ymJa(base.month) + '・' + nf(base.total) + '人',
        { x: ax + 8, y: padT + 40 }, 'viz-anno'));
      svg.appendChild(stxt('text', a0.label,
        { x: ax + 8, y: padT + 55 }, 'viz-anno-sub'));
      svg.appendChild(el('circle', { cx: ax, cy: ay, r: 5 }, 'viz-dot'));
    }

    /* --- 最終点（暫定値） --- */
    var lx = X(S.length - 1), ly = Y(latest.total);
    svg.appendChild(stxt('text', nf(latest.total) + '人',
      { x: lx, y: ly - 13, 'text-anchor': 'end' }, 'viz-value'));
    svg.appendChild(el('circle', { cx: lx, cy: ly, r: 5 }, 'viz-dot-hollow'));

    /* --- X軸 --- */
    svg.appendChild(el('line', { x1: padL, y1: padT + plotH, x2: w - padR, y2: padT + plotH }, 'viz-axis-line'));
    var stride = Math.max(1, Math.ceil(S.length * 46 / plotW));
    var useShort = stride > 1;
    S.forEach(function (p, i) {
      if ((S.length - 1 - i) % stride !== 0) return;
      svg.appendChild(stxt('text', useShort ? ymShort(p.month) : ym(p.month),
        { x: X(i), y: padT + plotH + 18, 'text-anchor': 'middle' }, 'viz-tick'));
    });

    /* --- ホバー/フォーカスで値を表示 --- */
    var hitR = Math.min(17, Math.max(11, plotW / (S.length - 1) / 2 + 5));
    S.forEach(function (p, i) {
      var px = X(i), py = Y(p.total);
      var isLast = i === S.length - 1;
      var lbl = ym(p.month) + '  ' + nf(p.total) + '人';
      var aria = ymJa(p.month) + ' 登録メンバー累計 ' + nf(p.total) + '人' +
        (isLast ? '（' + G.asOf + '時点の暫定値）' : '');
      var g = el('g', { tabindex: '0', role: 'img', 'aria-label': aria }, 'viz-pt');
      g.appendChild(stxt('title', aria));

      var rev = el('g', null, 'viz-reveal');
      rev.appendChild(el('line', { x1: px, y1: padT, x2: px, y2: padT + plotH }, 'viz-cross'));
      rev.appendChild(el('circle', { cx: px, cy: py, r: 4 }, 'viz-dot'));

      var bw = Math.round(tw(lbl, 11)) + 18, bh = 22;
      var bx = Math.min(Math.max(2, px - bw / 2), w - bw - 2);
      var by = py - bh - 12;
      if (by < padT + 2) by = py + 12;
      rev.appendChild(el('rect', { x: bx, y: by, width: bw, height: bh, rx: 6 }, 'viz-tip-box'));
      rev.appendChild(stxt('text', lbl, { x: bx + bw / 2, y: by + 15, 'text-anchor': 'middle' }, 'viz-tip-text'));

      g.appendChild(rev);
      g.appendChild(el('circle', { cx: px, cy: py, r: hitR }, 'viz-hit'));
      svg.appendChild(g);
    });

    host.appendChild(svg);
  }

  /* =========================================================
     3. 登録メンバー累計のキャプション・表・注記
     ========================================================= */
  (function renderGrowthRest() {
    var cap = document.getElementById('growth-caption');
    if (cap) {
      cap.innerHTML = '';
      cap.appendChild(h('b', null, '最新の' + ymJa(latest.month) + '（' + nf(latest.total) + '人）は月末確定値ではありません。'));
      cap.appendChild(document.createTextNode(
        G.asOf + '時点の表示値で、グラフでは中抜きの点と破線で示しています。' +
        'この系列は管理ダッシュボード Members の「' + G.seriesName + '」＝' + G.seriesNameJa + 'です。' +
        '公開チャプターページは同日 ' + nf(G.publicPage.count) + '人と表示していますが、集計元が異なるためこの系列には混ぜていません。'));
    }

    var tbl = document.getElementById('table-growth');
    if (tbl) {
      tbl.appendChild(stxt('caption',
        '出典：' + M.source.name + '（' + M.source.views[0] + '）／取得日：' + M.source.retrievedAt +
        '／系列：' + G.seriesName + '（' + G.seriesNameJa + '）。' + G.definition));
      var thead = document.createElement('thead');
      var trh = document.createElement('tr');
      ['月', '登録メンバー累計（人）', '前月差（人）'].forEach(function (t) {
        var th = h('th', null, t); th.setAttribute('scope', 'col'); trh.appendChild(th);
      });
      thead.appendChild(trh); tbl.appendChild(thead);

      var tb = document.createElement('tbody');
      S.forEach(function (p, i) {
        var tr = document.createElement('tr');
        var th = h('th', null, ym(p.month)); th.setAttribute('scope', 'row');
        if (p.month === G.provisionalMonth) {
          var sp = h('span', 'cell-note', G.asOf + '時点の暫定値（月末確定値ではありません）');
          th.appendChild(sp);
        }
        tr.appendChild(th);
        tr.appendChild(h('td', null, nf(p.total)));
        tr.appendChild(h('td', null, i === 0 ? '—（基準）' : '＋' + nf(p.total - S[i - 1].total)));
        tb.appendChild(tr);
      });
      tbl.appendChild(tb);

      var tf = document.createElement('tfoot');
      var trf = document.createElement('tr');
      var thf = h('th', null, ymJa(base.month) + '比'); thf.setAttribute('scope', 'row');
      trf.appendChild(thf);
      trf.appendChild(h('td', null, '＋' + nf(delta)));
      trf.appendChild(h('td', null, '＋' + pctStr + '% / 約' + multStr + '倍'));
      tf.appendChild(trf); tbl.appendChild(tf);
    }

    var notes = document.getElementById('growth-notes');
    if (notes) {
      [
        { cls: '', html: '<b>この系列が表しているもの：</b>' + G.definition },
        { cls: 'is-warn', html: '<b>最新月について：</b>' + G.provisionalNote },
        { cls: 'is-warn', html: '<b>公開ページの1,002人との違い：</b>' + G.publicPage.note },
        { cls: 'is-src', html: '出典：' + M.source.name + '（' + M.source.views.join(' / ') + '）／取得日 ' +
            M.source.retrievedAt + '／' + M.source.nature + '。個人を特定できる情報は掲載していません。' }
      ].forEach(function (n) {
        var p = h('p', 'viz-note-item' + (n.cls ? ' ' + n.cls : ''));
        p.innerHTML = n.html;
        notes.appendChild(p);
      });
    }
  })();

  /* =========================================================
     4. 参加実績の大きな数字・定義
     ========================================================= */
  (function renderAttendHead() {
    var host = document.getElementById('attend-stats');
    if (host) {
      [
        { num: nf(A.totals.registrations) + '件', label: '延べ申込',
          sub: '申込件数の合計。ユニークな人数ではありません' },
        { num: nf(A.totals.checkIns) + '件', label: '延べ参加（チェックイン記録）',
          sub: 'チェックイン記録の件数。未チェックインの現地参加者は含みません' },
        { num: A.totals.checkInRatePct + '%', label: 'チェックイン率',
          sub: '管理画面の丸め表示値（Check-ins / Attendees）' }
      ].forEach(function (t) {
        var d = h('div', 'growth-stat');
        d.appendChild(h('span', 'gs-num', t.num));
        d.appendChild(h('span', 'gs-label', t.label));
        d.appendChild(h('span', 'gs-sub', t.sub));
        host.appendChild(d);
      });
    }

    var def = document.getElementById('attend-def');
    if (def) {
      def.innerHTML = '';
      def.appendChild(h('b', null, '管理画面のチェックイン率の定義（原文）'));
      def.appendChild(h('span', 'viz-def-verbatim', A.definitions.checkInRateVerbatim));
      def.appendChild(document.createTextNode(
        '集計期間：' + A.filter.field + ' ' + A.filter.from + '〜' + A.filter.to + '。' + A.filter.note +
        ' ' + A.definitions.checkInRateJa));
    }

    var lg = document.getElementById('attend-legend');
    if (lg) {
      [['is-s1', '延べ申込'], ['is-s2', '延べ参加（チェックイン記録）']].forEach(function (p) {
        var s = h('span', 'viz-legend-item');
        s.appendChild(h('span', 'viz-swatch ' + p[0]));
        s.appendChild(h('span', null, p[1]));
        lg.appendChild(s);
      });
    }
    var lgs = document.getElementById('attend-legend-state');
    if (lgs) {
      lgs.appendChild(h('span', 'viz-legend-item', '3つの状態の見分け方：'));
      [['is-zero', A.stateLabels.zero.table + '（' + A.stateLabels.zero.note + '）'],
       ['is-nodata', A.stateLabels.noData.table + '（∅・' + A.stateLabels.noData.note + '）'],
       ['is-upcoming', A.stateLabels.upcoming.table + '（' + A.stateLabels.upcoming.note + '）']
      ].forEach(function (p) {
        var s = h('span', 'viz-legend-item');
        s.appendChild(h('span', 'viz-swatch ' + p[0]));
        s.appendChild(h('span', null, p[1]));
        lgs.appendChild(s);
      });
    }
  })();

  /* =========================================================
     5. 参加実績の横棒グラフ
     ========================================================= */
  function drawAttend() {
    var host = document.getElementById('chart-attend');
    if (!host) return;
    host.textContent = '';

    var w = Math.max(280, Math.round(host.clientWidth || 320));
    var narrow = w < 560;
    var labelW = narrow ? 46 : 66;
    var rightW = narrow ? 46 : 56;
    var padT = 10, axisH = 28;
    var rowH = narrow ? 40 : 44;
    var barH = narrow ? 12 : 13, gap = 3;
    var plotX = labelW, plotW = Math.max(60, w - labelW - rightW);
    var xMax = 60;
    var XV = function (v) { return plotX + v / xMax * plotW; };

    /* 行の高さ（注記が付く行だけ背を高くする） */
    var rows = MO.map(function (m) {
      var extra = (m.organiserEstimate || m.checkInsZero) ? (narrow ? 33 : 17) : 0;
      return { m: m, hgt: rowH + extra };
    });
    var bodyH = rows.reduce(function (s, r) { return s + r.hgt; }, 0);
    var hgt = padT + bodyH + axisH;

    var parts = MO.map(function (m) {
      if (m.status === 'upcoming') return ymJa(m.month) + 'は' + A.stateLabels.upcoming.note;
      if (m.status !== 'held') return ymJa(m.month) + 'は管理画面が ∅ で' + A.stateLabels.noData.table + '（0件ではありません）';
      var s = ymJa(m.month) + ' 申込' + m.registrations + '件・チェックイン記録' + m.checkIns + '件';
      if (m.organiserEstimate) s += '（' + m.organiserEstimate.reason + m.organiserEstimate.label + '）';
      return s;
    }).join('、');
    var desc = '横向きの棒グラフ。開催月別に、延べ申込と延べ参加（チェックイン記録）を並べて比べています。' +
      parts + '。集計のある10か月の合計は 延べ申込' + nf(A.totals.registrations) + '件・延べ参加（チェックイン記録）' +
      nf(A.totals.checkIns) + '件で、チェックイン率は管理画面の丸め値で' + A.totals.checkInRatePct + '%です。' +
      'チェックイン率の定義上、チェックインされなかった現地参加者は含まれないため、実際の参加者はこれより多かったと考えられます。' +
      '同じ数値は下の表にもあります。';

    var svg = el('svg', {
      viewBox: '0 0 ' + w + ' ' + hgt,
      width: w, height: hgt,
      role: 'img',
      'aria-label': desc
    });
    svg.appendChild(stxt('title', '開催月別の 延べ申込 と 延べ参加（チェックイン記録）'));
    svg.appendChild(stxt('desc', desc));

    /* --- 縦グリッド --- */
    for (var v = 0; v <= xMax; v += 20) {
      var gx = XV(v);
      svg.appendChild(el('line', { x1: gx, y1: padT, x2: gx, y2: padT + bodyH },
        v === 0 ? 'viz-axis-line' : 'viz-grid-line'));
      svg.appendChild(stxt('text', String(v), { x: gx, y: padT + bodyH + 18, 'text-anchor': 'middle' }, 'viz-tick'));
    }
    svg.appendChild(stxt('text', '件', { x: XV(xMax) + 10, y: padT + bodyH + 18 }, 'viz-tick'));

    /* --- 行 --- */
    var cy = padT;
    rows.forEach(function (r) {
      var m = r.m, top = cy;
      cy += r.hgt;
      var groupH = barH * 2 + gap;
      var y0 = top + 8;

      svg.appendChild(stxt('text', narrow ? ymShort(m.month) : ym(m.month),
        { x: labelW - 8, y: y0 + groupH / 2 + 4, 'text-anchor': 'end' }, 'viz-rowlabel'));

      if (m.status === 'held') {
        /* 延べ申込 */
        var g1 = el('g', { tabindex: '0', role: 'img',
          'aria-label': ymJa(m.month) + ' 延べ申込 ' + m.registrations + '件' }, 'viz-pt');
        g1.appendChild(stxt('title', ymJa(m.month) + ' 延べ申込 ' + m.registrations + '件'));
        g1.appendChild(el('path', { d: hbarPath(plotX, y0, XV(m.registrations) - plotX, barH, 4) }, 'viz-bar-s1'));
        svg.appendChild(g1);
        svg.appendChild(stxt('text', m.registrations,
          { x: XV(m.registrations) + 6, y: y0 + barH - 2 }, 'viz-value'));

        /* 延べ参加（チェックイン記録） */
        var y1 = y0 + barH + gap;
        var aria2 = ymJa(m.month) + ' 延べ参加（チェックイン記録）' + m.checkIns + '件' +
          (m.checkIns === 0 ? '。' + A.stateLabels.zero.note : '');
        var g2 = el('g', { tabindex: '0', role: 'img', 'aria-label': aria2 }, 'viz-pt');
        g2.appendChild(stxt('title', aria2));
        if (m.checkIns === 0) {
          /* 実数の0：0の目印（細い縦棒）を置き、∅（集計なし）と区別する */
          g2.appendChild(el('rect', { x: plotX, y: y1, width: 3, height: barH, rx: 1.5 }, 'viz-zero-stub'));
        } else {
          g2.appendChild(el('path', { d: hbarPath(plotX, y1, XV(m.checkIns) - plotX, barH, 4) }, 'viz-bar-s2'));
        }
        svg.appendChild(g2);
        svg.appendChild(stxt('text', m.checkIns === 0 ? '0' : String(m.checkIns),
          { x: (m.checkIns === 0 ? plotX + 9 : XV(m.checkIns) + 6), y: y1 + barH - 2 }, 'viz-value'));

        if (m.checkInsZero) {
          var oe0 = m.organiserEstimate;
          var lines = oe0
            ? (narrow
                ? ['※ チェックイン未計測（現地開催）',
                   '現地参加 約' + oe0.estimatedAttendance + '人＝主催者の記憶による概数']
                : ['※ チェックイン未計測。現地参加 約' + oe0.estimatedAttendance + '人（主催者の記憶による概数）'])
            : ['※ ' + A.stateLabels.zero.note];
          lines.forEach(function (ln, k) {
            svg.appendChild(stxt('text', ln,
              { x: plotX + 2, y: y0 + groupH + 15 + k * 15 }, 'viz-value-sm'));
          });
        }
      } else if (m.status === 'upcoming') {
        svg.appendChild(el('rect', { x: plotX, y: y0, width: 58, height: groupH, rx: 4 }, 'viz-upcoming-band'));
        svg.appendChild(stxt('text', A.stateLabels.upcoming.table + '（2026年9月28日）',
          { x: plotX + 66, y: y0 + groupH / 2 + 4 }, 'viz-value-sm'));
      } else {
        svg.appendChild(el('rect', { x: plotX, y: y0, width: 58, height: groupH, rx: 4,
          fill: 'none', style: 'stroke:var(--viz-axis);stroke-width:1;stroke-dasharray:3 3' }));
        svg.appendChild(stxt('text', A.stateLabels.noData.table + '（∅）',
          { x: plotX + 66, y: y0 + groupH / 2 + 4 }, 'viz-value-sm'));
      }
    });

    host.appendChild(svg);
  }

  /* =========================================================
     6. 参加実績のキャプション・表・注記
     ========================================================= */
  (function renderAttendRest() {
    var cap = document.getElementById('attend-caption');
    if (cap) {
      cap.innerHTML = '';
      cap.appendChild(h('b', null, '208件は「延べ参加（チェックイン記録）」です。'));
      cap.appendChild(document.createTextNode(
        'ユニーク参加者数でも、全実参加者数でもありません。' + A.notes.underCount +
        ' ' + A.notes.nullMonths + ' ' + A.notes.upcoming));
    }

    var dec = MO.filter(function (m) { return m.month === '2025-12'; })[0];

    var tbl = document.getElementById('table-attend');
    if (tbl) {
      tbl.appendChild(stxt('caption',
        '出典：' + M.source.name + '（' + M.source.views[1] + '）／取得日：' + M.source.retrievedAt +
        '／' + A.filter.field + ' ' + A.filter.from + '〜' + A.filter.to + '（' + A.filter.note + '）。' +
        '延べ申込＝' + A.definitions.registrations + ' 延べ参加＝' + A.definitions.checkIns));
      var thead = document.createElement('thead');
      var trh = document.createElement('tr');
      ['月', '延べ申込（件）', '延べ参加（チェックイン記録・件）', 'チェックイン率', '備考'].forEach(function (t) {
        var th = h('th', null, t); th.setAttribute('scope', 'col'); trh.appendChild(th);
      });
      thead.appendChild(trh); tbl.appendChild(thead);

      var tb = document.createElement('tbody');
      MO.forEach(function (m) {
        var tr = document.createElement('tr');
        if (m.status === 'upcoming') tr.className = 'row-upcoming';
        var th = h('th', null, ym(m.month)); th.setAttribute('scope', 'row');
        tr.appendChild(th);

        if (m.status === 'held') {
          tr.appendChild(h('td', null, nf(m.registrations)));

          var tdC = document.createElement('td');
          if (m.checkIns === 0) {
            tdC.className = 'is-zero';
            tdC.appendChild(h('span', 'zero-mark'));
            tdC.appendChild(document.createTextNode(A.stateLabels.zero.table));
            tdC.appendChild(h('span', 'cell-note', A.stateLabels.zero.note));
          } else {
            tdC.textContent = nf(m.checkIns);
          }
          tr.appendChild(tdC);

          tr.appendChild(h('td', null, Math.round(m.checkIns / m.registrations * 100) + '%'));

          var tdN = h('td', 'is-note');
          if (m.organiserEstimate) {
            var oe = m.organiserEstimate;
            tdN.appendChild(h('span', null, oe.reason));
            var e1 = h('span', 'cell-note', oe.label + ' ／ ' + oe.relation);
            tdN.appendChild(e1);
          } else {
            tdN.textContent = '—';
          }
          tr.appendChild(tdN);

        } else if (m.status === 'upcoming') {
          for (var k = 0; k < 3; k++) tr.appendChild(h('td', 'is-upcoming', A.stateLabels.upcoming.table));
          tr.appendChild(h('td', 'is-note', A.stateLabels.upcoming.note));
        } else {
          for (var j = 0; j < 3; j++) {
            var td = h('td', 'is-nodata', A.stateLabels.noData.table);
            td.setAttribute('title', '∅');
            tr.appendChild(td);
          }
          tr.appendChild(h('td', 'is-note', A.stateLabels.noData.note));
        }
        tb.appendChild(tr);
      });
      tbl.appendChild(tb);

      var tf = document.createElement('tfoot');
      var trf = document.createElement('tr');
      var thf = h('th', null, '合計（集計のある10か月）'); thf.setAttribute('scope', 'row');
      trf.appendChild(thf);
      trf.appendChild(h('td', null, nf(A.totals.registrations)));
      trf.appendChild(h('td', null, nf(A.totals.checkIns)));
      trf.appendChild(h('td', null, A.totals.checkInRatePct + '%'));
      trf.appendChild(h('td', 'is-note', A.totals.ratePctNote + ' ' + A.stateLabels.noData.note + '。'));
      tf.appendChild(trf); tbl.appendChild(tf);
    }

    var notes = document.getElementById('attend-notes');
    if (notes) {
      var list = [
        { cls: '', html: '<b>延べ参加（チェックイン記録）の読み方：</b>' + A.definitions.checkIns + ' ' + A.notes.underCount },
        { cls: 'is-warn', html: '<b>' + A.stateLabels.noData.table + '（∅）の月：</b>' + A.notes.nullMonths },
        { cls: 'is-warn', html: '<b>2025年12月の0件：</b>' + A.notes.zeroCheckIns +
            (dec && dec.organiserEstimate ? ' ' + dec.organiserEstimate.reason + dec.organiserEstimate.label + '。' + dec.organiserEstimate.relation : '') },
        { cls: 'is-warn', html: '<b>2026年9月：</b>' + A.notes.upcoming },
        { cls: '', html: '<b>イベント単位の数値について：</b>' + A.notes.eventLinkage },
        { cls: 'is-src', html: '出典：' + M.source.name + '（' + M.source.views.join(' / ') + '）／取得日 ' +
            M.source.retrievedAt + '／' + M.source.nature + '。個人名・メールアドレス等は掲載していません。' }
      ];
      list.forEach(function (n) {
        var p = h('p', 'viz-note-item' + (n.cls ? ' ' + n.cls : ''));
        p.innerHTML = n.html;
        notes.appendChild(p);
      });
    }
  })();

  /* =========================================================
     7. 開催履歴カードに月次集計からの参加実績を添える
        （各月の開催が1件だけであることを確認できた場合のみ）
     ========================================================= */
  (function decorateTimeline() {
    if (!linkageOK) {
      console.error('[SCT metrics] 月→イベントの紐付けが一意ではないため、イベント単位の参加実績は表示しません。');
      return;
    }
    var items = document.querySelectorAll('#timeline .tl-item');
    if (!items.length || items.length !== events.length) return;

    Array.prototype.forEach.call(items, function (li, i) {
      var ev = events[i];
      var key = String(ev.date).slice(0, 7);
      var m = MO.filter(function (x) { return x.month === key; })[0];
      if (!m) return;
      var card = li.querySelector('.tl-card');
      if (!card) return;

      var p = h('p', 'tl-attend');
      if (m.status === 'upcoming') {
        p.appendChild(h('span', 'tl-attend-fig', '参加実績：' + A.stateLabels.upcoming.table));
        p.appendChild(h('span', 'tl-attend-note', A.stateLabels.upcoming.note));
      } else if (m.status === 'held') {
        var fig = m.checkIns === 0
          ? '延べ申込 ' + m.registrations + '件 / 延べ参加（チェックイン記録） ' + A.stateLabels.zero.table
          : '延べ申込 ' + m.registrations + '件 / 延べ参加（チェックイン記録） ' + m.checkIns + '件';
        p.appendChild(h('span', 'tl-attend-fig', fig));
        p.appendChild(h('span', 'tl-attend-src', A.perEventLabel));
        if (m.organiserEstimate) {
          p.appendChild(h('span', 'tl-attend-note',
            m.organiserEstimate.reason + m.organiserEstimate.label + '。' + m.organiserEstimate.relation));
        } else if (m.checkInsZero) {
          p.appendChild(h('span', 'tl-attend-note', A.stateLabels.zero.note));
        }
      } else {
        return;
      }
      card.appendChild(p);
    });
  })();

  /* =========================================================
     8. 描画 + 再描画
     ========================================================= */
  function drawAll() { drawGrowth(); drawAttend(); }
  drawAll();

  var t = null, lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    if (t) clearTimeout(t);
    t = setTimeout(drawAll, 160);
  });

  if (CHECKS.failed.length) {
    console.error('[SCT metrics] 検証NG ' + CHECKS.failed.length + '件');
  } else {
    console.info('[SCT metrics] 検証OK ' + CHECKS.passed.length + '件');
  }
})();
