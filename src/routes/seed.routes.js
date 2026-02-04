import express from "express";
import fs from "fs";
import { db, Timestamp, toTimestamp } from "../config/firestore.js";

const router = express.Router();

router.post("/load", async (req, res) => {
  try {
    const payload = req.body?.data
      ? req.body.data
      : JSON.parse(fs.readFileSync("data/seed.json", "utf8"));

    const batch = db.batch();
    const now = Timestamp.now();

    // CUPONES
    for (const c of payload.cupones ?? []) {
      const ref = db.collection("coleccion-cupones").doc(c.codigo);
      batch.set(ref, {
        codigo: c.codigo,
        estado: c.estado ?? true,
        fecha_creacion: now,
        fecha_inicio: toTimestamp(c.fecha_inicio),
        fecha_termino: toTimestamp(c.fecha_termino),
        descuento: {
          tipo: c.descuento.tipo,
          valor: c.descuento.valor,
        },
        // se guardan igual, aunque se omitan en el dashboard por ahora
        uso_permitido: c.uso_permitido ?? 0,
        uso_unico_por_usuario: c.uso_unico_por_usuario ?? false,
        aplicacion_todos: c.aplicacion_todos ?? true,
        aplicacion_algunos: {
          id_servicio: c.aplicacion_algunos?.id_servicio ?? [],
        },
      });
    }

    await batch.commit();

    // USOS (colección global)
    for (const u of payload.usos ?? []) {
      await db.collection("usos").add({
        codigo_cupon: u.codigo_cupon,
        id_usuario: u.id_usuario,
        id_servicio: u.id_servicio ?? null,
        id_venta: u.id_venta ?? null,
        fecha_uso: toTimestamp(u.fecha_uso),
      });
    }

    return res.json({ ok: true, message: "Seed cargado (cupones + usos)" });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;
