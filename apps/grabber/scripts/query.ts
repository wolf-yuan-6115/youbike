const stationName = prompt("Enter station name: ");

// Station name things
const zh = {
  "01": "臺北市",
  "02": "新北市",
  "03": "桃園市",
  "05": "新竹縣",
  "04": "新竹市",
  "82": "新竹科學園區",
  "07": "苗栗縣",
  "06": "臺中市",
  "11": "嘉義縣",
  "10": "嘉義市",
  "13": "臺南市",
  "12": "高雄市",
  "14": "屏東縣",
  "15": "臺東縣",
};

const en = {
  "01": "Taipei City",
  "02": "New Taipei City",
  "03": "Taoyuan City",
  "05": "Hsinchu County",
  "04": "Hsinchu City",
  "82": "Hsinchu Science Park",
  "07": "Miaoli County",
  "06": "Taichung City",
  "11": "Chiayi County",
  "10": "Chiayi City",
  "13": "Tainan City",
  "12": "Kaohsiung City",
  "14": "Pingtung County",
  "15": "Taitung County",
};

// Number?
if (!isNaN(stationName)) {
  const rawStationData = await fetch(
    "https://apis.youbike.com.tw/json/station-min-yb2.json",
  );

  const stationData = await rawStationData.json();
  const selectedStation = stationData.find(
    (k) => k.station_no === stationName,
  );

  const rawParkingData = await fetch(
    "https://apis.youbike.com.tw/tw2/parkingInfo",
    {
      method: "POST",
      body: JSON.stringify({ station_no: [stationName] }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const parkingData = (await rawParkingData.json()).retVal.data.find(
    (k) => k.station_no === stationName,
  );

  const areaCode = selectedStation.station_no.substring(2, 4);

  console.log(
    [
      selectedStation.station_no,
      selectedStation.name_tw,
      selectedStation.lat,
      selectedStation.lng,
      `${zh[areaCode.toString()]}${selectedStation.district_tw}${selectedStation.address_tw}`,
      parkingData.parking_spaces,
      selectedStation.name_en,
      `${selectedStation.address_en}, ${selectedStation.district_en}, ${en[areaCode.toString()]}`,
    ]
      .map((k) => `"${k}"`)
      .join(","),
  );
} else {
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

    const parkingData = (await rawParkingData.json()).retVal.data.find(
      (k) => k.station_no === selectedStation[0].station_no,
    );

    const areaCode = selectedStation[0].station_no.substring(2, 4);

    console.log(
      [
        selectedStation[0].station_no,
        selectedStation[0].name_tw,
        selectedStation[0].lat,
        selectedStation[0].lng,
        `${zh[areaCode.toString()]}${selectedStation[0].district_tw}${selectedStation[0].address_tw}`,
        parkingData.parking_spaces,
        selectedStation[0].name_en,
        `${selectedStation[0].address_en}, ${selectedStation[0].district_en}, ${en[areaCode.toString()]}`,
      ]
        .map((k) => `"${k}"`)
        .join(","),
    );
  }
}
