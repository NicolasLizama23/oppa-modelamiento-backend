export const buildQuery = (query, filters, config) => {
    let newQuery = query;

    Object.keys(filters).forEach((key) => {
        // Si hay un filtro configurado para esta clave
        if (config[key] && filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
            newQuery = config[key](newQuery, filters[key]);
        }
    });

    return newQuery;
};
