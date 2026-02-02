import express from "express";
import cors from "cors";

import seedRoutes from "./routes/seed.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import couponsRoutes from "./routes/coupons.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/seed", seedRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/coupons", couponsRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`API running on http://127.0.0.1:${PORT}`));
