import type { ParkingInfo } from "../types/youbike.types.ts";

export const parkingInfo = async (
  lat: number,
  lng: number,
): Promise<ParkingInfo | null> => {
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
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching parking info:", error);
    return null;
  }
};
