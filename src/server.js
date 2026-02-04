import express from "express";
import cors from "cors";
import couponsRouter from "./routes/coupons.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import seedRouter from "./routes/seed.routes.js";


const app = express();
const port = 3000;

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
