import type { Tables } from "../types/database.types.ts";
import type { ParkingInfo } from "../types/youbike.types.ts";
import {
  getCurrentTimeISOString,
  logCurrentTime,
} from "../utils/currentTime.ts";
import { supabase } from "../utils/supabaseClient.ts";

export default async (stations: Tables<"stations">[]) => {
  logCurrentTime(" =MINUTE= Updating availability");

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
      const isNoBike = targetStation.available_spaces <= 5;
      const isNoSlot = targetStation.empty_spaces <= 3;

      if (isNoBike)
        logCurrentTime(`Station ${station.id} is unavailable`);
      else logCurrentTime(`Station ${station.id} is available`);

      if (isNoSlot)
        logCurrentTime(
          `Station ${station.id} has no available slots`,
        );
      else
        logCurrentTime(`Station ${station.id} has available slots`);

      const existingRecentlyData = await supabase
        .from("current")
        .select()
        .eq("station_id", station.id)
        .single();
      const currentTime = getCurrentTimeISOString();

      if (!existingRecentlyData || !existingRecentlyData.data) {
        logCurrentTime(
          `Station ${station.id} is not in the database, adding entry`,
        );

        await supabase.from("current").insert({
          station_id: station.id,
          bikes: targetStation.available_spaces,
          slots: targetStation.empty_spaces,
          unavailable: isNoBike ? 1 : 0,
          full: isNoSlot ? 1 : 0,
          success: 1,
          fail: 0,
          update: currentTime,
          status: isNoSlot ? "FULL" : isNoBike ? "EMPTY" : "NORMAL",
        });
      } else if (isNoBike) {
        // <= 5 bikes is available
        await supabase
          .from("current")
          .update({
            bikes: targetStation.available_spaces,
            slots: targetStation.empty_spaces,
            unavailable: existingRecentlyData.data.unavailable + 1,
            success: existingRecentlyData.data.success + 1,
            update: currentTime,
            status: "EMPTY",
          })
          .eq("station_id", station.id);
      } else if (isNoSlot) {
        // <= 3 slots is available
        await supabase
          .from("current")
          .update({
            bikes: targetStation.available_spaces,
            slots: targetStation.empty_spaces,
            full: existingRecentlyData.data.full + 1,
            success: existingRecentlyData.data.success + 1,
            update: currentTime,
            status: "FULL",
          })
          .eq("station_id", station.id);
      } else {
        // Normal state
        await supabase
          .from("current")
          .update({
            bikes: targetStation.available_spaces,
            slots: targetStation.empty_spaces,
            success: existingRecentlyData.data.success + 1,
            update: currentTime,
            status: "NORMAL",
          })
          .eq("station_id", station.id);
      }
    } catch (error) {
      logCurrentTime(`Cooked when processing ${station.id}`);
      console.log(error);
    }
  }

  logCurrentTime(" =MINUTE= Finished updating availability");
};
