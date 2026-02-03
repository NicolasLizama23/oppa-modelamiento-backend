import { db } from "../config/firestore.js";

///-----------///
///  CUPONES  ///
///-----------///
// GET: Obtiene cupones con filtros dinámicos
export async function fetchCoupons(filters = {}) {
    try {
        let query = db.collection("coleccion-cupon");

        // Filtro por 'estado' (activo/inactivo)
        if (filters.estado !== undefined) {
            // Convertimos el string 'true'/'false' a booleano si es necesario
            const infoEstado = filters.estado === "true";
            query = query.where("estado", "==", infoEstado);
        }

        return await query.get();
    } catch (error) {
        throw error;
    }
}
// POST:
// UPDATE (o patch):

///-----------///
/// SERVICIOS ///
///---------- ///
// GET:
export async function fetchServices() {
    try {
        return db.collection("coleccion-servicio").get();
    } catch (error) {
        throw error;
    }
}

// POST:
// UPDATE (o patch):
