import type { Tables } from "../types/database.types.ts";
import type { ParkingInfo } from "../types/youbike.types.ts";
import {
  getCurrentTimeISOString,
  logCurrentTime,
} from "../utils/currentTime.ts";
import { supabase } from "../utils/supabaseClient.ts";

export default async (stations: Tables<"stations">[]) => {
  logCurrentTime(" =HOUR= Updating availability");

  for (const station of stations) {
    try {
      logCurrentTime(`Processing ${station.id}`);
      const response = await fetch(
        "https://apis.youbike.com.tw/tw2/parkingInfo",
        {
          method: "POST",
          body: JSON.stringify({
            lat: station.lat,
            lng: station.lng,
            maxDistance: 500,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data: ParkingInfo = await response.json();
      const targetStation = data.retVal.find(
        (k) => k.station_no === station.id.toString(),
      );

      if (!targetStation) {
        console.error(
          `Unable to find target station ${station.id}, lat: ${station.lat} lng: ${station.lng}`,
        );
        continue;
      }

      logCurrentTime(
        `Station ${station.id} got ${targetStation.available_spaces}/${targetStation.parking_spaces}`,
      );

      const currentTime = getCurrentTimeISOString();

      logCurrentTime(`Saving ${station.id} hourly data`);

      await supabase.from("history").insert({
        station_id: station.id,
        available: targetStation.available_spaces,
        empty: targetStation.empty_spaces,
        at: currentTime,
      });
    } catch (error) {
      logCurrentTime(`Cooked when processing ${station.id}`);
      console.log(error);
    }
  }

  logCurrentTime(" =HOUR= Finished updating availability");
};
