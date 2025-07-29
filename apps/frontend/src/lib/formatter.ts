export function formatMinuteCount(minute: number): string {
  const hours = Math.floor(minute / 60);
  const minutes = minute % 60;

  const textParts: string[] = [];
  if (hours > 0) textParts.push(`${hours} 小時`);
  if (minutes > 0 || hours === 0) textParts.push(`${minutes} 分鐘`);
  return textParts.join(" ");
}
