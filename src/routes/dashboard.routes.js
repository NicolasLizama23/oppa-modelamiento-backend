import express from "express";
import { db } from "../firestore.js";

const router = express.Router();

function formatDiscount(desc) {
  if (!desc) return "";
  if (desc.tipo === "PORCENTAJE") return `${desc.valor}%`;
  if (desc.tipo === "MONTO") return `$${desc.valor}`;
  return "";
}

async function countUsesByCoupon(codigo) {
  const q = db.collection("usos").where("codigo_cupon", "==", codigo);
  const snap = await q.count().get();
  return snap.data().count ?? 0;
}

// GET /dashboard/coupons?estado=true&tipo=PORCENTAJE&aplicacion=ESPECIFICOS
router.get("/coupons", async (req, res) => {
  try {
    let q = db.collection("cupones").orderBy("fecha_creacion", "desc");

    const { estado, tipo, aplicacion } = req.query;

    if (estado !== undefined) q = q.where("estado", "==", estado === "true");
    if (tipo) q = q.where("descuento.tipo", "==", String(tipo));
    if (aplicacion) q = q.where("aplicacion_todos", "==", aplicacion === "TODOS");

    const snap = await q.get();
    const rows = [];

    for (const doc of snap.docs) {
      const c = doc.data();
      const usos = await countUsesByCoupon(c.codigo);

      const aplic = c.aplicacion_todos ? "TODOS" : "ESPECIFICOS";
      const servicios = c.aplicacion_todos
        ? ["Todos"]
        : (c.aplicacion_algunos?.id_servicio ?? []);

      rows.push({
        codigo: c.codigo,
        estado: c.estado ? "Activo" : "Inactivo",
        descuento: formatDiscount(c.descuento),
        vigencia: {
          inicio: c.fecha_inicio?.toDate()?.toISOString() ?? null,
          termino: c.fecha_termino?.toDate()?.toISOString() ?? null
        },
        usos,
        aplicacion: aplic,
        servicios  // IDs directamente
      });
    }

    res.json({ ok: true, data: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;

