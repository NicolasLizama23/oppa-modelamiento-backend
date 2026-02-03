import admin from "firebase-admin";

// conectar al emulador
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

// usa el mismo projectId que .firebaserc
const PROJECT_ID = "oppa-firestore-local";

if (!admin.apps.length) {
  admin.initializeApp({ projectId: PROJECT_ID });
}

export const db = admin.firestore();
export const Timestamp = admin.firestore.Timestamp;

export function toTimestamp(value) {
  // permite mandar ISO string o Date
  if (typeof value === "string") return Timestamp.fromDate(new Date(value));
  if (value instanceof Date) return Timestamp.fromDate(value);
  return value; // por si ya viene Timestamp
}
