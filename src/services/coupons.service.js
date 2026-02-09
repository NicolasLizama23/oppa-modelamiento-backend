// Capa de logica de negocios
// RESPONSABILIDAD: Limpiar y procesar la data entrante según la lógica requerida para los cupones y servicios.
import { insertCoupon, deleteCoupon } from "../repository/crud.js";
import {
    fetchCoupons,
    fetchCouponById,
    fetchCouponUsages,
    fetchServiceById,
} from "../repository/querys.js";
import { toTimestamp } from "../config/firestore.js";
import { formatDateCL } from "../utils/dateFormatter.js";
import {
    validateCouponData,
    validateCouponFilters,
    validateCouponId,
} from "../validators/coupon.validator.js";

// CREAR CUPONES
export async function createCoupon(id, data) {
    // 1. Validar que el ID no exista
    const existingCoupon = await fetchCouponById(id);
    if (existingCoupon.exists) {
        throw new Error(`El cupón con ID '${id}' ya existe`);
    }

    // 2. Validar datos de entrada (Estructura)
    const cleanData = validateCouponData(id, data);

    // 3. Validacion Asincrona: Verificar que los servicios existan
    if (cleanData.aplicacion_todos === false) {
        const serviciosIds = cleanData.aplicacion_algunos || [];
        
        // Verificamos en paralelo si existen
        await Promise.all(
            serviciosIds.map(async (srvId) => {
                const service = await fetchServiceById(srvId);
                if (!service) {
                    throw new Error(`El servicio con ID '${srvId}' no existe en la base de datos`);
                }
            })
        );
    }

    const couponToInsert = {
        ...cleanData,
        fecha_inicio: toTimestamp(cleanData.fecha_inicio),
        fecha_termino: toTimestamp(cleanData.fecha_termino),
        fecha_creacion: toTimestamp(new Date()),
    };

    console.log("Cupón validado e insertado con éxito");
    return insertCoupon(id, couponToInsert);
}



// Obtiene cupones aplicando filtros
export async function getCoupons(filters) {
    const cleanFilters = validateCouponFilters(filters);
    const snapshot = await fetchCoupons(cleanFilters);

    return snapshot.docs.map((doc) => {
        const coupon = doc.data();

        return {
            id: doc.id,
            codigo: coupon.codigo,
            estado: coupon.estado,
            descuento: coupon.descuento,
            fecha_inicio: formatDateCL(coupon.fecha_inicio),
            fecha_termino: formatDateCL(coupon.fecha_termino),
            fecha_creacion: formatDateCL(coupon.fecha_creacion),
        };
    });
}

///---------------------------///
///  PopUp de "Ver Detalles"  ///
///---------------------------///
export async function getCouponDetails(id) {
    const cleanId = validateCouponId(id);

    // 1) Obtener cupón (docId = id)
    const couponSnap = await fetchCouponById(cleanId);

    if (!couponSnap.exists) {
        const e = new Error("Cupón no encontrado");
        e.status = 404;
        throw e;
    }

    const coupon = couponSnap.data();

    // 2) Obtener usos del cupón (REAL)
    // Se usa el código del cupón para filtrar
    const searchCode = coupon.codigo || id;
    const usosSnapshot = await fetchCouponUsages(searchCode);
    const usos = usosSnapshot.docs.map((doc) => doc.data());

    // 3) Procesar Aplicación / Servicios
    const esTodos = coupon.aplicacion_todos === true;
    const serviciosIds = Array.isArray(coupon?.aplicacion_algunos)
        ? coupon.aplicacion_algunos
        : [];

    let serviciosData = [];
    if (!esTodos && serviciosIds.length > 0) {
        // Resolvemos las promesas para obtener los nombres de los servicios
        serviciosData = await Promise.all(
            serviciosIds.map(async (sid) => {
                const service = await fetchServiceById(sid);
                return {
                    id_servicio: sid,
                    nombre_servicio: service ? service.nombre : "Servicio no encontrado",
                };
            })
        );
    }

    // 4) Construir Payload
    return {
        id,
        codigo: coupon.codigo || id,
        fecha_inicio: formatDateCL(coupon.fecha_inicio),
        fecha_termino: formatDateCL(coupon.fecha_termino),
        fecha_creacion: formatDateCL(coupon.fecha_creacion),
        aplicacion: esTodos ? "Todos los servicios" : "Servicios específicos",
        servicios: serviciosData,
        usos: {
            total: usos.length,
            items: await Promise.all(
                usos.map(async (u) => {
                    let nombreServicio = null;
                    if (u.id_servicio) {
                        const s = await fetchServiceById(u.id_servicio);
                        nombreServicio = s ? s.nombre : "Desconocido";
                    }
                    return {
                        id_usuario: u.id_usuario || null,
                        id_servicio: u.id_servicio || null,
                        nombre_servicio: nombreServicio,
                        fecha_uso: u.fecha_uso,
                    };
                })
            ),
        },
    };
}

// TODO: Eliminar funcion delete
export async function deleteCouponID(id) {
    const cleanId = validateCouponId(id);
    return deleteCoupon(cleanId);
}
