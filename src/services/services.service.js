// Capa de servicios para obtener y gestionar servicios
// RESPONSABILIDAD: Procesar y formatear datos de servicios desde Firestore
import { fetchServices } from "../repository/querys.js";

/**
 * Obtiene todos los servicios disponibles
 * @returns {Promise<Array>} - Lista de servicios con formato {id, nombre}
 */
export async function getServices() {
    const servicesSnap = await fetchServices();
    
    // Mapear documentos de Firestore a formato simple
    return servicesSnap.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre || "Sin nombre",
    }));
}
