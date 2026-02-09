/**
 * Valida los datos del cupón según las reglas de negocio
 * @param {string} id - Código del cupón
 * @param {object} data - Datos del cupón
 * @returns {object} - Datos normalizados si son válidos
 */
export function validateCouponData(id, data) {
    // 1. Validar ID
    if (!id || typeof id !== "string" || id.trim() === "") {
        throw new Error("El ID es requerido y debe ser un string no vacío");
    }

    // 2. Validar campos booleanos obligatorios
    const booleanFields = ["estado", "uso_unico_por_usuario", "aplicacion_todos"];
    booleanFields.forEach((field) => {
        if (typeof data[field] !== "boolean") {
            throw new Error(`El campo '${field}' debe ser booleano`);
        }
    });

    // 3. Validar descuento
    if (!data.descuento) {
        throw new Error("El campo 'descuento' es requerido");
    }
    const { tipo, valor } = data.descuento;

    if (typeof tipo !== "string" || tipo.trim() === "") {
        throw new Error("El 'tipo' de descuento debe ser un string no vacío");
    }
    
    // Normalización del tipo de descuento
    const tipoNormalizado = tipo.trim().toUpperCase();
    const tiposPermitidos = ["PORCENTAJE", "MONTO"];

    if (!tiposPermitidos.includes(tipoNormalizado)) {
        throw new Error(`Tipo de descuento inválido. Permitidos: ${tiposPermitidos.join(", ")}`);
    }

    if (typeof valor !== "number" || valor <= 0) {
        throw new Error("El 'valor' del descuento debe ser numérico y mayor a 0");
    }

    // Regla de negocio: Porcentaje no mayor a 100
    if (tipoNormalizado === "PORCENTAJE" && valor > 100) {
        throw new Error("El porcentaje de descuento no puede ser mayor a 100");
    }

    // 4. Validar usos permitidos
    if (typeof data.uso_permitido !== "number" || data.uso_permitido <= 0) {
        throw new Error("El campo 'uso_permitido' debe ser numérico y mayor a 0");
    }

    // 5. Validar aplicación de servicios (si no aplica a todos)
    if (data.aplicacion_todos === false) {
        if (!data.aplicacion_servicios || typeof data.aplicacion_servicios !== "object") {
            throw new Error("Debe especificar 'aplicacion_servicios' cuando aplicacion_todos es false");
        }

        const serviciosSeleccionados = Object.values(data.aplicacion_servicios).some((v) => v === true);
        if (!serviciosSeleccionados) {
            throw new Error("Debe seleccionar al menos un servicio si el cupón no aplica a todos");
        }
    }

    // Retornar objeto limpio y normalizado
    return {
        ...data,
        descuento: {
            tipo: tipoNormalizado,
            valor,
        },
    };
}

/**
 * Valida un ID de cupón
 * @param {string} id - ID a validar
 * @returns {string} - ID validado
 */
export function validateCouponId(id) {
    if (!id || typeof id !== "string" || id.trim() === "") {
        throw new Error("El ID del cupón es requerido y debe ser un string válido");
    }
    return id.trim();
}

/**
 * Valida y limpia los filtros para la búsqueda de cupones
 * @param {object} filters - Filtros sin procesar
 * @returns {object} - Filtros limpios y seguros
 */
export function validateCouponFilters(filters = {}) {
    const allowedFilters = ["estado", "tipo", "aplicacion"];
    const cleanFilters = {};

    Object.keys(filters).forEach((key) => {
        if (allowedFilters.includes(key)) {
            const value = filters[key];
            if (typeof value === "string" && value.trim() !== "") {
                cleanFilters[key] = value.trim();
            }
        }
    });

    return cleanFilters;
}
