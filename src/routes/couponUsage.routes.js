// Rutas para validación y uso de cupones
import express from "express";
import { validateCouponUsageController, recordCouponUsageController } from "../controller/couponUsage.controller.js";

const router = express.Router();

// POST /coupons/:id/validate - Valida si un usuario puede usar el cupón
router.post("/:id/validate", validateCouponUsageController);

// POST /coupons/:id/use - Registra el uso del cupón por un usuario
router.post("/:id/use", recordCouponUsageController);

export default router;
