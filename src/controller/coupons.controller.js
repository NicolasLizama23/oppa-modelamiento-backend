import {
    createCoupon,
    getCoupons,
    deleteCouponID,
} from "../services/coupons.service.js";

// POST /coupons
export async function createCouponController(req, res) {
    try {
        const data = req.body;
        console.log(data);

        const { id, ...couponData } = data;

        if (!id) {
            return res.status(400).json({ error: "ID es obligatorio" });
        }

        await createCoupon(id, couponData);

        res.status(201).json({ ok: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// GET /coupons
export async function getCouponsController(req, res) {
    try {
        const coupons = await getCoupons(req.query);

        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// DELETE /coupons/:id
export async function deleteCouponController(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID requerido" });
        }

        await deleteCouponID(id);

        res.status(200).json({
            ok: true,
            message: `Cupón ${id} eliminado con éxito`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
