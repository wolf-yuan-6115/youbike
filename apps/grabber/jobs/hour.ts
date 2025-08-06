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

  if (!existingData || existingData.length === 0) {
    logCurrentTime(
      "Nothing to add, did you add stations to database?",
    );
    return;
  }

  const stationIds = existingData.map((station) =>
    station.id.toString(),
  );

  logCurrentTime(
    `Fetching data for ${stationIds.length} stations in batch`,
  );

  const t0 = performance.now();
  const data = await parkingInfo(stationIds);
  const t1 = performance.now();

  if (!data) {
    logCurrentTime("Unable to fetch batch data");
    return;
  }

  logCurrentTime(`Batch API call completed in ${t1 - t0}ms`);

  const historyData = [];

  console.log(data);

  for (const station of existingData) {
    try {
      const targetStation = data.retVal.data.find(
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
        types: targetStation.available_spaces_detail,
      });
    } catch (error) {
      logCurrentTime(
        `Cooked when processing ${station.id}: ${error}`,
        {
          isError: true,
        },
      );
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
      logCurrentTime("Batch insert failed:" + error, {
        isError: true,
      });
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
