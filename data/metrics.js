/*
 * Slack Community :Tokyo — 管理ダッシュボードの集計スナップショット
 * ============================================================================
 * 出典: Slack Community Tokyo 管理ダッシュボード
 *        - Analytics > Members    （memberGrowth）
 *        - Analytics > Registrations（attendance）
 * 取得日: 2026-09-26
 * 性質  : 認証付き管理画面の「集計スナップショット」です。自動更新されません。
 *
 * 更新のしかた（次回の更新担当者向け）
 * ---------------------------------------------------------------------------
 * 1. 管理ダッシュボード > Analytics > Members を開き、
 *    「Chapter member growth over time / Running total of chapter memberships」
 *    の月別表示値を読み取って memberGrowth.series に追記する。
 *    - これは「登録メンバーの累計（running total）」です。
 *      「新規登録者数」「イベント参加者数」と読み替えないこと。
 *    - 月末が確定していない最新月は provisionalMonth にその月を指定し、
 *      asOf に読み取り日を入れる（グラフが中抜きの点＋破線で表示します）。
 * 2. Analytics > Registrations を開き、Event start date を
 *    filter.from〜filter.to に設定して Update。会場・タイトルの絞込はしない。
 *    Attendance の開催月別（申込 / チェックイン）を attendance.months に写す。
 *    - 画面が ∅ の月は必ず null を入れる。0 を入れてはいけない（意味が変わる）。
 *    - 実数の 0 は 0 のまま入れる（2025-12 が実例）。
 * 3. totals は管理画面の合計表示値をそのまま入れる。
 *    checkInRatePct は管理画面の丸め値（%）。
 *    assets/js/main.js が月別の合計と totals の一致を検証し、
 *    ずれていたらコンソールにエラーを出します。
 * 4. 個人名・メールアドレス・認証情報は絶対に入れないこと。
 *    管理画面の埋込トークン付きURLもこのリポジトリに入れないこと。
 *
 * 用語（このファイル内で統一）
 * ---------------------------------------------------------------------------
 *   登録メンバー累計 … memberGrowth.series[].total（running total）
 *   延べ申込        … attendance.months[].registrations（人数ではなく申込件数）
 *   延べ参加（チェックイン記録）… attendance.months[].checkIns
 *                     ユニーク参加者数でも、全実参加者数でもない。
 */
