/*
 * Slack Community: Tokyo — サイト掲載データ
 * ここだけ書き換えればサイトの内容が更新されます（ビルド不要）。
 *
 * event の書き方:
 *   date        "2026-09-28" 形式。曜日は自動で付きます
 *   dateLabel   日付が未確定のときの表示（例 "2026年4月"）。date より優先されます
 *   unconfirmed true にすると「日程確認中」のチップが付きます
 *   upcoming    true にすると「次回イベント」として上部にも大きく表示されます（1件だけ）
 */
var BASE = "https://slackcommunity.com/events/details/";

window.SCT_DATA = {
  // Slack Community: Tokyo のメンバー数（2026年9月26日時点）
  members: {
    count: 1002,
    milestone: 1000,
    milestoneDate: "2026-09-26"
  },
  reboot: {
    label: "2025年8月",
    title: "Slack Community: Tokyo リブート",
    summary:
      "新しいチャプターリーダーが就任。エンジニア中心だったコミュニティを、管理者や日々Slackを使うすべての人に開いていく方針で再スタートしました。"
  },
  historyNote:
    "日付はイベントページなどの公開情報をもとにした暫定値です。「日程確認中」のものと、まだ掲載できていない回（LT大会、「Slack検索を極めよう」など）は、確認しだい更新します。",
  events: [
    {
      date: "2026-09-28",
      title: "Dreamforce 2026 で見てきたSlack情報共有会",
      format: "ハイブリッド",
      upcoming: true,
      summary:
        "Dreamforce 2026（9/15〜17・サンフランシスコ）に現地参加したチャプターリーダー2名が、見てきたSlackの最新情報と会場の空気をそのまま持ち帰って共有します。",
      url: BASE + "slack-tokyo-presents-dreamforce-2026-dejian-tekitaslackqing-bao-gong-you-hui/"
    },
    {
      date: "2026-08-20",
      title: "Slackbot の可能性を拡張するMCPとは？",
      format: "ハイブリッド",
      summary: "MCP（Model Context Protocol）で Slackbot をどこまで広げられるのかを扱った回。",
      url: BASE + "slack-tokyo-presents-slackbot-noke-neng-xing-wokuo-zhang-surumcptoha/"
    },
    {
      date: "2026-07-09",
      title: "Slackbot Skills を作ってみよう！ハンズオン＆ Skills 選手権！",
      format: "ハイブリッド",
      summary:
        "コードを書かずに自然言語で Slackbot の「得意分野」を決められる Skills を、その場で作って持ち寄り、投票で競う選手権つきハンズオン。",
      url: BASE + "slack-tokyo-presents-slackbot-skills-wozuo-tsutemiyouhanzuon-skills-xuan-shou-quan/"
    },
    {
      date: "2026-06-25",
      title: "AWTT 2026 振り返り：Slackbot の使い方 / Vibe CodingでSlackアプリを作ろう",
      format: "ハイブリッド",
      summary:
        "Agentforce World Tour Tokyo 2026 の内容を振り返りつつ、Slackbot の使い方と Vibe Coding でのアプリ作りを共有した回。",
      url:
        BASE +
        "slack-tokyo-presents-awtt-2026-zhen-rifan-rislackbot-noshi-ifang-vibe-codingdeslackapuriwozuo-rou/"
    },
    {
      date: "2026-05-19",
      title: "Vibe CodingでSlackアプリを作ってみよう",
      format: "ハイブリッド",
      summary: "AIと一緒に手を動かして、Slackアプリを実際に作ってみる回。",
      url: BASE + "slack-tokyo-presents-vibe-codingdeslackapuriwozuo-tsutemiyou/"
    },
    {
      date: "2026-04-24",
      unconfirmed: true,
      title: "TDX 2026 で発表された最新のSlack情報を共有します",
      format: "ハイブリッド",
      summary:
        "TDX 2026（4/15〜16・サンフランシスコ）で発表されたSlack関連のアップデートを、日本語でまとめて共有した回。",
      url:
        BASE +
        "slack-tokyo-presents-tdx-2026-defa-biao-saretazui-xin-noslackqing-bao-wogong-you-shimasu/"
    },
    {
      date: "2026-02-19",
      title: "開発者向けDeep Dive #1",
      format: "ハイブリッド",
      summary:
        "RTS API や MCP サーバーなど、開発者向けのテーマを深掘りする Deep Dive シリーズ第1回。",
      url: BASE + "slack-tokyo-presents-kai-fa-zhe-xiang-kedeep-dive-1/"
    },
    {
      date: "2025-12-17",
      unconfirmed: true,
      title: "Slack Community: Tokyo 2025最終回",
      format: "オフライン",
      venue: "Salesforce Tower 東京",
      summary:
        "2025年の締めくくりは、東京のSalesforceタワーに集まって、一年をオープンに共有し合う回として開催しました。",
      url:
        BASE +
        "slack-tokyo-presents-slack-community-tokyo-2025zui-zhong-hui-hadong-jing-nosalesforcetawadeshi-shi-shimasu/"
    },
    {
      date: "2025-09-25",
      title: "Slack Community Tokyo Chapter Kick-Off",
      format: "オンライン",
      summary:
        "リブート後の第1回。エンジニアも管理者も一緒に、Slackの使いこなし・AIエージェント・ワークフロー自動化について話しました。",
      url: BASE + "slack-tokyo-presents-slack-community-tokyo-chapter-kick-off/"
    }
  ],
  links: {
    chapter: "https://slackcommunity.com/tokyo/",
    community: "https://slackcommunity.com/",
    repo: "https://github.com/geeorgey/slackcommunitytokyo"
  }
};
