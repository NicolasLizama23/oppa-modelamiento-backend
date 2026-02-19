// Capa de lógica de negocio para uso de cupones
// RESPONSABILIDAD: Validar y registrar el uso de cupones por usuarios
import { fetchCouponById } from "../repository/querys.js";
import { fetchCouponUsageByUserAndCoupon, createCouponUsage } from "../repository/querys.js";
import { validateCouponUsageData } from "../validators/couponUsage.validator.js";

/**
 * Valida si un usuario puede usar un cupón
 * @param {string} couponId - ID del cupón
 * @param {string} userId - ID del usuario
 * @returns {Promise<object>} - Resultado de la validación
 */
export async function validateCouponUsage(couponId, userId) {
    // 1. Verificar que el cupón existe
    const couponSnap = await fetchCouponById(couponId);
    
    if (!couponSnap.exists) {
        return {
            valid: false,
            reason: "El cupón no existe",
        };
    }

    const coupon = couponSnap.data();

    // 2. Verificar que el cupón esté activo
    if (!coupon.estado) {
        return {
            valid: false,
            reason: "El cupón está inactivo",
        };
    }

    // 3. Verificar fechas de vigencia
    const now = new Date();
    const fechaInicio = coupon.fecha_inicio?.toDate ? coupon.fecha_inicio.toDate() : new Date(coupon.fecha_inicio);
    const fechaTermino = coupon.fecha_termino?.toDate ? coupon.fecha_termino.toDate() : new Date(coupon.fecha_termino);

    if (now < fechaInicio) {
        return {
            valid: false,
            reason: "El cupón aún no está vigente",
        };
    }

    if (now > fechaTermino) {
        return {
            valid: false,
            reason: "El cupón ha expirado",
        };
    }

    // 4. Verificar uso único por usuario (si aplica)
    if (coupon.uso_unico_por_usuario) {
        const existingUsage = await fetchCouponUsageByUserAndCoupon(userId, couponId);
        
        if (existingUsage) {
            return {
                valid: false,
                reason: "Este cupón solo puede ser usado una vez por usuario y ya lo has utilizado",
            };
        }
    }

    // 5. Cupón válido
    return {
        valid: true,
        coupon: {
            id: couponId,
            descuento: coupon.descuento,
            aplicacion_todos: coupon.aplicacion_todos,
            aplicacion_algunos: coupon.aplicacion_algunos,
        },
    };
}

/**
 * Registra el uso de un cupón por un usuario
 * @param {object} usageData - Datos del uso
 * @returns {Promise<object>} - Registro creado
 */
export async function recordCouponUsage(usageData) {
    // Validar datos
    const validatedData = validateCouponUsageData(usageData);
    
    // Crear registro en Firestore
    return await createCouponUsage(validatedData);
}
