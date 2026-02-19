export const mockCoupons = [
    {
        id: "BIENVENIDA20",
        estado: true,
        descuento: { tipo: "PORCENTAJE", valor: 20 },
        uso_permitido: 50,
        uso_unico_por_usuario: true, // Cada nuevo cliente puede usarlo solo una vez
        aplicacion_todos: true,
        aplicacion_algunos: [],
        fecha_inicio: "2026-01-01T00:00:00.000Z",
        fecha_termino: "2026-12-31T23:59:59.000Z",
    },
    {
        id: "TERAPIA15",
        estado: true,
        descuento: { tipo: "PORCENTAJE", valor: 15 },
        uso_permitido: 100,
        uso_unico_por_usuario: false, // Puede usarse múltiples veces por el mismo usuario
        aplicacion_todos: false,
        aplicacion_algunos: ["srv_senior_003"], // Solo para Terapia Física
        fecha_inicio: "2026-02-01T00:00:00.000Z",
        fecha_termino: "2026-03-31T23:59:59.000Z",
    },
    {
        id: "ENFERMERIA5000",
        estado: true,
        descuento: { tipo: "MONTO", valor: 5000 },
        uso_permitido: 30,
        uso_unico_por_usuario: true,
        aplicacion_todos: false,
        aplicacion_algunos: ["srv_senior_002"], // Solo para Enfermería a Domicilio
        fecha_inicio: "2026-01-15T00:00:00.000Z",
        fecha_termino: "2026-06-30T23:59:59.000Z",
    },
    {
        id: "VERANO2026",
        estado: true,
        descuento: { tipo: "PORCENTAJE", valor: 10 },
        uso_permitido: 200,
        uso_unico_por_usuario: false, // Promoción recurrente
        aplicacion_todos: true,
        aplicacion_algunos: [],
        fecha_inicio: "2026-01-01T00:00:00.000Z",
        fecha_termino: "2026-03-31T23:59:59.000Z",
    },
];

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
        codigo_cupon: "BIENVENIDA20",
        id_usuario: "uid_001",
        id_servicio: "srv_senior_001",
        id_venta: "venta_001",
        fecha_uso: "2026-01-20T12:00:00.000Z",
    },
    {
        codigo_cupon: "BIENVENIDA20",
        id_usuario: "uid_002",
        id_servicio: "srv_senior_002",
        id_venta: "venta_002",
        fecha_uso: "2026-01-22T09:30:00.000Z",
    },
    {
        codigo_cupon: "TERAPIA15",
        id_usuario: "uid_45",
        id_servicio: "srv_senior_003",
        id_venta: "venta_003",
        fecha_uso: "2026-02-05T15:00:00.000Z",
    },
    {
        codigo_cupon: "TERAPIA15",
        id_usuario: "uid_45", // Mismo usuario, segunda vez (permitido porque uso_unico_por_usuario: false)
        id_servicio: "srv_senior_003",
        id_venta: "venta_004",
        fecha_uso: "2026-02-12T15:00:00.000Z",
    },
    {
        codigo_cupon: "ENFERMERIA5000",
        id_usuario: "uid_88",
        id_servicio: "srv_senior_002",
        id_venta: "venta_005",
        fecha_uso: "2026-02-01T10:00:00.000Z",
    },
];

// Mock de usuarios para testing (hasta que se implemente autenticación real)
export const mockUsers = [
    {
        id: "uid_001",
        nombre: "Juan Pérez",
        email: "juan.perez@example.com",
    },
    {
        id: "uid_002",
        nombre: "María González",
        email: "maria.gonzalez@example.com",
    },
    {
        id: "uid_003",
        nombre: "Carlos Rodríguez",
        email: "carlos.rodriguez@example.com",
    },
    {
        id: "uid_45",
        nombre: "Ana Silva",
        email: "ana.silva@example.com",
    },
    {
        id: "uid_88",
        nombre: "Pedro Martínez",
        email: "pedro.martinez@example.com",
    },
    {
        id: "uid_12",
        nombre: "Laura Torres",
        email: "laura.torres@example.com",
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
