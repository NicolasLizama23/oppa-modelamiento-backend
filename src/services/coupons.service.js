// Capa de logica de negocios
// RESPONSABILIDAD: Limpiar y procesar la data entrante según la lógica requerida para los cupones y servicios.
import { insertCoupon, deleteCoupon } from "../repository/crud.js";
import { fetchCoupons } from "../repository/querys.js";

// CREAR CUPONES
export async function createCoupon(id, data) {
    if (!id) throw new Error("ID requerido");
    if (data.estado !== (true || false)) {
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
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
