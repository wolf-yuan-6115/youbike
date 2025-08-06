import type { ParkingInfo } from "../types/youbike.types.ts";
import { logCurrentTime } from "./currentTime.ts";

export const parkingInfo = async (
  stationIds: string[],
): Promise<ParkingInfo | null> => {
  let retry = 0;
  while (retry <= 5) {
    try {
      const response = await fetch(
        "https://apis.youbike.com.tw/tw2/parkingInfo",
        {
          method: "POST",
          body: JSON.stringify({
            station_no: stationIds,
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

      return await response.json();
    } catch (error) {
      logCurrentTime(`Error when fetching parking info: ${error}`, {
        isError: true,
      });

      retry++;
      logCurrentTime(`Retrying to fetch data, tried ${retry} times`);
      await new Promise((resolve) =>
        setTimeout(resolve, 500 + retry * 200),
      );
    }
  }

  return null;
};
