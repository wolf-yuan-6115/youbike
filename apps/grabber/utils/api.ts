import type { ParkingInfo } from "../types/youbike.types.ts";
import { logCurrentTime } from "./currentTime.ts";

export const parkingInfo = async (
  lat: number,
  lng: number,
): Promise<ParkingInfo | null> => {
  let returnData,
    retry = 0;
  while (retry < 3) {
    try {
      const response = await fetch(
        "https://apis.youbike.com.tw/tw2/parkingInfo",
        {
          method: "POST",
          body: JSON.stringify({
            lat,
            lng,
            maxDistance: 250,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        console.error(
          "Failed to fetch parking info:",
          response.statusText,
        );
        retry++;
        if (retry < 3) {
          logCurrentTime(
            `Retrying to fetch data, tried ${retry} times`,
          );
          await new Promise((resolve) => setTimeout(resolve, 500));
          // Delaying too much probably will affect CPU time,
          // I don't know maybe
        } else break;
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching parking info:", error);
      retry++;
      if (retry < 3) {
        logCurrentTime(
          `Retrying to fetch data, tried ${retry} times`,
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Delaying too much probably will affect CPU time,
        // I don't know maybe
      } else break;
      return null;
    }
  }

  return null;
};
