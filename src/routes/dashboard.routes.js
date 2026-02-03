import { Router } from "express";
import { getDashboardController } from "../controller/dashboard.controller.js";

const router = Router();
// GET /dashboard => Obtener data para el dashboard
router.get("/", getDashboardController);

export default router;
