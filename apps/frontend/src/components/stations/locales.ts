import type { Locales } from "@typing/i18n.types.ts";

const locales: Locales = {
  "zh-TW": {
    "dynamic:noSlots":
      '現在沒有任何 <span class="text-red-400">YouBike</span> 停車柱可以停',
    "dynamic:noBikes":
      '完全沒有 <span class="text-red-400">YouBike</span> 可以借',
    "dynamic:almostFull":
      '快要沒有 <span class="text-amber-400">YouBike</span> 停車柱了',
    "dynamic:almostEmpty":
      '可以借的 <span class="text-amber-400">YouBike</span> 數量少的可憐',
    "dynamic:normal":
      '這裡的 <span class="text-emerald-400">YouBike</span> 可以借也可以還！',

    "location:pre": "位於",
    "location:post": "的 YouBike 站點",

    "summary:bikes": "臺車可借",
    "summary:slots": "個柱可還",

    "update:text": "最後更新時間：",

    "oclock:title": "整點車輛紀錄",
  },
  en: {
    "dynamic:noSlots":
      'There are currently no <span class="text-red-400">YouBike</span> parking slots available',
    "dynamic:noBikes":
      'No <span class="text-red-400">YouBike</span> available at all',
    "dynamic:almostFull":
      'Almost no <span class="text-amber-400">YouBike</span> parking slots left',
    "dynamic:almostEmpty":
      'Almost no <span class="text-amber-400">YouBike</span> bikes left to rent',
    "dynamic:normal":
      '<span class="text-emerald-400">YouBike</span> available for both rent and return!',

    "location:pre": "YouBike station at",
    "location:post": "",

    "summary:bikes": "bikes available",
    "summary:slots": "slots available",

    "update:text": "Last updated:",

    "oclock:title": "Hourly bike historical data",
  },
};

export default locales;
