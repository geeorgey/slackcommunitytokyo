/*
 * Slack Community :Tokyo — サイト掲載データ
 * ビルド不要。このファイルだけ書き換えればサイトの内容が更新されます。
 *
 * members.count  ヒーローのカウントアップと統計に使う現在のメンバー数
 *
 * events[] の書き方（新しい順に並べてください）:
 *   date      "2026-09-28" 形式。月までしか分からないときは "2026-08" でも可
 *   category  公式イベントページのカテゴリ（Talks / Workshop など）。省略可
 *   time      "16:30–18:00" など。省略可
 *   title     イベントタイトル
 *   format    "ハイブリッド" など。タグとして表示されます。省略可
 *   venue     会場。省略可
 *   summary   一言説明。省略可
 *   url       イベントページのURL。省略可
 *   upcoming  true にすると「次回」として強調表示されます（1件だけ）
 *   milestone 特別なタグ（例 "リブート後 第1回"）。省略可
 *
 * 掲載範囲は 2025年8月のリブート以降（2025-09-25 のキックオフ以降）の全11件です。
 * 日付・カテゴリ・タイトル・URL は公式の
 * https://slackcommunity.com/api/event_slim/for_chapter/22/ にもとづいています（2026-09-26 時点）。
 */
window.SCT_DATA = {
  members: {
    count: 1002,
    milestone: 1000,
    asOf: "2026-09-26"
  },
  events: [
    {
      "date": "2026-09-28",
      "category": "Talks",
      "time": "16:30–18:00",
      "title": "Dreamforce 2026 で見てきたSlack情報共有会",
      "format": "ハイブリッド",
      "venue": "株式会社リバネスナレッジ セミナールーム（東京都新宿区下宮比町1-4 飯田橋御幸ビル4階）＋ オンライン（Google Meet）",
      "summary": "9/15–17に開催された Dreamforce 2026 の Slack 関連トピックを、現地で見てきたチャプターリーダーの二人が共有します。開場は16:00です。",
      "url": "https://slackcommunity.com/events/details/slack-tokyo-presents-dreamforce-2026-dejian-tekitaslackqing-bao-gong-you-hui/",
      "upcoming": true
    },
    {
      "date": "2026-08-20",
      "category": "Talks",
      "time": "16:30–18:00",
      "title": "Slackbot の可能性を拡張するMCPとは？",
      "format": "ハイブリッド",
      "venue": "東京・飯田橋 ＋ オンライン",
      "summary": "2026年1月にリリースされた Slackbot の進化は止まらず。7月の Skills に続いて、Slackbot × MCP という組み合わせを掘り下げました。",
      "url": "https://slackcommunity.com/events/details/slack-tokyo-presents-slackbot-noke-neng-xing-wokuo-zhang-surumcptoha/"
    },
    {
      "date": "2026-07-09",
      "category": "Workshop",
      "time": "16:30–18:00",
      "title": "Slackbot Skills を作ってみよう！ハンズオン＆ Skills 選手権！",
      "format": "ハイブリッド / ハンズオン",
      "venue": "東京・飯田橋 ＋ オンライン",
      "summary": "コードを書かずに自然言語で AI アシスタントの「得意技」を定義できる Slackbot Skills を、その場で作って見せ合う選手権つきの回。",
      "url": "https://slackcommunity.com/events/details/slack-tokyo-presents-slackbot-skills-wozuo-tsutemiyouhanzuon-skills-xuan-shou-quan/"
    },
    {
      "date": "2026-06-25",
      "category": "Workshop",
      "time": "16:00–18:00",
      "title": "AWTT 2026 振り返り：Slackbot の使い方 / Vibe CodingでSlackアプリを作ろう",
      "format": "ハイブリッド",
      "venue": "東京・飯田橋 ＋ オンライン",
      "summary": "Agentforce World Tour Tokyo 2026 で参加者多数となり見られなかった2つのセッションを、コミュニティであらためてお届け。",
      "url": "https://slackcommunity.com/events/details/slack-tokyo-presents-awtt-2026-zhen-rifan-rislackbot-noshi-ifang-vibe-codingdeslackapuriwozuo-rou/"
    },
    {
      "date": "2026-05-19",
      "category": "Workshop",
      "time": "15:30–18:00",
      "title": "Vibe CodingでSlackアプリを作ってみよう",
      "format": "ハイブリッド",
      "venue": "東京都内 ＋ オンライン",
      "summary": "2月の開発者向け Deep Dive を踏まえて、参加者の皆さんと一緒に実際に Vibe Coding で Slack アプリを作ってみる回。",
      "url": "https://slackcommunity.com/events/details/slack-tokyo-presents-vibe-codingdeslackapuriwozuo-tsutemiyou/"
    },
    {
      "date": "2026-04-24",
      "category": "Talks",
      "time": "15:30–18:00",
      "title": "TDX 2026 で発表された最新のSlack情報を共有します",
      "format": "ハイブリッド",
      "venue": "東京・新宿区 ＋ オンライン",
      "summary": "4月15-16日にサンフランシスコで開催された TDX 2026 で発表された Slack 関連ニュースを、Salesforce のメンバーも交えてお届け。",
      "url": "https://slackcommunity.com/events/details/slack-tokyo-presents-tdx-2026-defa-biao-saretazui-xin-noslackqing-bao-wogong-you-shimasu/"
    },
    {
      "date": "2026-03-17",
      "category": "Networking social",
      "time": "16:00–18:00",
      "title": "Slack検索を極めよう：探したいものが見つからない時どうしてますか？",
      "format": "ハイブリッド",
      "venue": "東京都内 ＋ オンライン",
      "summary": "テーマは「Slack検索 Deep Dive」。運用が長くなるほど増えていく情報の中から、目的の一件にたどり着く方法を持ち寄りました。",
      "url": "https://slackcommunity.com/events/details/slack-tokyo-presents-slackjian-suo-woji-meyoutan-shitaimonogajian-tsukaranaishi-doushitemasuka/"
    },
    {
      "date": "2026-02-19",
      "category": "Talks",
      "time": "16:00–18:00",
      "title": "開発者向けDeep Dive #1",
      "format": "ハイブリッド / 開発者向け",
      "venue": "東京・飯田橋（リバネス 4階セミナールーム）＋ オンライン",
      "summary": "RTS API や MCP サーバーなど、2025年12月のイベントで Jason Wong さんが言及した機能を開発者目線で深掘り。",
      "url": "https://slackcommunity.com/events/details/slack-tokyo-presents-kai-fa-zhe-xiang-kedeep-dive-1/"
    },
    {
      "date": "2026-01-21",
      "category": "Planning workshop",
      "time": "16:00–18:00",
      "title": "Slackbot Community Tour Tokyo ：新しいSlackbotを体験しよう",
      "format": "ハイブリッド",
      "venue": "東京・飯田橋（リバネスナレッジ）＋ オンライン",
      "summary": "世界中で開催された SLACKBOT COMMUNITY TOUR の東京開催。新しくなる Slackbot を、パイロットユーザーとして体験する回。",
      "url": "https://slackcommunity.com/events/details/slack-tokyo-presents-slackbot-community-tour-tokyo-xin-shiislackbotwoti-yan-shiyou/"
    },
    {
      "date": "2025-12-17",
      "category": "Talks",
      "time": "15:45–18:00",
      "title": "Slack Community: Tokyo 2025最終回は東京のSalesforceタワーで実施します",
      "format": "オフライン",
      "venue": "Salesforce Tower Tokyo（千代田区丸の内）",
      "summary": "2025年の締めくくりは Salesforce Tower Tokyo。年末らしく「何でも共有大会」として、アドミンにも開発者にも開かれた回。",
      "url": "https://slackcommunity.com/events/details/slack-tokyo-presents-slack-community-tokyo-2025zui-zhong-hui-hadong-jing-nosalesforcetawadeshi-shi-shimasu/"
    },
    {
      "date": "2025-09-25",
      "category": "Talks",
      "time": "18:00–19:00",
      "title": "Slack Community Tokyo Chapter Kick-Off",
      "format": "オンライン",
      "venue": "オンライン開催",
      "summary": "「2年の時を経て、新たなステージへ」。2025年8月に新チャプターリーダー体制となり、エンジニアもアドミンも、すべての Slack ユーザーのための場所として再スタート。",
      "url": "https://slackcommunity.com/events/details/slack-tokyo-presents-slack-community-tokyo-chapter-kick-off/",
      "milestone": "リブート後 第1回"
    }
  ]
};
