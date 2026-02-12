// ui/assets/js/ui.js
// Módulo de renderizado y manipulación de UI

import { $, renderDiscount, badgeEstado, labelEstado } from "./utils.js";

/**
 * Renderiza la tabla de cupones
 * @param {Array} items - Lista de cupones
 */
export function renderTable(items) {
    const tbody = $("#tbodyCoupons");
    tbody.innerHTML = "";

    for (const c of items) {
        const row = document.createElement("tr");

        // botón dinámico según estado
        const toggleLabel = c.estado ? "Deshabilitar" : "Habilitar";
        const toggleClass = c.estado
            ? "btn-outline-warning"
            : "btn-outline-success";

        row.innerHTML = `
      <td><strong>${c.codigo ?? c.id}</strong></td>
      <td>${badgeEstado(c.estado)}</td>
      <td>${renderDiscount(c.descuento)}</td>
      <td>${c.fecha_inicio ?? "—"}<br><small class="text-muted">al ${c.fecha_termino ?? "—"}</small></td>
      <td class="text-end">
        <div class="d-inline-flex gap-2">
          <button class="btn btn-outline-primary btn-sm"
                  data-action="details"
                  data-id="${c.id}">
            Ver detalles
          </button>

          <button class="btn ${toggleClass} btn-sm"
                  data-action="toggle"
                  data-id="${c.id}">
            ${toggleLabel}
          </button>
        </div>
      </td>
    `;

        tbody.appendChild(row);
    }

    $("#kpiTotal").textContent = String(items.length);
    $("#listMsg").textContent = items.length
        ? ""
        : "Sin resultados para los filtros seleccionados.";
}

/**
 * Abre el modal de detalles con la información del cupón
 * @param {object} details - Detalles del cupón
 */
export function openDetailsModal(details) {
    $("#dCodigo").textContent = details.codigo ?? "—";
    $("#dEstado").textContent = labelEstado(details.estado ?? false);
    $("#dDescuento").textContent = renderDiscount(details.descuento);
    
    const permitidos = details.uso_permitido ?? 0;
    const usados = details.usos?.total ?? 0;
    $("#dUsos").textContent = `${usados} / ${permitidos}`;

    $("#dAplicacion").textContent = details.aplicacion ?? "—";

    // servicios en details viene como array [{id_servicio, nombre_servicio}]
    const serviciosTxt =
        Array.isArray(details.servicios) && details.servicios.length
            ? details.servicios.map((s) => s.nombre_servicio).join(", ")
            : details.aplicacion?.includes("Todos")
              ? "Todos los servicios"
              : "—";

    $("#dServicios").textContent = serviciosTxt;
    $("#dVigencia").textContent = `${details.fecha_inicio ?? "—"} al ${details.fecha_termino ?? "—"}`;

    const modalEl = document.getElementById("couponDetailModal");
    const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

/**
 * Muestra un mensaje en el área de creación
 * @param {string} msg - Mensaje a mostrar
 * @param {number} duration - Duración en ms
 */
export function showCreateMessage(msg, duration = 2500) {
    $("#createMsg").textContent = msg;
    setTimeout(() => ($("#createMsg").textContent = ""), duration);
}

/**
 * Muestra un mensaje en el área de listado
 * @param {string} msg - Mensaje a mostrar
 */
export function showListMessage(msg) {
    $("#listMsg").textContent = msg;
}
