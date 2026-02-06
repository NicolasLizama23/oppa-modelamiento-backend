// Capa de logica de negocios para el dashboard del admin
// RESPONSABILIDAD: Limpiar y procesar la data entrante según la lógica requerida para el dashboard.
import { fetchCoupons } from "../repository/querys.js";
import { mockServices } from "../utils/mockData.js";

// Obtiene la data formateada para el dashboard
export async function getDashboardData() {
    // 1. Obtener todos los cupones
    const snapshot = await fetchCoupons({});

    // 2. Mapear y combinar con servicios simulados
    return snapshot.docs.map((doc) => {
        const coupon = { id: doc.id, ...doc.data() };
        
        // Simulamos una asignación de servicio aleatoria o basada en un campo si existiera
        // Para este ejemplo, elegimos uno al azar de los mockServices
        const randomService =
            mockServices[Math.floor(Math.random() * mockServices.length)];

        return {
            codigo: coupon.id, // Usamos el ID del documento como código
            estado: coupon.estado ? "Activo" : "Inactivo", // Formateamos booleano a string
            descuentos: coupon.descuento || {}, // Objeto de descuento
            servicios: {
                id: randomService.id,
                nombre: randomService.nombre,
            },
            acciones: ["DESHABILITAR", "VER DETALLE"], // Listado de acciones disponibles
        };
    });
}
