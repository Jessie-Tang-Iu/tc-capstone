export function formatDateToFullDisplay(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short", // Thu
    month: "short", // Jul
    day: "2-digit", // 03
    year: "numeric", // 2025
    hour: "numeric", // 6 PM
    minute: "2-digit", // :00
    hour12: true,
    timeZone: "America/Edmonton", // MST/MDT
    timeZoneName: "short",
  }).format(new Date(dateString));
}
