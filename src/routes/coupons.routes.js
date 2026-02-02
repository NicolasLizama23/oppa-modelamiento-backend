import express from "express";
import { db, toTimestamp, Timestamp } from "../firestore.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const c = req.body;
    if (!c?.codigo) return res.status(400).json({ ok:false, error:"codigo requerido" });

    await db.collection("cupones").doc(c.codigo).set({
      codigo: c.codigo,
      estado: c.estado ?? true,
      fecha_creacion: Timestamp.now(),
      fecha_inicio: toTimestamp(c.fecha_inicio),
      fecha_termino: toTimestamp(c.fecha_termino),

      descuento: {
        tipo: c.descuento?.tipo,
        valor: c.descuento?.valor
      },

      uso_permitido: c.uso_permitido ?? 0,
      uso_unico_por_usuario: c.uso_unico_por_usuario ?? false,

      aplicacion_todos: c.aplicacion_todos ?? true,
      aplicacion_algunos: {
        id_servicio: c.aplicacion_algunos?.id_servicio ?? []
      }
    }, { merge: true });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok:false, error:String(e) });
  }
});

export default router;

