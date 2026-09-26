/*
 * Slack Community: Tokyo — サイト掲載データ
 * ここだけ書き換えればサイトの内容が更新されます（ビルド不要）。
 *
 * event の書き方:
 *   date        "2026-09-28" 形式。確定日が分かっているとき。
 *   dateLabel   日付が未確定のときの表示（例 "2026年4月"）。date より優先されます。
 *   unconfirmed true にすると「日程確認中」のチップが付きます。
 *   upcoming    true にすると「次回」として上部にも大きく表示されます。
 */
window.SCT_DATA = {
  // Slack Community: Tokyo のメンバー数
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
  events: [
    {
      date: "2026-09-28",
      title: "Dreamforce 2026 で見てきたSlack情報共有会",
      format: "ハイブリッド",
      upcoming: true,
      summary:
        "Dreamforce 2026（9/15〜17・サンフランシスコ）に現地参加したチャプターリーダー2名が、見てきたSlackの最新情報と会場の空気をそのまま持ち帰って共有します。",
      url:
        "https://slackcommunity.com/events/details/slack-tokyo-presents-dreamforce-2026-dejian-tekitaslackqing-bao-gong-you-hui/"
    },
    {
      dateLabel: "2026年4月",
      unconfirmed: true,
      title: "TDX 2026 で発表された最新のSlack情報を共有します",
      format: "ハイブリッド",
      summary:
        "TDX 2026（4/15〜16・サンフランシスコ）で発表されたSlack関連アップデートを、日本語でまとめて共有した回。",
      url:
        "https://slackcommunity.com/events/details/slack-tokyo-presents-tdx-2026-defa-biao-saretazui-xin-noslackqing-bao-wogong-you-shimasu/"
    },
    {
      date: "2026-02-19",
      title: "開発者向けDeep Dive #1",
      format: "ハイブリッド",
      summary:
        "RTS API や MCP サーバーなど、開発者向けのテーマを深掘りする Deep Dive シリーズ第1回。",
      url:
        "https://slackcommunity.com/events/details/slack-tokyo-presents-kai-fa-zhe-xiang-kedeep-dive-1/"
    },
    {
      dateLabel: "2025年12月",
      unconfirmed: true,
      title: "Slack Community: Tokyo 2025最終回",
      format: "オフライン",
      venue: "Salesforce Tower 東京",
      summary:
        "2025年の締めくくりは、東京のSalesforceタワーに集まってオープンに共有し合う回として開催しました。",
      url:
        "https://slackcommunity.com/events/details/slack-tokyo-presents-slack-community-tokyo-2025zui-zhong-hui-hadong-jing-nosalesforcetawadeshi-shi-shimasu/"
    },
    {
      date: "2025-09-25",
      title: "Slack Community Tokyo Chapter Kick-Off",
      format: "オンライン",
      summary:
        "リブート後の第1回。エンジニアも管理者も一緒に、Slackの使いこなし・AIエージェント・ワークフロー自動化について話しました。",
      url:
        "https://slackcommunity.com/events/details/slack-tokyo-presents-slack-community-tokyo-chapter-kick-off/"
    }
  ],
  links: {
    chapter: "https://slackcommunity.com/tokyo/",
    community: "https://slackcommunity.com/",
    repo: "https://github.com/geeorgey/slackcommunitytokyo"
  }
};
