interface Event {
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  color: string;
}
export default function isValidEventArray(data: unknown): data is Event[] {
  if (!Array.isArray(data)) {
    return false;
  }
  for (const item of data) {
    if (typeof item !== "object" || item === null) {
      return false;
    }
    if (
      !("date" in item && typeof item.date === "string") ||
      !("startTime" in item && typeof item.startTime === "string") ||
      !("endTime" in item && typeof item.endTime === "string") ||
      !("title" in item && typeof item.title === "string") ||
      !("color" in item && typeof item.color === "string")
    ) {
      return false;
    }
  }
  return true;
}
