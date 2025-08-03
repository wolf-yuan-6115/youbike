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

    "summary:empty": "<5 臺車可借",
    "summary:full": "<3 位可還",

    "detailed:title": "詳細站點資料",

    "info:title": "哦嗨，我是",
    "info:subtitle": "我做了你現在正在看的這個網站",
    "info:add": "我想加站點！",
    "info:blog": "看看這個網頁誕生的故事",
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

    "summary:empty": "<5 bikes available for rent",
    "summary:full": "<3 docks empty for returning bikes",

    "detailed:title": "Stations",

    "info:title": "Oh hi, I'm",
    "info:subtitle": "I built the site you're seeing right now",
    "info:add": "I want to add a station!",
    "info:blog": "Read the story behind this site",
  },
};

export default locales;
