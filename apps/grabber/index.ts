import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

import type { Database } from "./types/database.types";
import type { ParkingInfo } from "./types/youbike.types.ts";
import {
  getCurrentTimeISOString,
  logCurrentTime,
} from "./utils/currentTime.ts";

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error("Supabase connection information not provided");
  process.exit(1);
}

const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);
const stations = await supabase.from("stations").select("*");

if (!stations.data) {
  console.error("No stations configured!");
  process.exit(1);
}

cron.schedule("* * * * *", async () => {
  logCurrentTime("Updating availability");

  for (const station of stations.data) {
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
      const isUnavailable = targetStation.available_spaces < 5;

      if (isUnavailable)
        logCurrentTime(`Station ${station.id} is unavailable`);
      else logCurrentTime(`Station ${station.id} is available`);

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
          unavailable: isUnavailable ? 1 : 0,
          success: 1,
          fail: 0,
          update: currentTime,
          status: !isUnavailable,
        });
      } else if (isUnavailable) {
        await supabase
          .from("current")
          .update({
            bikes: targetStation.available_spaces,
            slots: targetStation.empty_spaces,
            unavailable: existingRecentlyData.data.unavailable + 1,
            success: existingRecentlyData.data.success + 1,
            update: currentTime,
            status: !isUnavailable,
          })
          .eq("station_id", station.id);
      } else {
        await supabase
          .from("current")
          .update({
            bikes: targetStation.available_spaces,
            slots: targetStation.empty_spaces,
            success: existingRecentlyData.data.success + 1,
            update: currentTime,
            status: !isUnavailable,
          })
          .eq("station_id", station.id);
      }
    } catch (error) {
      logCurrentTime(`Cooked when processing ${station.id}`);
      console.log(error);
    }
  }
});

logCurrentTime("Server started, waiting for next cron start");
