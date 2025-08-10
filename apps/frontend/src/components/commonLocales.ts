import type { Locales } from "@typing/i18n.types.ts";

const locales: { [k: string]: Locales } = {
  nav: {
    "zh-TW": {
      title: "查 Bike",
      language: "Switch language",
    },
    en: { title: "Cha Bike", language: "切換語言" },
  },
  footer: {
    "zh-TW": {
      "made:pre": "使用",
      "made:connect": "和",
      "made:post": "製作而成",
    },
    en: {
      "made:pre": "Made with",
      "made:connect": "and",
      "made:post": "",
    },
  },
  stationCard: {
    "zh-TW": {
      "status:normal": "可借可還",
      "status:empty": "可借數量 <5",
      "status:full": "可還空位 <3",

      "location:connect": "站點位於",

      "station:total:pre": "總共有",
      "station:total:post": "個車位",
      "station:tracked": "總追蹤時數",

      "time:noBike": "的時間 <5 臺車可以借",
      "time:noSlot": "的時間 <3 位可還",

      "update:text": "即時車數最後更新：",
      "update:id": "站點 ID：",
      "update:notice": "站點總容量視現場狀況而定",

      "button:text": "查看更多歷史資料",
    },
    en: {
      "status:normal": "Rent & Return",
      "status:empty": "<5 Bikes",
      "status:full": "<3 Docks",

      "location:connect": "is located at",

      "station:total:pre": "Total of",
      "station:total:post": "docks",
      "station:tracked": "Total tracking time",

      "time:noBike": "Of time <5 bikes",
      "time:noSlot": "Of time <3 docks",

      "update:text": "Last live update:",
      "update:id": "Station ID:",
      "update:notice":
        "Total capacity may vary depending on on-site conditions",

      "button:text": "View more historical data",
    },
  },
  historyBar: {
    "zh-TW": {
      "text:pre": "可借",
      "text:connect": "台，",
      "text:post": "位可還",
    },
    en: {
      "text:pre": "",
      "text:connect": " bikes, and",
      "text:post": " docks",
    },
  },
  chart: {
    "zh-TW": {
      javascript: "JavaScript 已關閉",
    },
    en: {
      javascript: "JavaScript is disabled",
    },
  },
};

export default locales;
