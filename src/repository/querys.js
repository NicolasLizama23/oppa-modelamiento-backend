import { db } from "../config/firestore.js";
import { buildQuery } from "../helpers/queryBuilder.js";

///-----------///
///  CUPONES  ///
///-----------///
// GET: Obtiene cupones con filtros dinámicos

export async function fetchCoupons(filters = {}) {
    try {
        const query = db.collection("coleccion-cupon");

        // Aqui la 'q' indica 'query', y 'value' el valor a filtrar
        const filterConfig = {
            estado: (q, value) => {
                // Si el valor es "todos", no filtramos
                if (value === "todos") return q;
                
                // Convertimos string a booleano solo si es "true"
                const booleanValue = value === "true";
                return q.where("estado", "==", booleanValue);
            },
            tipo: (q, value) => {
                if (value === "todos") return q;
                return q.where("descuento.tipo", "==", value);
            },
            aplicacion: (q, value) => {
                if (value === "todos") return q;
                // "global" -> aplicacion_todos = true
                if (value === "global") return q.where("aplicacion_todos", "==", true);
                // "algunos" -> aplicacion_todos = false
                if (value === "algunos") return q.where("aplicacion_todos", "==", false);
                
                return q;
            },
        };

        const finalQuery = buildQuery(query, filters, filterConfig);
        return await finalQuery.get();
    } catch (error) {
        throw error;
    }
}

// GET: Obtiene el documento de un cupón por ID
export async function fetchCouponById(id) {
    try {
        return await db.collection("coleccion-cupon").doc(id).get();
    } catch (error) {
        throw error;
    }
}

// GET: Obtiene los usos de un cupón
export async function fetchCouponUsages(couponId) {
    try {
        return await db
            .collection("usos")
            .where("codigo_cupon", "==", couponId)
            .orderBy("fecha_uso", "desc")
            .get();
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

// GET: Obtiene un servicio por ID
export async function fetchServiceById(id) {
    try {
        const doc = await db.collection("coleccion-servicio").doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error("Error fetching service:", error);
        return null;
    }
}

// POST:
// UPDATE (o patch):
