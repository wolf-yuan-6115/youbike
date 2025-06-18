export function logCurrentTime(message?: string) {
  const currentTime = new Date();
  console.log(
    `${currentTime.getMonth().toString().padStart(2, "0")}/${currentTime.getDate().toString().padStart(2, "0")} ${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")} ${message ?? message}`,
  );
}
