# Slack Community :Tokyo — 1,000 members 🎉

Slack Community :Tokyo チャプターが **メンバー1,000人を突破** したことをお祝いする、
実験的な静的サイトです。2025年8月のリブート以降の開催履歴と、次回イベントの案内を掲載しています。

> このリポジトリは Slack Community :Tokyo チャプターの有志による **非公式** のページです。
> 最新・正式な情報は [公式チャプターページ](https://slackcommunity.com/tokyo/) をご確認ください。

## 公開URL

GitHub Pages で公開されます。

```
https://geeorgey.github.io/slackcommunitytokyo/
```

### GitHub Pages を有効にする（初回のみ）

1. リポジトリの **Settings → Pages** を開く
2. **Build and deployment → Source** を `Deploy from a branch` にする
3. **Branch** を `main` / `/ (root)` にして **Save**
4. 1〜2分で上記URLが有効になります

ビルド不要の素の HTML / CSS / JS なので、Actions の設定は不要です。

## 構成

```
.
├── index.html              # ページ本体（構造のみ）
├── data/events.js          # 掲載データ（メンバー数・イベント一覧）← ここだけ直せば更新できます
├── assets/
│   ├── css/style.css       # スタイル（ライト/ダークモード対応）
│   └── js/main.js          # カウントアップ、紙吹雪、タイムライン描画
├── .nojekyll               # Jekyll 処理をスキップ
└── README.md
```

## イベントを追加・修正する

イベント一覧は **`data/events.js`** が唯一の情報源です。ここを編集すれば、
タイムラインと「開催回数」の数字に自動で反映されます。ビルドは不要です。

```js
{
  "date": "2026-10-21",          // "YYYY-MM-DD"、または月だけなら "YYYY-MM"
  "time": "16:30–18:00",         // 任意
  "title": "イベントタイトル",
  "format": "ハイブリッド",       // 任意。タグとして表示されます
  "venue": "東京・飯田橋 ＋ オンライン",  // 任意
  "summary": "一言説明。",        // 任意
  "url": "https://slackcommunity.com/events/details/.../",
  "upcoming": true,              // 任意。次回イベントに付けると強調表示されます
  "milestone": "リブート後 第1回" // 任意。特別なタグ
}
```

新しいイベントは **配列の先頭**（日付の新しい順）に追加してください。

次回イベントを差し替えるときは、`index.html` の `<!-- ============ NEXT EVENT ============ -->`
セクション（日付・タイトル・説明・会場）もあわせて更新します。

## メンバー数を更新する

`data/events.js` の `members.count` を書き換えるだけです。
ヒーローのカウントアップと統計ブロックの両方に反映されます。

```js
members: {
  count: 1002,
  milestone: 1000,
  asOf: "2026-09-26"
}
```

## ローカルで確認する

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## 実装メモ

- 依存ライブラリなし。フォントのみ Google Fonts（Noto Sans JP / Outfit）を読み込みます
- ダークモードは `prefers-color-scheme` に追従します
- `prefers-reduced-motion: reduce` の環境ではカウントアップ・紙吹雪・スクロール演出を停止します
- 紙吹雪は Canvas 2D の自前実装（約80行）です

---

Slack は Salesforce, Inc. の商標です。
