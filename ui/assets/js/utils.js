// ui/assets/js/utils.js
// Utilidades generales

/**
 * Selector de elementos del DOM
 * @param {string} sel - Selector CSS
 * @returns {Element} - Elemento del DOM
 */
export const $ = (sel) => document.querySelector(sel);

/**
 * Genera un código aleatorio
 * @param {number} len - Longitud del código
 * @returns {string} - Código generado
 */
export function genCode(len = 8) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < len; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

/**
 * Genera un código único verificando que no exista en la base de datos
 * @param {Function} apiGet - Función para hacer peticiones GET
 * @param {number} len - Longitud del código
 * @param {number} maxAttempts - Intentos máximos antes de fallar
 * @returns {Promise<string>} - Código único generado
 */
export async function genUniqueCode(apiGet, len = 8, maxAttempts = 10) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const code = genCode(len);
        
        try {
            // Intenta obtener el cupón con este ID
            await apiGet(`/coupons/details/${code}`);
            // Si llega aquí, el cupón existe, intentar de nuevo
            continue;
        } catch (error) {
            // Si da error 404 o similar, el código no existe (es único)
            return code;
        }
    }
    
    // Si después de maxAttempts no encontramos uno único, aumentar longitud
    return genCode(len + 2);
}

/**
 * Formatea el descuento para mostrar
 * @param {object} d - Objeto descuento {tipo, valor}
 * @returns {string} - Descuento formateado
 */
export function renderDiscount(d) {
    if (!d) return "—";
    return d.tipo === "PORCENTAJE" ? `${d.valor}%` : `$${d.valor}`;
}

/**
 * Genera badge HTML según el estado
 * @param {boolean} estado - Estado del cupón
 * @returns {string} - HTML del badge
 */
export function badgeEstado(estado) {
    return estado
        ? `<span class="badge bg-success">Activo</span>`
        : `<span class="badge bg-secondary">Inactivo</span>`;
}

/**
 * Retorna texto del estado
 * @param {boolean} estado - Estado del cupón
 * @returns {string} - Texto del estado
 */
export function labelEstado(estado) {
    return estado ? "Activo" : "Inactivo";
}
