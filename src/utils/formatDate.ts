export function formatDateTime(event_datetime: string | Date): string {
  const parsedDate = new Date(event_datetime);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(event_datetime);
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}
