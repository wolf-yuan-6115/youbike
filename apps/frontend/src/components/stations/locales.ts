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

    "summary:bikes:quantifier": "輛",
    "summary:bikes:text": "YouBike 2.0 可借",
    "summary:bikes:unsupported": "不適用",
    "summary:electric:text": "YouBike 電輔車可借",
    "summary:slots:quantifier": "個",
    "summary:slots:text": "還車柱可還",

    "update:text": "最後更新時間：",

    "card:empty": "個時段無車可借",
    "card:full": "個時段無位可還",

    "oclock:title": "整點車輛紀錄",
    "chart:draggable": "可以用手縮放、拖曳",

    "predict:title": "不那麼聰明的預測",
    "predict:noBike": "無車可借機率",
    "predict:noSlot": "無位可還機率",
    "predict:notice": "預測只用七天資料，準確性有但不多",
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

    "summary:bikes:quantifier": "",
    "summary:bikes:text": "YouBike 2.0 available",
    "summary:bikes:unsupported": "N/A",
    "summary:electric:text": "YouBike 2.0E available",
    "summary:slots:quantifier": "",
    "summary:slots:text": "slots available for return",

    "update:text": "Last updated:",

    "card:empty": "times with no bikes",
    "card:full": "times with no slots",

    "oclock:title": "Hourly bike historical data",
    "chart:draggable": "Draggable and zoomable!",

    "predict:title": "Not so smart prediction",
    "predict:noBike": "No bike available probability",
    "predict:noSlot": "No slot available probability",
    "predict:notice":
      "Prediction is based on only seven days of data, accuracy is (very) limited",
  },
};

export default locales;
