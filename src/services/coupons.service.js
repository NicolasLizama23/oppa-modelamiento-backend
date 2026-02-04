// Capa de logica de negocios
// RESPONSABILIDAD: Limpiar y procesar la data entrante según la lógica requerida para los cupones y servicios.
import { insertCoupon, deleteCoupon } from "../repository/crud.js";
import { fetchCoupons } from "../repository/querys.js";
import { formatDateCL } from "../utils/dateFormatter.js";


// CREAR CUPONES
export async function createCoupon(id, data) {
    if (!id) throw new Error("ID requerido");
    if (typeof data.estado !== 'boolean') {
        throw new Error("El campo estado debe ser booleano");
    }
    if (data.descuento.valor <= 0) {
        throw new Error("Descuento inválido");
    }

    console.log("Cupon insertado con exito!");
    return insertCoupon(id, {
        ...data,
        fecha_creacion: new Date().getTime().toLocaleString(),
    });
}

export async function deleteCouponID(id) {
    if (!id) throw new Error("ID requerido para eliminar");
    return deleteCoupon(id);
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
