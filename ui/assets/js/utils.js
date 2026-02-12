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
