// ui/assets/js/api.js
// Módulo de comunicación con el backend

const API = ""; // same-origin

/**
 * Realiza una petición GET
 * @param {string} path - Ruta del endpoint
 * @returns {Promise<any>} - Datos de respuesta
 */
export async function apiGet(path) {
    const res = await fetch(`${API}${path}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `Error GET ${path}`);
    return data;
}

/**
 * Realiza una petición POST
 * @param {string} path - Ruta del endpoint
 * @param {object} body - Cuerpo de la petición
 * @returns {Promise<any>} - Datos de respuesta
 */
export async function apiPost(path, body) {
    const res = await fetch(`${API}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `Error POST ${path}`);
    return data;
}

/**
 * Realiza una petición PATCH
 * @param {string} path - Ruta del endpoint
 * @param {object|null} body - Cuerpo de la petición (opcional)
 * @returns {Promise<any>} - Datos de respuesta
 */
export async function apiPatch(path, body = null) {
    const res = await fetch(`${API}${path}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `Error PATCH ${path}`);
    return data;
}

// TODO: Eliminar delete ya que no se usará en la lógica de negocio.
/**
 * Realiza una petición DELETE
 * @param {string} path - Ruta del endpoint
 * @returns {Promise<any>} - Datos de respuesta
 */
export async function apiDelete(path) {
    const res = await fetch(`${API}${path}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `Error DELETE ${path}`);
    return data;
}
