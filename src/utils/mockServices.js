// Simulación de datos de servicios
// TODO: Reemplazar con llamadas reales a la colección 'coleccion-servicio'

const SERVICES_MOCK = {
    "srv-001": "Acompañamiento Diario",
    "srv-002": "Enfermería a Domicilio",
    "srv-003": "Terapia Física y Rehabilitación",
    "srv-004": "Aseo y Confort",
    "srv-005": "Preparación de Comidas",
};

export function getServiceNameById(id) {
    return SERVICES_MOCK[id] || "Servicio Desconocido";
}
