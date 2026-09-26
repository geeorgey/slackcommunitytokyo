(function () {
  "use strict";

  var data = window.SCT_DATA;
  if (!data) return;

  var WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function parseDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }

  // 表示用の日付。date があれば "2026年9月28日（月）"、無ければ dateLabel。
  function dateText(event) {
    var d = parseDate(event.date);
    if (!d) return event.dateLabel || "日程未定";
    return (
      d.getFullYear() +
      "年" +
      (d.getMonth() + 1) +
      "月" +
      d.getDate() +
      "日（" +
      WEEKDAYS[d.getDay()] +
      "）"
    );
  }

  function chips(event) {
    var frag = document.createDocumentFragment();
    if (event.format) frag.appendChild(el("span", "chip chip-format", event.format));
    if (event.unconfirmed) frag.appendChild(el("span", "chip chip-note", "日程確認中"));
    return frag;
  }

  /* ---- ヒーローのカウントアップ ---- */

  function countUp() {
    var node = document.getElementById("memberCount");
    if (!node) return;
    var target = data.members && data.members.count ? data.members.count : Number(node.dataset.target);
    node.setAttribute("aria-label", target + "人");
    if (reduceMotion) {
      node.textContent = target.toLocaleString("ja-JP");
      return;
    }
    var start = null;
    var duration = 1400;
    function step(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(target * eased).toLocaleString("ja-JP");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- 紙吹雪 ---- */

  function confetti() {
    var host = document.querySelector(".confetti");
    if (!host || reduceMotion) return;
    var colors = ["#36c5f0", "#2eb67d", "#ecb22e", "#e01e5a", "#ffffff"];
    for (var i = 0; i < 36; i++) {
      var piece = el("i");
      piece.style.left = (i / 36) * 100 + Math.random() * 2 + "%";
      piece.style.background = colors[i % colors.length];
      piece.style.animationDuration = 5 + Math.random() * 5 + "s";
      piece.style.animationDelay = -Math.random() * 10 + "s";
      piece.style.opacity = 0.35 + Math.random() * 0.45;
      host.appendChild(piece);
    }
  }

  /* ---- 次回イベント ---- */

  function renderNext() {
    var slot = document.getElementById("nextEvent");
    if (!slot) return;
    var next = data.events.filter(function (e) { return e.upcoming; })[0];
    if (!next) {
      slot.appendChild(el("p", "section-lead", "次回イベントは準備中です。決まり次第ここでお知らせします。"));
      return;
    }

    var card = el(next.url ? "a" : "div", "next-card");
    if (next.url) {
      card.href = next.url;
      card.target = "_blank";
      card.rel = "noopener";
    }

    var head = el("div", "next-date");
    head.appendChild(el("span", null, dateText(next)));
    head.appendChild(el("span", "chip", "次回"));
    head.appendChild(chips(next));
    card.appendChild(head);

    card.appendChild(el("h3", null, next.title));
    if (next.summary) card.appendChild(el("p", null, next.summary));
    if (next.venue) card.appendChild(el("p", "event-venue", "会場: " + next.venue));
    if (next.url) card.appendChild(el("span", "go", "イベントページで詳細を見る →"));

    slot.appendChild(card);
  }

  /* ---- 開催履歴 ---- */

  function renderTimeline() {
    var list = document.getElementById("timeline");
    if (!list) return;

    data.events.forEach(function (event) {
      var li = el("li", event.upcoming ? "is-upcoming" : null);
      var box = el("div", "event");

      var head = el("div", "event-head");
      head.appendChild(el("span", "event-date", dateText(event)));
      if (event.upcoming) head.appendChild(el("span", "chip", "次回"));
      head.appendChild(chips(event));
      box.appendChild(head);

      var title = el("h3");
      if (event.url) {
        var link = el("a", null, event.title);
        link.href = event.url;
        link.target = "_blank";
        link.rel = "noopener";
        title.appendChild(link);
      } else {
        title.textContent = event.title;
      }
      box.appendChild(title);

      if (event.summary) box.appendChild(el("p", null, event.summary));
      if (event.venue) box.appendChild(el("p", "event-venue", "会場: " + event.venue));

      li.appendChild(box);
      list.appendChild(li);
    });

    if (data.reboot) {
      var li2 = el("li", "milestone");
      var box2 = el("div", "event");
      var head2 = el("div", "event-head");
      head2.appendChild(el("span", "event-date", data.reboot.label));
      head2.appendChild(el("span", "chip chip-note", "はじまり"));
      box2.appendChild(head2);
      box2.appendChild(el("h3", null, data.reboot.title));
      if (data.reboot.summary) box2.appendChild(el("p", null, data.reboot.summary));
      li2.appendChild(box2);
      list.appendChild(li2);
    }
  }

  /* ---- 数字とリンク ---- */

  function renderStats() {
    var members = (data.members && data.members.count) || 0;
    var set = function (id, value) {
      var node = document.getElementById(id);
      if (node) node.textContent = value;
    };
    set("statMembers", members.toLocaleString("ja-JP") + "人");
    set("statEvents", data.events.length + "回");
    set("statReboot", (data.reboot && data.reboot.label) || "—");
    if (data.historyNote) set("historyNote", data.historyNote);

    var links = data.links || {};
    [["joinLink", links.chapter], ["footerChapter", links.chapter], ["footerRepo", links.repo]].forEach(
      function (pair) {
        var node = document.getElementById(pair[0]);
        if (node && pair[1]) node.href = pair[1];
      }
    );
  }

  countUp();
  confetti();
  renderNext();
  renderTimeline();
  renderStats();
})();
