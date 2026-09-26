# Slack Community: Tokyo — チャプターサイト（実験版）

Slack Community: Tokyo チャプターの実験的な Web サイトです。
メンバー1,000人突破のお祝いと、2025年8月のリブート以降の開催履歴を掲載しています。

- 公開先（GitHub Pages）: `https://geeorgey.github.io/slackcommunitytokyo/`
- チャプターページ: https://slackcommunity.com/tokyo/

## 構成

```
index.html        ページ本体（構造だけ。中身は data/events.js から生成）
assets/style.css  スタイル（ライト/ダークモード対応）
assets/app.js     データの描画、カウントアップ、紙吹雪
data/events.js    掲載データ（メンバー数・イベント一覧）← ここだけ直せば更新できます
.nojekyll         GitHub Pages の Jekyll 処理を無効化
```

ビルドは不要です。`index.html` をブラウザで開けばそのまま確認できます。

## 内容の更新

`data/events.js` を編集します。

- メンバー数: `members.count`
- イベント追加: `events` 配列の先頭に追記（新しい順に並べています）
  - `date`: `"2026-09-28"` 形式。曜日は自動で付きます
  - `dateLabel`: 日付が未確定のときの表示（例 `"2026年4月"`）。`date` より優先されます
  - `unconfirmed: true`: 「日程確認中」のチップを表示します
  - `upcoming: true`: 「次回イベント」として上部に大きく表示します（1件だけ付けてください）

## GitHub Pages の公開設定

リポジトリの Settings → Pages で、Source を **Deploy from a branch**、
Branch を **main / (root)** にすると公開されます。

## 掲載データについて

イベント情報は公開情報をもとに作成しています。
`data/events.js` 内で `unconfirmed: true` が付いている項目は日付が未確認のため、
正確な日付が分かり次第、置き換えてください。
