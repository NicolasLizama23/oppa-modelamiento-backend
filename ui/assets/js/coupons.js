// ui/assets/js/coupons.js
// Punto de entrada principal - Orquesta la lógica del dashboard

import { apiGet, apiPost, apiPatch } from "./api.js";
import { $, genCode, genUniqueCode } from "./utils.js";
import {
    renderTable,
    openDetailsModal,
    showCreateMessage,
    showListMessage,
} from "./ui.js";

// ---------- FLOW ----------
async function loadCoupons() {
    showListMessage("Cargando...");
    try {
        const fEstado = $("#fEstado").value;
        const fTipo = $("#fTipo").value;
        const fAplicacion = $("#fAplicacion").value;

        // Backend soporta query params: estado, tipo, aplicacion
        const params = new URLSearchParams();
        if (fEstado !== "todos") params.set("estado", fEstado);
        if (fTipo !== "todos") params.set("tipo", fTipo);
        if (fAplicacion !== "todos") params.set("aplicacion", fAplicacion);

        // GET /coupons?estado=...&tipo=...&aplicacion=...
        const data = await apiGet(
            `/coupons${params.toString() ? `?${params}` : ""}`,
        );
        renderTable(Array.isArray(data) ? data : []);
    } catch (e) {
        showListMessage(e.message);
        renderTable([]);
    }
}

async function createCouponFromForm(ev) {
    ev.preventDefault();

    try {
        const codigo = $("#codigo").value.trim() || genCode(8);
        const estado = $("#estado").value === "true";
        const tipo = $("#tipoDescuento").value;
        const valor = Number($("#valorDescuento").value);
        const usoPermitidoRaw = Number($("#usoPermitido").value || 0);

        // si el usuario puso 0, se envia 999999 (sin límite práctico)
        const uso_permitido = usoPermitidoRaw <= 0 ? 999999 : usoPermitidoRaw;

        const aplicaTodos = $("#aplicaTodos").checked;
        const fecha_inicio = $("#fechaInicio").value; // datetime-local => string
        const fecha_termino = $("#fechaTermino").value; // datetime-local => string

        const payload = {
            id: codigo,
            estado,
            uso_unico_por_usuario: $("#usoUnico").checked,
            aplicacion_todos: aplicaTodos,
            aplicacion_algunos: [], // UI aún no permite seleccionar servicios específicos
            uso_permitido,
            fecha_inicio,
            fecha_termino,
            descuento: { tipo, valor },
        };

        // POST /coupons
        await apiPost("/coupons", payload);

        showCreateMessage("Cupón creado ✅", 1500);

        ev.target.reset();
        $("#suffixDescuento").textContent = "%";
        $("#estado").value = "true";
        $("#aplicaTodos").checked = true;

        await loadCoupons();
    } catch (e) {
        showCreateMessage(e.message, 2500);
    }
}

async function onTableClick(ev) {
    const btn = ev.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    try {
        if (action === "details") {
            // GET /coupons/details/:id
            const details = await apiGet(`/coupons/details/${id}`);
            openDetailsModal(details);
            return;
        }
        if (action === "toggle") {
            // PATCH /coupons/:id/toggle
            await apiPatch(`/coupons/${id}/toggle`);
            await loadCoupons();
            return;
        }
    } catch (e) {
        alert(e.message);
    }
}

function bindEvents() {
    $("#btnGenerar").addEventListener("click", async () => {
        try {
            // Generar código único verificando contra la BD
            const uniqueCode = await genUniqueCode(apiGet);
            $("#codigo").value = uniqueCode;
        } catch (error) {
            console.error("Error generando código único:", error);
            // Fallback a código aleatorio simple
            $("#codigo").value = genCode(8);
        }
    });

    $("#tipoDescuento").addEventListener("change", () => {
        $("#suffixDescuento").textContent =
            $("#tipoDescuento").value === "PORCENTAJE" ? "%" : "$";
    });

    $("#btnActualizar").addEventListener("click", loadCoupons);
    $("#fEstado").addEventListener("change", loadCoupons);
    $("#fTipo").addEventListener("change", loadCoupons);
    $("#fAplicacion").addEventListener("change", loadCoupons);

    $("#formCreateCoupon").addEventListener("submit", createCouponFromForm);

    $("#tbodyCoupons").addEventListener("click", onTableClick);
}

(async function init() {
    bindEvents();
    await loadCoupons();
})();
