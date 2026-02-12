// REPOSITORIO: Capa de acceso de datos
// RESPONSABILIDAD: En esta capa se aplica el crud hacia la BDD no relacional firestore.
import { db } from "../config/firestore.js";

///-----------///
///  CUPONES  ///
///-----------///
// Si la coleccion o el documento no existen se creará e insertará la data:
export async function insertCoupon(id, data) {
    try {
        await db.collection("coleccion-cupon").doc(id).set(data);
    } catch (error) {
        throw error;
    }
}

/**
 * Actualiza parcialmente un cupón existente en Firestore.
 * Solo modifica los campos enviados en "data".
 * No elimina información previa.
 */
export async function updateCoupon(id, data) {
    const ref = db.collection("coleccion-cupon").doc(id);
    await ref.update(data);
}

// TODO: Eliminar funcion delete
export async function deleteCoupon(id) {
    try {
        await db.collection("coleccion-cupon").doc(id).delete();
    } catch (error) {
        throw error;
    }
}
///-----------///
/// SERVICIOS ///
///---------- ///
export async function insertServicio(id, data) {
    try {
        await db.collection("coleccion-servicio").doc(id).set(data);
    } catch (error) {
        throw error;
    }
}
