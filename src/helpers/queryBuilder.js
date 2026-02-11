/**
 *
 * @param {Object} query - Recibe los documentos de la coleccion
 * @param {Object} filters - Objeto que trae los valores a filtrar
 * @param {Object} config - Objeto que entrega los filtros predefinidos
 * @returns
 */

export const buildQuery = (query, filters, config) => {
    let newQuery = query;

    Object.keys(filters).forEach((key) => {
        // Si hay un filtro configurado para esta clave
        if (
            config[key] &&
            filters[key] !== undefined &&
            filters[key] !== null &&
            filters[key] !== ""
        ) {
            newQuery = config[key](newQuery, filters[key]);
        }
    });

    return newQuery;
};
