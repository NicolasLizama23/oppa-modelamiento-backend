import express from "express";
import cors from "cors";
import couponsRouter from "./routes/coupons.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import seedRouter from "./routes/seed.routes.js";
// librerías Node para resolver rutas en ES Modules
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// __dirname compatible con ES Modules
// (porque en "type": "module" no existe __dirname nativo)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// servir UI (HTML/CSS/JS) como estáticos bajo /admin
// Esto permite pedir: /admin/assets/css/admin.css, /admin/assets/js/coupons.js, etc.
app.use("/admin", express.static(path.join(__dirname, "../ui")));

// endpoint que entrega la pantalla de gestión de cupones
// URL final: http://localhost:3000/admin/coupons
app.get("/admin/coupons", (req, res) => {
  res.sendFile(path.join(__dirname, "../ui/pages/coupons.html"));
});

app.use(cors());
// Middleware para parsear JSON
app.use(express.json());

// Log de peticiones para debugear
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Rutas
app.use("/coupons", couponsRouter);
app.use("/dashboard", dashboardRouter);
//Se agrego la ruta seed para cargar datos iniciales
app.use("/seed", seedRouter);


// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(port, () => {
    console.log(`🚀 Server corriendo en http://localhost:${port}`);
});
