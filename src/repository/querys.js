import { db } from "../config/firestore.js";
import { mockServices } from "../utils/mockData.js";

// --------------------
// Helpers internos
// --------------------
// Mapa id_servicio -> nombre_servicio para resolver rápido desde mock
const servicesMap = new Map(mockServices.map((s) => [s.id, s.nombre]));

// Helper interno: dado un id, devuelve el nombre o fallback
function getServiceNameById(id) {
  return servicesMap.get(id) || "Servicio desconocido";
}

///-----------///
///  CUPONES  ///
///-----------///
// GET: Obtiene cupones con filtros dinámicos
export async function fetchCoupons(filters = {}) {
    try {
        let query = db.collection("coleccion-cupones");

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

///---------------------------///
///  PopUp de "Ver Detalles"  ///
///---------------------------///
/// GET: Detalle para popup "Ver detalles"
export async function fetchCouponDetails(id) {
  try {
    // 1) Cupón (docId = id)
    const couponSnap = await db.collection("coleccion-cupones").doc(id).get();

    if (!couponSnap.exists) {
      const e = new Error("Cupón no encontrado");
      e.status = 404;
      throw e;
    }

    const coupon = couponSnap.data();

    // 2) Usos del cupón (colección global)
    const usosSnap = await db
      .collection("usos")
      .where("codigo_cupon", "==", id)
      .orderBy("fecha_uso", "desc")
      .get();

    const usos = usosSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // 3) Aplicación / Servicios
    const esTodos = coupon.aplicacion_todos === true;
    const serviciosIds = Array.isArray(coupon?.aplicacion_algunos?.id_servicio)
      ? coupon.aplicacion_algunos.id_servicio
      : [];

    // 4) Payload para el popup (data lista, no snapshot)
    return {
      id,
      codigo: coupon.codigo || id,
      aplicacion: esTodos ? "Todos los servicios" : "Servicios específicos",
      servicios: esTodos
        ? []
        : serviciosIds.map((sid) => ({
            id_servicio: sid,
            nombre_servicio: getServiceNameById(sid),
          })),
      usos: {
        total: usos.length,
        items: usos.map((u) => ({
          id_usuario: u.id_usuario || null,
          id_servicio: u.id_servicio || null,
          nombre_servicio: u.id_servicio ? getServiceNameById(u.id_servicio) : null,
          fecha_uso: u.fecha_uso?.toDate ? u.fecha_uso.toDate().toISOString() : null,
        })),
      },
    };
  } catch (error) {
    throw error;
  }
}
