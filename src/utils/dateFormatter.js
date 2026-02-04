/**
 * Formatea fechas a formato local Chile (dd-mm-aaaa).
 * Soporta:
 * - Firestore Timestamp (tiene toDate())
 * - Date
 * - number (epoch ms)
 * - string (parseable por Date)
 */
export function formatDateCL(value) {
  if (!value) return null;

  let date;

  if (typeof value?.toDate === "function") {
    date = value.toDate(); // Firestore Timestamp
  } else if (value instanceof Date) {
    date = value;
  } else if (typeof value === "number") {
    date = new Date(value);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

