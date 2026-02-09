// Capa de logica de negocios
// RESPONSABILIDAD: Limpiar y procesar la data entrante según la lógica requerida para los cupones y servicios.
import { insertCoupon, deleteCoupon } from "../repository/crud.js";
import { fetchCoupons, fetchCouponById } from "../repository/querys.js";
import { formatDateCL } from "../utils/dateFormatter.js";
import { getServiceNameById, getMockUsagesByCoupon } from "../utils/mock.js";
import {
    validateCouponData,
    validateCouponFilters,
    validateCouponId,
} from "../validators/coupon.validator.js";

// CREAR CUPONES
export async function createCoupon(id, data) {
    // Validar datos de entrada
    const cleanData = validateCouponData(id, data);

    const couponToInsert = {
        ...cleanData,
        fecha_creacion: formatDateCL(new Date()),
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

    // 2) Obtener usos del cupón (SIMULADO)
    // Se usa el código del cupón para filtrar en el mock. Fallback a id si no tiene código.
    const searchCode = coupon.codigo || id;
    const usos = getMockUsagesByCoupon(searchCode);

    // 3) Procesar Aplicación / Servicios
    const esTodos = coupon.aplicacion_todos === true;
    const serviciosIds = Array.isArray(coupon?.aplicacion_algunos?.id_servicio)
        ? coupon.aplicacion_algunos.id_servicio
        : [];

    // 4) Construir Payload
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
                nombre_servicio: u.id_servicio
                    ? getServiceNameById(u.id_servicio)
                    : null,
                fecha_uso: u.fecha_uso,
            })),
        },
    };
}

// TODO: Eliminar funcion delete
export async function deleteCouponID(id) {
    const cleanId = validateCouponId(id);
    return deleteCoupon(cleanId);
}
