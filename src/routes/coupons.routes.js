import { Router } from "express";
import {
    createCouponController,
    getCouponsController,
    deleteCouponController,
} from "../controller/coupons.controller.js";

const router = Router();

// Definición de rutas para la entidad 'cupones'

// GET / => Obtener cupones (acepta filtros por query params)
router.get("/", getCouponsController);

// POST / => Crear un nuevo cupón
router.post("/", createCouponController);

// DELETE /:id => Eliminar un cupón por su ID
router.delete("/:id", deleteCouponController);

export default router;
