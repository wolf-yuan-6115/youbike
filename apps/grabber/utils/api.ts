import type {
  ParkingData,
  ParkingInfo,
} from "../types/youbike.types.ts";
import { logCurrentTime } from "./currentTime.ts";

export const parkingInfo = async (
  stationIds: string[],
): Promise<ParkingData | null> => {
  let currentPage = 1;
  let totalPage = 1;
  let allData: ParkingData = [];

  do {
    let retry = 0;
    while (retry <= 5) {
      try {
        const response = await fetch(
          "https://apis.youbike.com.tw/tw2/parkingInfo",
          {
            method: "POST",
            body: JSON.stringify({
              station_no: stationIds,
              page: currentPage,
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
        if (currentPage === 1) {
          totalPage = result.retVal.total_page;
        }
        allData.push(...result.retVal.data);
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
      return null;
    }

    currentPage++;

    console.log(
      `Fetched data page ${currentPage - 1} of ${totalPage}`,
    );
  } while (currentPage <= totalPage);

  return allData;
};
