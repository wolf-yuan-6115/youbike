import type {
  ParkingData,
  ParkingInfo,
} from "../types/youbike.types.ts";
import { logCurrentTime } from "./currentTime.ts";

export const parkingInfo = async (
  stationIds: string[],
): Promise<ParkingData | null> => {
  const stationChunk: string[][] = [];
  for (let i = 0; i < stationIds.length; i += 20) {
    stationChunk.push(stationIds.slice(i, i + 20));
  }

  let allData: ParkingData = [];

  logCurrentTime(
    `Fetching data for ${stationIds.length} stations in ${stationChunk.length} chunks`,
  );

  for (
    let chunkIndex = 0;
    chunkIndex < stationChunk.length;
    chunkIndex++
  ) {
    const chunk = stationChunk[chunkIndex];
    if (!chunk) continue;

    let retry = 0;

    while (retry <= 5) {
      try {
        const response = await fetch(
          "https://apis.youbike.com.tw/tw2/parkingInfo",
          {
            method: "POST",
            body: JSON.stringify({
              station_no: chunk,
            }),
            headers: {
              "Content-Type": "application/json",
              "User-Agent":
                "youbike-grabber/1.0 (+https://youbike.wolf-yuan.dev)",
            },
          },
        );

        if (!response.ok) {
          logCurrentTime(
            `API returned abnormal status: ${response.status} - ${response.statusText}`,
            { isError: true },
          );

          retry++;
          logCurrentTime(
            `Retrying to fetch data, tried ${retry} times`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, 500 + retry * 200),
          );

          // Ahh current data is broken
          continue;
        }

        const result = (await response.json()) as ParkingInfo;
        allData.push(...result.retVal.data);

        logCurrentTime(
          `Fetched chunk ${chunkIndex + 1} of ${stationChunk.length} (${chunk.length} stations)`,
        );
        break;
      } catch (error) {
        logCurrentTime(`Error when fetching parking info: ${error}`, {
          isError: true,
        });

        retry++;
        logCurrentTime(
          `Retrying to fetch data, tried ${retry} times`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, 500 + retry * 200),
        );
      }
    }

    if (retry > 5) {
      logCurrentTime(
        `Failed to fetch chunk ${chunkIndex + 1} after 5 retries`,
        { isError: true },
      );
      return null;
    }
  }

  return allData;
};
