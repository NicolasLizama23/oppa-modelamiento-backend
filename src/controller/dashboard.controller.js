import { getDashboardData } from "../services/dashboard.service.js";

// GET /dashboard
export async function getDashboardController(req, res) {
    try {
        const dashboardData = await getDashboardData();
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
