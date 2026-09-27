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
├── data/metrics.js         # 管理ダッシュボードの集計スナップショット（登録メンバー累計・参加実績）
├── assets/
│   ├── css/style.css       # スタイル（ライト/ダークモード対応）
│   ├── js/main.js          # カウントアップ、お祝い演出（クラッカー・花火・キラキラ）、タイムライン描画
│   └── js/metrics.js       # 登録メンバー累計・参加実績のグラフ（インラインSVGを自前生成）
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

## 管理ダッシュボードの数値を更新する

「メンバーの伸び」と「参加実績」の数値は **`data/metrics.js`** が唯一の情報源です。
ファイル先頭のコメントに、管理ダッシュボードのどこを見てどう写すかが書いてあります。
要点だけ:

- `memberGrowth.series` は Analytics > Members の
  **「Chapter member growth over time / Running total of chapter memberships」**
  の月別表示値。**登録メンバーの累計**であって、「新規登録者数」でも「イベント参加者数」でもありません。
  この言い換えをしないでください。
- 月末が未確定の最新月は `provisionalMonth` に指定します（グラフが中抜きの点＋破線になります）。
- 公開チャプターページの表示値（1,002人）は `memberGrowth.publicPage` に**別枠**で持っています。
  出典が違うので `series` に混ぜないでください。
- `attendance.months` は Analytics > Registrations の Attendance の開催月別値。
  **`337` は延べ申込、`208` は延べ参加（チェックイン記録）** です。
  ユニーク参加者数・全実参加者数と呼んではいけません
  （管理画面の定義：`Check-ins / Attendees. This does not include in-person attendees who were not checked-in.`）。
- 3つの状態を必ず区別します。**実数の 0 は `0`**、**画面が ∅ の月は `null`**（0 にしない／合計・平均に含めない）、
  **未開催の月は `status: "upcoming"`**。
- 管理ダッシュボード由来ではない数値（例: 2025-12 の `organiserEstimate.estimatedAttendance`）は
  構造を分けて持ち、合計には加算しません。
- `assets/js/metrics.js` が読み込み時に合計・比率・月→イベントの一意性を検証します。
  ずれるとブラウザのコンソールに `[SCT metrics] 検証NG` が出ます（`window.SCT_CHECKS` で確認できます）。
- **個人名・メールアドレス・認証情報、および埋込トークン付きの管理画面URLは絶対に入れないでください。**

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
- グラフは外部チャートライブラリ・CDNを使わず、インラインSVGを自前で組み立てています
  （色は CSS 変数 `--viz-*` 参照なので、ライト/ダークの切り替えに再描画なしで追従します）
- グラフの色はコントラスト・色覚多様性（protan/deutan）の分離を検証したうえで選んでいます。
  ライト `#7B2A7D` / `#2196C4`、ダーク `#A34EA5` / `#26A0CE`。値を手で触らないでください
- 数値は表でも読めるようにしてあり、表はスクリーンリーダーからも隠していません

---

Slack は Salesforce, Inc. の商標です。
