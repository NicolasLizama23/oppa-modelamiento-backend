// Rutas para servicios
import express from "express";
import { getServicesController } from "../controller/services.controller.js";

const router = express.Router();

// GET /services - Obtiene todos los servicios disponibles
router.get("/", getServicesController);

export default router;
