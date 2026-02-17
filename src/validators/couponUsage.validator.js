// Validador para datos de uso de cupones
// RESPONSABILIDAD: Validar estructura de datos de uso de cupones

/**
 * Valida los datos de uso de un cupón
 * @param {object} data - Datos del uso del cupón
 * @returns {object} - Datos validados
 */
export function validateCouponUsageData(data) {
    // 1. Validar id_usuario
    if (!data.id_usuario || typeof data.id_usuario !== "string" || data.id_usuario.trim() === "") {
        throw new Error("El campo 'id_usuario' es requerido y debe ser un string no vacío");
    }

    // 2. Validar codigo_cupon
    if (!data.codigo_cupon || typeof data.codigo_cupon !== "string" || data.codigo_cupon.trim() === "") {
        throw new Error("El campo 'codigo_cupon' es requerido y debe ser un string no vacío");
    }

    // 3. Validar id_servicio (opcional, puede ser null si el cupón aplica a todos)
    if (data.id_servicio && typeof data.id_servicio !== "string") {
        throw new Error("El campo 'id_servicio' debe ser un string");
    }

    // 4. Validar id_venta (opcional, puede registrarse después)
    if (data.id_venta && typeof data.id_venta !== "string") {
        throw new Error("El campo 'id_venta' debe ser un string");
    }

    return {
        id_usuario: data.id_usuario.trim(),
        codigo_cupon: data.codigo_cupon.trim(),
        id_servicio: data.id_servicio?.trim() || null,
        id_venta: data.id_venta?.trim() || null,
        fecha_uso: data.fecha_uso || new Date().toISOString(),
    };
}
