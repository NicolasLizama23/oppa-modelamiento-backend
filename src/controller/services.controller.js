// Controlador para gestionar servicios
// RESPONSABILIDAD: Manejar peticiones HTTP relacionadas con servicios
import { getServices } from "../services/services.service.js";

/**
 * GET /services
 * Obtiene la lista de todos los servicios disponibles
 */
export async function getServicesController(req, res) {
    try {
        const services = await getServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
