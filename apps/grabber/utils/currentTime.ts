import { formatInTimeZone } from "date-fns-tz";

export function logCurrentTime(message: string, options: {isError?: boolean} = {}) {
  if (options.isError) {
    const currentTime = new Date();
    console.error(
      `${(currentTime.getMonth() + 1).toString().padStart(2, "0")}/${currentTime.getDate().toString().padStart(2, "0")} ${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")} ${message}`,
    );
  } else {
    const currentTime = new Date();
    console.log(
      `${(currentTime.getMonth() + 1).toString().padStart(2, "0")}/${currentTime.getDate().toString().padStart(2, "0")} ${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")} ${message}`,
    );
  }
}

export function getCurrentTimeISOString() {
  const currentTime = new Date();
  return formatInTimeZone(
    currentTime,
    "Asia/Taipei",
    "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  );
}
