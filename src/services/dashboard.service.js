// Capa de logica de negocios para el dashboard del admin
// RESPONSABILIDAD: Limpiar y procesar la data entrante según la lógica requerida para el dashboard.
import { fetchCoupons, fetchServices } from "../repository/querys.js";

export async function getDashboardData() {
    // 1. Obtener todos los cupones
    const snapshot = await fetchCoupons({});

    // 2. Obtener servicios reales
    const servicesSnap = await fetchServices();
    const services = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3. Mapear y combinar
    return snapshot.docs.map((doc) => {
        const coupon = { id: doc.id, ...doc.data() };

        // Simulamos asignación aleatoria usando servicios reales si existen
        let randomService = { id: "N/A", nombre: "Sin servicio asignado" };
        if (services.length > 0) {
            randomService = services[Math.floor(Math.random() * services.length)];
        }

        return {
            codigo: coupon.id, // Usamos el ID del documento como código
            estado: coupon.estado ? "Activo" : "Inactivo", // Formateamos booleano a string
            descuentos: coupon.descuento || {}, // Objeto de descuento
            servicios: {
                id: randomService.id,
                nombre: randomService.nombre,
            },
            acciones: ["DESHABILITAR", "HABILITAR", "VER DETALLE"], // Listado de acciones disponibles
        };
    });
}
