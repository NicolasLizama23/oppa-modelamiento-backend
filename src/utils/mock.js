export const mockServices = [
    {
        id: "srv_senior_001",
        nombre: "Acompañamiento Diario",
        descripcion:
            "Compañía y asistencia en actividades básicas del día a día por 4 horas.",
        precio_base: 25000,
    },
    {
        id: "srv_senior_002",
        nombre: "Enfermería a Domicilio",
        descripcion:
            "Visita de enfermera certificada para control de signos y medicamentos.",
        precio_base: 35000,
    },
    {
        id: "srv_senior_003",
        nombre: "Terapia Física y Rehabilitación",
        descripcion: "Sesión de kinesioterapia enfocada en movilidad reducida.",
        precio_base: 40000,
    },
    {
        id: "srv_senior_004",
        nombre: "Aseo y Confort",
        descripcion: "Ayuda con el baño, vestimenta y aseo personal.",
        precio_base: 30000,
    },
    {
        id: "srv_senior_005",
        nombre: "Preparación de Comidas",
        descripcion:
            "Preparación de dieta balanceada según necesidades médicas.",
        precio_base: 20000,
    },
];

export const mockUsages = [
    {
        codigo_cupon: "CUPON_PRUEBA2",
        id_usuario: "uid_45",
        id_servicio: "srv_senior_001",
        id_venta: "venta_001",
        fecha_uso: "2026-01-20T12:00:00.000Z",
    },
    {
        codigo_cupon: "CUPON_PRUEBA2",
        id_usuario: "uid_88",
        id_servicio: "srv_senior_003",
        id_venta: "venta_015",
        fecha_uso: "2026-01-22T09:30:00.000Z",
    },
    {
        codigo_cupon: "DESCUENTO_VERANO",
        id_usuario: "uid_12",
        id_servicio: "srv_senior_002",
        id_venta: "venta_055",
        fecha_uso: "2026-02-01T15:00:00.000Z",
    },
];

export function getServiceNameById(id) {
    const service = mockServices.find((s) => s.id === id);
    return service ? service.nombre : "Servicio Desconocido";
}

export function getMockUsagesByCoupon(couponCode) {
    // Retorna los usos que coincidan con el código (simulando query)
    // Nota: Si no hay código, retorna todo o vacío según lógica deseada.
    // Aquí filtramos por la propiedad 'codigo_cupon'
    return mockUsages.filter((u) => u.codigo_cupon === couponCode);
}
