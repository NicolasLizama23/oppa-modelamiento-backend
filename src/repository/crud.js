// REPOSITORIO: Capa de acceso de datos
// RESPONSABILIDAD: En esta capa se aplica el crud hacia la BDD no relacional firestore.
import { db } from "../config/firestore.js";

///-----------///
///  CUPONES  ///
///-----------///
// Si la coleccion o el documento no existen se creará e insertará la data:
export async function insertCoupon(id, data) {
    try {
        await db.collection("coleccion-cupones").doc(id).set(data);
    } catch (error) {
        throw error;
    }
}

// utilizar { merge: true } si se quiere persistencia de la data previa. Sin esa flag eliminas lo que no actualizas:
// TODO: Funcion de actualizar pendiente...
export async function updateCoupon(id, data) {}

export async function deleteCoupon(id) {
    try {
        await db.collection("coleccion-cupones").doc(id).delete();
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
