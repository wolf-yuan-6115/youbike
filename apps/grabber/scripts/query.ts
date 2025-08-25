const stationName = prompt("Enter station name: ");

const rawStationData = await fetch(
  "https://apis.youbike.com.tw/json/station-min-yb2.json",
);

const stationData = await rawStationData.json();

console.log(
  stationData.filter((k) => k.name_tw.includes(stationName.trim())),
);
