import { Router } from "express";
import {
    createCouponController,
    getCouponsController,
    deleteCouponController,
    getCouponDetailsController,
} from "../controller/coupons.controller.js";

const router = Router();

// Definición de rutas para la entidad 'cupones'

// GET / => Obtener cupones (acepta filtros por query params)
router.get("/", getCouponsController);

// GET /details/:id => Detalle popup "Ver detalles"
router.get("/details/:id", getCouponDetailsController);

// POST / => Crear un nuevo cupón
router.post("/", createCouponController);

// TODO: Eliminar operacion delete
// DELETE /:id => Eliminar un cupón por su ID
router.delete("/:id", deleteCouponController);

export default router;
