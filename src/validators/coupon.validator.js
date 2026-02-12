/**
 * Valida los datos del cupón según las reglas de negocio
 * @param {string} id - Código del cupón
 * @param {object} data - Datos del cupón
 * @returns {object} - Datos normalizados si son válidos
 */
function validateDate(dateString, fieldName) {
    if (!dateString) {
        throw new Error(`El campo '${fieldName}' es requerido`);
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error(`El campo '${fieldName}' debe ser una fecha válida`);
    }
    return date;
}

export function validateCouponData(id, data) {
    // 1. Validar ID
    if (!id || typeof id !== "string" || id.trim() === "") {
        throw new Error("El ID es requerido y debe ser un string no vacío");
    }

    // 2. Validar campos booleanos obligatorios
    const booleanFields = [
        "estado",
        "uso_unico_por_usuario",
        "aplicacion_todos",
    ];
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
        throw new Error(
            `Tipo de descuento inválido. Permitidos: ${tiposPermitidos.join(", ")}`,
        );
    }

    if (typeof valor !== "number" || valor <= 0) {
        throw new Error(
            "El 'valor' del descuento debe ser numérico y mayor a 0",
        );
    }

    // Regla de negocio: Porcentaje no mayor a 100
    if (tipoNormalizado === "PORCENTAJE" && valor > 100) {
        throw new Error("El porcentaje de descuento no puede ser mayor a 100");
    }
    // Regla de negocio: Monto no menor ni igual a 0
    if (tipoNormalizado === "MONTO" && valor <= 0) {
        throw new Error(
            "El monto de descuento no puede ser menor o igual a $0",
        );
    }

    // 4. Validar usos permitidos
    if (typeof data.uso_permitido !== "number" || data.uso_permitido <= 0) {
        throw new Error(
            "El campo 'uso_permitido' debe ser numérico y mayor a 0",
        );
    }

    // 5. Validar aplicación de servicios (si no aplica a todos)
    if (data.aplicacion_todos === false) {
        if (!Array.isArray(data.aplicacion_algunos)) {
            throw new Error(
                "Debe especificar 'aplicacion_algunos' como un array de IDs cuando aplicacion_todos es false",
            );
        }

        if (data.aplicacion_algunos.length === 0) {
            throw new Error(
                "Debe seleccionar al menos un servicio si el cupón no aplica a todos",
            );
        }

        // Validar que todos los elementos del array sean strings
        const todosStrings = data.aplicacion_algunos.every(
            (id) => typeof id === "string" && id.trim() !== "",
        );
        if (!todosStrings) {
            throw new Error(
                "Todos los IDs de servicios en 'aplicacion_algunos' deben ser strings válidos",
            );
        }
    } else if (data.aplicacion_todos === true) {
        data.aplicacion_algunos = [];
    }

    // 6. Validar Fechas
    const fechaInicio = validateDate(data.fecha_inicio, "fecha_inicio");
    const fechaTermino = validateDate(data.fecha_termino, "fecha_termino");

    if (fechaInicio >= fechaTermino) {
        throw new Error(
            "La fecha de inicio debe ser anterior a la fecha de término",
        );
    }

    // Retornar objeto limpio y normalizado
    return {
        ...data,
        descuento: {
            tipo: tipoNormalizado,
            valor,
        },
        fecha_inicio: fechaInicio.toISOString(),
        fecha_termino: fechaTermino.toISOString(),
    };
}

/**
 * Valida un ID de cupón
 * @param {string} id - ID a validar
 * @returns {string} - ID validado
 */
export function validateCouponId(id) {
    if (!id || typeof id !== "string" || id.trim() === "") {
        throw new Error(
            "El ID del cupón es requerido y debe ser un string válido",
        );
    }
    return id.trim();
}

/**
 * Valida y limpia los filtros para la búsqueda de cupones
 * @param {object} filters - Filtros sin procesar
 * @returns {object} - Filtros limpios y seguros
 */
export function validateCouponFilters(filters = {}) {
    const cleanFilters = {};

    // 1. Validar Estado ('true', 'false', 'todos')
    if (filters.estado !== undefined && filters.estado !== null) {
        const val = filters.estado.toString().trim().toLowerCase();
        if (["true", "false"].includes(val)) {
            cleanFilters.estado = val;
        } else {
            throw new Error("El filtro 'estado' debe ser 'true' o 'false'");
        }
    }

    // 2. Validar Tipo ('PORCENTAJE', 'MONTO', 'todos')
    if (filters.tipo) {
        const val = filters.tipo.toString().trim().toUpperCase();
        const validTypes = ["PORCENTAJE", "MONTO", "TODOS"];
        if (validTypes.includes(val)) {
            cleanFilters.tipo = val === "TODOS" ? "todos" : val;
        } else {
            throw new Error(
                "El filtro 'tipo' debe ser 'PORCENTAJE', 'MONTO' o 'todos'",
            );
        }
    }

    // 3. Validar Aplicación ('global', 'algunos', 'todos')
    if (filters.aplicacion) {
        const val = filters.aplicacion.toString().trim().toLowerCase();
        if (["global", "algunos", "todos"].includes(val)) {
            cleanFilters.aplicacion = val;
        } else {
            throw new Error(
                "El filtro 'aplicacion' debe ser 'global', 'algunos' o 'todos'",
            );
        }
    }

    return cleanFilters;
}
