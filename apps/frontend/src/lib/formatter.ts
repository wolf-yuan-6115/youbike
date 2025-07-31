export function formatMinuteCount(
  rawValue: number,
  locale?: string,
): string {
  const hours = Math.floor(rawValue / 60);
  const minutes = rawValue % 60;
  const hour = locale === "zh-TW" ? "小時" : "hours";
  const minute = locale === "zh-TW" ? "分鐘" : "minutes";

  const textParts: string[] = [];
  if (hours > 0) textParts.push(`${hours} ${hour}`);
  if (minutes > 0 || hours === 0)
    textParts.push(`${minutes} ${minute}`);
  return textParts.join(" ");
}