window.SCT_METRICS = {

  source: {
    name: "Slack Community Tokyo 管理ダッシュボード",
    views: ["Analytics > Members", "Analytics > Registrations"],
    retrievedAt: "2026-09-26",
    nature: "認証付き管理画面の集計スナップショット（自動更新ではありません）"
  },

  /* ------------------------------------------------------------------
     A. 登録メンバー累計
        管理画面の系列名:
        "Chapter member growth over time / Running total of chapter memberships"
     ------------------------------------------------------------------ */
  memberGrowth: {
    seriesName: "Chapter member growth over time / Running total of chapter memberships",
    seriesNameJa: "登録メンバー累計（チャプター登録の累計）",
    definition: "チャプターに登録しているメンバーの累計値（running total）。" +
                "その月に新しく登録した人数（新規登録者数）ではなく、" +
                "イベントに参加した人数（イベント参加者数）でもありません。",
    unit: "人",
    baselineMonth: "2025-08",
    latestMonth: "2026-09",
    provisionalMonth: "2026-09",
    provisionalNote: "最新月（2026-09）は月末確定値ではなく、2026年9月26日時点の表示値です。",
    asOf: "2026-09-26",
    series: [
      { month: "2025-08", total: 548 },
      { month: "2025-09", total: 599 },
      { month: "2025-10", total: 612 },
      { month: "2025-11", total: 630 },
      { month: "2025-12", total: 651 },
      { month: "2026-01", total: 678 },
      { month: "2026-02", total: 706 },
      { month: "2026-03", total: 734 },
      { month: "2026-04", total: 777 },
      { month: "2026-05", total: 800 },
      { month: "2026-06", total: 890 },
      { month: "2026-07", total: 925 },
      { month: "2026-08", total: 944 },
      { month: "2026-09", total: 1001 }
    ],
    annotations: [
      {
        month: "2025-08",
        label: "リーダー体制交代・再起動",
        note: "2025年8月に新しいチャプターリーダー体制へ。この時点の登録メンバー累計が548人です。"
      }
    ],
    /* 公開ページの表示値。別出典なので series には混ぜない。 */
    publicPage: {
      count: 1002,
      label: "公開チャプターページの表示値",
      asOf: "2026-09-26",
      note: "公開チャプターページは1,002人と表示しています。管理ダッシュボードのMembersは同日時点で1,001人。" +
            "集計元が異なるための1人差で、どちらかが誤りというわけではありません。" +
            "平均したり突き合わせたりせず、系列には管理ダッシュボードの値だけを使っています。"
    }
  },

  /* ------------------------------------------------------------------
     B. 参加実績（Registrations > Attendance）
     ------------------------------------------------------------------ */
  attendance: {
    filter: {
      field: "Event start date",
      from: "2025-08-01",
      to: "2026-09-26",
      venue: null,
      title: null,
      note: "会場・タイトルでの絞り込みはしていません。"
    },
    totals: {
      registrations: 337,
      checkIns: 208,
      checkInRatePct: 62,
      ratePctIsRounded: true,
      ratePctNote: "62% は管理画面の丸め表示値です。"
    },
    definitions: {
      registrations: "延べ申込（申込件数の合計）。ユニークな人数ではありません。",
      checkIns: "延べ参加（チェックイン記録の件数）。ユニーク参加者数でも、全実参加者数でもありません。",
      checkInRateVerbatim: "Check-ins / Attendees. This does not include in-person attendees who were not checked-in.",
      checkInRateJa: "管理画面の定義は「Check-ins / Attendees. This does not include in-person attendees who were not checked-in.」。" +
                     "チェックインされなかった現地参加者は含まれないため、実際の参加者は記録より多い可能性があります。"
    },
    /* 画面が ∅ の月は null。実数の 0 は 0。 */
    months: [
      { month: "2025-08", registrations: null, checkIns: null, status: "no-data" },
      { month: "2025-09", registrations: 56,   checkIns: 43,   status: "held" },
      { month: "2025-10", registrations: null, checkIns: null, status: "no-data" },
      { month: "2025-11", registrations: null, checkIns: null, status: "no-data" },
      {
        month: "2025-12", registrations: 24, checkIns: 0, status: "held", checkInsZero: true,
        /* ↓ 管理ダッシュボード由来の値ではありません。出典が違うので構造ごと分けています。
              合計（337 / 208 / 62%）には絶対に加算しないこと。 */
        organiserEstimate: {
          estimatedAttendance: 50,
          approximate: true,
          source: "organiser-recollection",
          sourceLabel: "主催者の記憶による概数",
          measured: false,
          excludedFromTotals: true,
          label: "現地参加 約50人（主催者の記憶による概数）",
          reason: "Salesforce Tower Tokyo での現地開催。チェックイン未計測。",
          relation: "「約50人」は当日会場にいた人数の概数で、管理画面の「延べ申込 24件」とは数え方が異なります。" +
                    "会場の人数には事前申込を経ていない参加者も含まれうるため、申込件数を上回ることがあります。" +
                    "管理ダッシュボードの集計値ではないので、337件・208件・62% には加算していません。"
        }
      },
      { month: "2026-01", registrations: 47,   checkIns: 27,   status: "held" },
      { month: "2026-02", registrations: 21,   checkIns: 12,   status: "held" },
      { month: "2026-03", registrations: 42,   checkIns: 25,   status: "held" },
      { month: "2026-04", registrations: 32,   checkIns: 19,   status: "held" },
      { month: "2026-05", registrations: 23,   checkIns: 18,   status: "held" },
      { month: "2026-06", registrations: 43,   checkIns: 32,   status: "held" },
      { month: "2026-07", registrations: 22,   checkIns: 16,   status: "held" },
      { month: "2026-08", registrations: 27,   checkIns: 16,   status: "held" },
      { month: "2026-09", registrations: null, checkIns: null, status: "upcoming" }
    ],
    notes: {
      nullMonths: "2025年8月・10月・11月、および2026年9月は、管理画面の申込・チェックインがどちらも ∅（データなし）です。" +
                  "0件という意味ではないため、グラフには数値として描かず「データなし」として扱っています。",
      zeroCheckIns: "2025年12月は申込24件に対してチェックイン記録が0件です。管理画面にも数値の0が表示されているため、" +
                    "データも 0 のまま保持し、「0件（チェックイン記録）」と表示しています。" +
                    "実参加者0人を意味しません。当日のチェックイン手続きが行われなかった可能性が高いものとして扱っています。",
      upcoming: "2026年9月（9/28開催予定の回）はまだ開催前です。参加実績0人ではなく「開催予定」です。" +
                "参加実績のグラフからは除外しています。",
      underCount: "チェックイン率の定義上、チェックインされなかった現地参加者は208件に含まれません。" +
                  "したがってこの期間の実際の参加者は、記録されている208件のチェックインより多かったと考えられます。" +
                  "2025年12月の Salesforce Tower Tokyo 開催回はその分かりやすい例で、" +
                  "チェックインは計測されていませんが、主催者の記憶では現地に約50人がいました。",
      eventLinkage: "イベント単位の申込・チェックイン件数は、管理画面の「開催月別」集計から対応させたものです。" +
                    "各月に開催が1件だけであることを確認したうえで紐付けていますが、" +
                    "イベント単位の明細そのものではありません。"
    },
    /* 3つの状態の表示ラベル。読者が取り違えないよう、必ず別の文言・別の見た目で出す。
       zero    … 数値の0が記録されている（実参加者0人ではない）
       noData  … 管理画面が ∅。集計そのものがない。合計・平均から除外する
       upcoming… まだ開催前。0でも — でもない */
    stateLabels: {
      zero:     { table: "0件（チェックイン記録）", short: "0件", note: "実参加者0人を意味しない" },
      noData:   { table: "集計なし", short: "—", note: "管理画面が ∅。合計・平均に含めない" },
      upcoming: { table: "開催予定", short: "開催予定", note: "2026年9月28日開催予定。参加実績はまだありません" }
    },

    /* イベント単位の数値の出どころを明示するフラグ。 */
    perEventDerivedFrom: "monthly-aggregate",
    perEventLabel: "月次集計より"
  }
};
