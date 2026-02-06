// Capa de logica de negocios
// RESPONSABILIDAD: Limpiar y procesar la data entrante según la lógica requerida para los cupones y servicios.
import { insertCoupon, deleteCoupon } from "../repository/crud.js";
import {
    fetchCoupons,
    fetchCouponById,
} from "../repository/querys.js";
import { formatDateCL } from "../utils/dateFormatter.js";
import { getServiceNameById, getMockUsagesByCoupon } from "../utils/mock.js";

// CREAR CUPONES
export async function createCoupon(id, data) {
    if (!id) throw new Error("ID requerido");
    if (typeof data.estado !== "boolean") {
        throw new Error("El campo estado debe ser booleano");
    }
    if (data.descuento.valor <= 0) {
        throw new Error("Descuento inválido");
    }

    console.log("Cupon insertado con exito!");
    return insertCoupon(id, {
        ...data,
        fecha_creacion: new Date().getTime(),
    });
}

// Obtiene cupones aplicando filtros
export async function getCoupons(filters) {
    const snapshot = await fetchCoupons(filters);

    return snapshot.docs.map((doc) => {
        const c = doc.data();

        return {
            id: doc.id,
            codigo: c.codigo,
            estado: c.estado,
            descuento: c.descuento,
            fecha_inicio: formatDateCL(c.fecha_inicio),
            fecha_termino: formatDateCL(c.fecha_termino),
            fecha_creacion: formatDateCL(c.fecha_creacion),
        };
    });
}

///---------------------------///
///  PopUp de "Ver Detalles"  ///
///---------------------------///
export async function getCouponDetails(id) {
    if (!id) throw new Error("ID requerido");

    // 1) Obtener cupón (docId = id)
    const couponSnap = await fetchCouponById(id);

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
                fecha_uso: u.fecha_uso 
            })),
        },
    };
}

// TODO: Eliminar funcion delete
export async function deleteCouponID(id) {
    if (!id) throw new Error("ID requerido para eliminar");
    return deleteCoupon(id);
}
