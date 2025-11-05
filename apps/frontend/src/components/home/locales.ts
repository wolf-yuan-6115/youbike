import type { Locales } from "@typing/i18n.types.ts";

const locales: Locales = {
  "zh-TW": {
    "dynamic:hasEmpty":
      '所以我說，我的 <span class="text-red-400">YouBike</span> 呢？',
    "dynamic:hasFull":
      '有 <span class="text-amber-400">YouBike</span> 沒有地方可以停ㄌ',
    "dynamic:normal":
      '現在有 <span class="text-emerald-400">YouBike</span> 可以借！',

    "hero:subtitle": "管什麼見車率，我要真實數據",

    "tracking:pre": "目前正在追蹤",
    "tracking:post": "個站點",

    "summary:empty:quantifier": "個",
    "summary:empty:text": "站無車可借",
    "summary:full:quantifier": "個",
    "summary:full:text": "站無位可還",
    "summary:bikes:quantifier": "臺",
    "summary:bikes:text": "可借車數",

    "info:title": "哦嗨，我是",
    "info:subtitle": "我做了你現在正在看的這個網站",
    "info:add": "我想加站點！",
    "info:blog": "看看這個網頁誕生的故事",

    "warning:title":
      "目前顯示的即時資料可能並非即時資料，因為後端服務暫時無法取得最新的 YouBike 資料",
    "warning:duration":"距上次取得最新資料已過 "
  },
  en: {
    "dynamic:hasEmpty":
      'So, where is my <span class="text-red-400">YouBike</span>?',
    "dynamic:hasFull":
      'Some <span class="text-amber-400">YouBike</span> cannot be parked!',
    "dynamic:normal":
      'There are <span class="text-emerald-400">YouBike</span> available for rent!',

    "hero:subtitle":
      "Who cares about government-provided statistics? I want to see it for myself.",

    "tracking:pre": "Currently tracking",
    "tracking:post": "stations",

    "summary:empty:quantifier": "",
    "summary:empty:text": "stations without bikes available",
    "summary:full:quantifier": "",
    "summary:full:text": "stations without returns available",
    "summary:bikes:quantifier": "",
    "summary:bikes:text": "bikes available",

    "info:title": "Oh hi, I'm",
    "info:subtitle": "I built the site you're seeing right now",
    "info:add": "I want to add a station!",
    "info:blog": "Read the story behind this site",

    "warning:title":
      "The live data displayed may be outdated, as the backend service is temporarily unable to fetch the latest YouBike data",
    "warning:duration":"Since last successful data update: "
  },
};

export default locales;
