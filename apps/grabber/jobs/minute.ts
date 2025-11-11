import { createClient } from "@supabase/supabase-js";
import type { Database, Tables } from "../types/database.types.ts";
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

  logCurrentTime(" =MINUTE= Updating availability");

  const { data: existingData } = await supabase
    .from("current")
    .select("*, station_id(*)");
  if (!existingData) {
    logCurrentTime(
      "Nothing to add, did you create base record in table current?",
    );
    return;
  }

  const existingDataMap = new Map(
    existingData.map((item) => [item.station_id.id, item]) || [],
  );

  const stations = existingData.map((k) => k.station_id);
  const stationIds = stations.map((station) => station.id.toString());

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

  const upsertData: Tables<"current">[] = [];

  for (const station of stations) {
    try {
      const targetStation = data.find(
        (k) => k.station_no === station.id.toString(),
      );

      if (!targetStation) {
        console.error(
          `Unable to find target station ${station.id}, lat: ${station.lat} lng: ${station.lng}`,
        );
        continue;
      }

      const isAbnormalStatus = targetStation.status !== 1;
      const isNoBike = targetStation.available_spaces <= 5;
      const isNoSlot = targetStation.empty_spaces <= 3;

      logCurrentTime(
        `Station ${station.id} got ${targetStation.available_spaces}/${targetStation.parking_spaces}, noBike: ${isNoBike} noSlot: ${isNoSlot}`,
      );

      const existingRecord = existingDataMap.get(station.id);
      if (!existingRecord) {
        logCurrentTime(
          `Something really went wrong, ${station.id} is not defined in the table but it's in the map`,
        );
        continue;
      }

      let unavailableIncrement = isNoBike ? 1 : 0;
      let fullIncrement = isNoSlot ? 1 : 0;

      if (isAbnormalStatus) {
        unavailableIncrement = 0;
        fullIncrement = 0;
      }

      const commonData = {
        station_id: station.id,
        bikes: targetStation.available_spaces,
        slots: targetStation.empty_spaces,
        update: getCurrentTimeISOString(),
      };

      upsertData.push({
        ...commonData,
        unavailable:
          existingRecord.unavailable + unavailableIncrement,
        full: existingRecord.full + fullIncrement,
        success: existingRecord.success + 1,
        status:
          isAbnormalStatus
            ? "UNKNOWN"
            : isNoSlot
              ? "FULL"
              : isNoBike
                ? "EMPTY"
                : "NORMAL",
        types: targetStation.available_spaces_detail,
      });
    } catch (error) {
      logCurrentTime(
        `Cooked when processing ${station.id}: ${error}`,
        { isError: true },
      );
    }
  }

  if (upsertData.length > 0) {
    logCurrentTime(
      `Performing batch upsert for ${upsertData.length} stations`,
    );

    const { error } = await supabase
      .from("current")
      .upsert(upsertData, {
        onConflict: "station_id",
      });

    if (error) {
      logCurrentTime("Batch upsert failed:" + error, {
        isError: true,
      });
    } else {
      logCurrentTime(
        `Successfully updated ${upsertData.length} stations`,
      );
    }
  } else {
    logCurrentTime(
      "Nothing to update, did you add stations to database?",
    );
  }

  logCurrentTime(" =MINUTE= Finished updating availability");
};
