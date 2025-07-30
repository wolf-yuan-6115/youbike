import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types.ts";
import type { Env } from "../types/env.types.ts";
import { parkingInfo } from "../utils/api.ts";
import {
  getCurrentTimeISOString,
  logCurrentTime,
} from "../utils/currentTime.ts";

export default async (env: Env) => {
  const supabase = createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
  );

  logCurrentTime(" =HOUR= Updating availability");

  const { data: existingData } = await supabase
    .from("stations")
    .select("*");

  const historyData = [];

  for (const station of existingData ?? []) {
    try {
      const data = await parkingInfo(station.lat, station.lng);

      if (!data) {
        logCurrentTime(
          `Unable to fetch data for station ${station.id}`,
        );
        continue;
      }

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

      historyData.push({
        station_id: station.id,
        available: targetStation.available_spaces,
        empty: targetStation.empty_spaces,
        at: getCurrentTimeISOString(),
      });
    } catch (error) {
      logCurrentTime(`Cooked when processing ${station.id}`);
      console.log(error);
    }
  }

  if (historyData.length > 0) {
    logCurrentTime(
      `Performing batch insert for ${historyData.length} stations`,
    );

    const { error } = await supabase
      .from("history")
      .insert(historyData);

    if (error) {
      console.error("Batch insert failed:", error);
    } else {
      logCurrentTime(
        `Successfully inserted ${historyData.length} history records`,
      );
    }
  } else {
    logCurrentTime(
      "Nothing to insert, did you add stations to database?",
    );
  }

  logCurrentTime(" =HOUR= Finished updating availability");
};
