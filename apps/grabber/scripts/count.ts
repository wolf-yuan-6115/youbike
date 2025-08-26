const stationId = prompt("Please enter station ID: ");

const rawParkingData = await fetch(
  "https://apis.youbike.com.tw/tw2/parkingInfo",
  {
    method: "POST",
    body: JSON.stringify({ station_no: [stationId] }),
    headers: {
      "Content-Type": "application/json",
    },
  },
);

const parkingData = await rawParkingData.json();

console.log(parkingData.retVal.data[0]);
