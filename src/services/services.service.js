// Capa de servicios para obtener y gestionar servicios
// RESPONSABILIDAD: Procesar y formatear datos de servicios desde Firestore
import { fetchServices } from "../repository/querys.js";
import { mockServices } from "../utils/mock.js";

/**
 * Obtiene todos los servicios disponibles
 * Si Firestore está vacío, retorna los servicios del mock.
 */
export async function getServices() {
    const servicesSnap = await fetchServices();

    // Si Firestore tiene documentos
    if (servicesSnap && servicesSnap.docs.length > 0) {
        return servicesSnap.docs.map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre || "Sin nombre",
        }));
    }

    // 🔁 Fallback a mock si no hay datos en Firestore
    console.log("Firestore vacío, usando mockServices");
    return mockServices.map((s) => ({
        id: s.id,
        nombre: s.nombre,
    }));
}
