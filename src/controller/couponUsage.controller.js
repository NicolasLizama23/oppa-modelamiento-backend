// Controlador para validación y registro de uso de cupones
// RESPONSABILIDAD: Manejar peticiones HTTP relacionadas con el uso de cupones
import { validateCouponUsage, recordCouponUsage } from "../services/couponUsage.service.js";

/**
 * POST /coupons/:id/validate
 * Valida si un usuario puede usar un cupón
 */
export async function validateCouponUsageController(req, res) {
    try {
        const { id } = req.params;
        const { id_usuario } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ error: "El campo 'id_usuario' es requerido" });
        }

        const result = await validateCouponUsage(id, id_usuario);

        if (!result.valid) {
            return res.status(400).json({ 
                valid: false, 
                error: result.reason 
            });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * POST /coupons/:id/use
 * Registra el uso de un cupón por un usuario
 */
export async function recordCouponUsageController(req, res) {
    try {
        const { id } = req.params;
        const { id_usuario, id_servicio, id_venta } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ error: "El campo 'id_usuario' es requerido" });
        }

        // Primero validar que puede usarlo
        const validation = await validateCouponUsage(id, id_usuario);
        
        if (!validation.valid) {
            return res.status(400).json({ 
                error: validation.reason 
            });
        }

        // Registrar el uso
        const usage = await recordCouponUsage({
            codigo_cupon: id,
            id_usuario,
            id_servicio: id_servicio || null,
            id_venta: id_venta || null,
        });

        res.status(201).json({
            message: "Uso de cupón registrado exitosamente",
            usage,
            descuento_aplicado: validation.coupon.descuento,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
