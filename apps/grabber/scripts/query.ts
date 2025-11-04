const stationName = prompt("Enter station name: ");

const rawStationData = await fetch(
  "https://apis.youbike.com.tw/json/station-min-yb2.json",
);

const stationData = await rawStationData.json();
const selectedStation = stationData.filter((k) =>
  k.name_tw.includes(stationName.trim()),
);

console.log(selectedStation);

if (selectedStation.length === 1) {
  const rawParkingData = await fetch(
    "https://apis.youbike.com.tw/tw2/parkingInfo",
    {
      method: "POST",
      body: JSON.stringify({
        station_no: [selectedStation[0].station_no],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const parkingData = await rawParkingData.json();

  console.log(parkingData.retVal.data[0]);
}
