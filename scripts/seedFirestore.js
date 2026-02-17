import { db } from "../src/config/firestore.js";
import { mockServices, mockUsages, mockCoupons, mockUsers } from "../src/utils/mock.js";

async function seedFirestore() {
    try {
        console.log("Iniciando carga de datos a Firestore...");
        // 1. Cargar Servicios
        console.log(`Cargando ${mockCoupons.length} servicios...`);
        const couponsBatch = db.batch();

        mockCoupons.forEach((coupon) => {
            const docRef = db.collection("coleccion-cupon").doc(coupon.id);
            // Eliminamos el ID del cuerpo del documento si ya es el ID del documento,
            // o lo dejamos si se prefiere duplicado. En este caso lo dejamos para coincidir con la estructura.
            couponsBatch.set(docRef, coupon);
        });

        await couponsBatch.commit();
        console.log("Servicios cargados exitosamente.");

        // 2. Cargar Servicios
        console.log(`Cargando ${mockServices.length} servicios...`);
        const servicesBatch = db.batch();

        mockServices.forEach((service) => {
            const docRef = db.collection("coleccion-servicio").doc(service.id);
            // Eliminamos el ID del cuerpo del documento si ya es el ID del documento,
            // o lo dejamos si se prefiere duplicado. En este caso lo dejamos para coincidir con la estructura.
            servicesBatch.set(docRef, service);
        });

        await servicesBatch.commit();
        console.log("Servicios cargados exitosamente.");

        // 3. Cargar Usos
        console.log(`Cargando ${mockUsages.length} registros de uso...`);
        const usagesBatch = db.batch();

        mockUsages.forEach((usage) => {
            // Firestore genera ID automático para estos si no tienen uno específico
            const docRef = db.collection("usos").doc();
            usagesBatch.set(docRef, usage);
        });

        await usagesBatch.commit();
        console.log("Usos cargados exitosamente.");

        // 4. Cargar Usuarios (mock para testing)
        console.log(`Cargando ${mockUsers.length} usuarios de prueba...`);
        const usersBatch = db.batch();

        mockUsers.forEach((user) => {
            const docRef = db.collection("usuarios").doc(user.id);
            usersBatch.set(docRef, user);
        });

        await usersBatch.commit();
        console.log("Usuarios cargados exitosamente.");

        // 5. Cargar registros de uso de cupones
        console.log(`Cargando ${mockUsages.length} registros de uso de cupones...`);
        const couponUsagesBatch = db.batch();

        mockUsages.forEach((usage) => {
            const docRef = db.collection("coupon_usages").doc();
            couponUsagesBatch.set(docRef, usage);
        });

        await couponUsagesBatch.commit();
        console.log("Registros de uso de cupones cargados exitosamente.");

        console.log("¡Migración completada!");
        process.exit(0);
    } catch (error) {
        console.error("Error al cargar datos:", error);
        process.exit(1);
    }
}

seedFirestore();
