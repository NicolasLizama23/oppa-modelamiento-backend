// ui/assets/js/couponsMock.js
// SOLO FRONT
// Simula: crear cupón, filtrar, renderizar tabla y abrir "Ver detalles" (modal Bootstrap).

const $ = (sel) => document.querySelector(sel);

// -------------------------
// 1) Estado mock (datos falsos)
// -------------------------
const state = {
  coupons: [
    {
      id: "Z2NM9KUK",
      codigo: "Z2NM9KUK",
      estado: true,
      descuento: { tipo: "PORCENTAJE", valor: 10 },
      vigencia: { inicio: "22/01/2026", termino: "22/02/2026" },
      usos: 5,
      aplicacion: "TODOS",
      servicios: "Todos los servicios",
    },
    {
      id: "K3P9L2AA",
      codigo: "K3P9L2AA",
      estado: false,
      descuento: { tipo: "MONTO", valor: 2500 },
      vigencia: { inicio: "01/02/2026", termino: "10/02/2026" },
      usos: 1,
      aplicacion: "ESPECIFICOS",
      servicios: "Kinesiología, Acompañamiento",
    },
  ],
};

// -------------------------
// 2) Helpers (funciones chicas reutilizables)
// -------------------------
function genCode(len = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function renderDiscount(d) {
  if (!d) return "—";
  return d.tipo === "PORCENTAJE" ? `${d.valor}%` : `$${d.valor}`;
}

function badgeEstado(estado) {
  return estado
    ? `<span class="badge bg-success">Activo</span>`
    : `<span class="badge bg-secondary">Inactivo</span>`;
}

// Labels para el modal (texto simple)
function labelEstado(estado) {
  return estado ? "Activo" : "Inactivo";
}

function labelAplicacion(ap) {
  return ap === "TODOS" ? "Para todos los servicios" : "Servicios específicos";
}

// -------------------------
// 3) Modal (popup) - "Ver detalles"
//    Requiere que en el HTML exista el modal con id="couponDetailModal"
// -------------------------
function openDetailsModal(coupon) {
  // Estos IDs deben existir dentro del modal en el HTML:
  // dCodigo, dEstado, dDescuento, dUsos, dAplicacion, dServicios, dVigencia
  $("#dCodigo").textContent = coupon.codigo;
  $("#dEstado").textContent = labelEstado(coupon.estado);
  $("#dDescuento").textContent = renderDiscount(coupon.descuento);
  $("#dUsos").textContent = String(coupon.usos ?? 0);
  $("#dAplicacion").textContent = labelAplicacion(coupon.aplicacion);
  $("#dServicios").textContent = coupon.servicios || "—";
  $("#dVigencia").textContent = `${coupon.vigencia.inicio} al ${coupon.vigencia.termino}`;

  // Bootstrap modal show
  const modalEl = document.getElementById("couponDetailModal");
  const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

// -------------------------
// 4) Filtros (UI de filtros arriba de la tabla)
// -------------------------
function applyFilters(items) {
  const fEstado = $("#fEstado").value;
  const fTipo = $("#fTipo").value;
  const fAplicacion = $("#fAplicacion").value;

  return items.filter((c) => {
    const okEstado = fEstado === "todos" ? true : String(c.estado) === fEstado;
    const okTipo = fTipo === "todos" ? true : c.descuento?.tipo === fTipo;
    const okAplicacion = fAplicacion === "todos" ? true : c.aplicacion === fAplicacion;

    return okEstado && okTipo && okAplicacion;
  });
}

// -------------------------
// 5) Render de tabla (sin Usos/Aplicación/Servicios)
//    Acciones: Ver detalles + Habilitar/Deshabilitar
// -------------------------
function renderTable(items) {
  const tbody = $("#tbodyCoupons");
  tbody.innerHTML = "";

  for (const c of items) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><strong>${c.codigo}</strong></td>
      <td>${badgeEstado(c.estado)}</td>
      <td>${renderDiscount(c.descuento)}</td>
      <td>${c.vigencia.inicio}<br><small class="text-muted">al ${c.vigencia.termino}</small></td>

      <td class="text-end">
        <div class="d-inline-flex gap-2">
          <button class="btn btn-outline-primary btn-sm"
                  data-action="details"
                  data-id="${c.id}">
            Ver detalles
          </button>

          ${
            c.estado
              ? `<button class="btn btn-warning btn-sm" data-action="toggle" data-id="${c.id}">Deshabilitar</button>`
              : `<button class="btn btn-success btn-sm" data-action="toggle" data-id="${c.id}">Habilitar</button>`
          }
        </div>
      </td>
    `;

    tbody.appendChild(row);
  }

  $("#kpiTotal").textContent = String(items.length);
  $("#listMsg").textContent = items.length ? "" : "Sin resultados para los filtros seleccionados.";
}

function refresh() {
  const filtered = applyFilters(state.coupons);
  renderTable(filtered);
}

// -------------------------
// 6) Eventos (inputs, form y acciones de tabla)
// -------------------------
function bindEvents() {
  // Botón generar código
  $("#btnGenerar").addEventListener("click", () => {
    $("#codigo").value = genCode(8);
  });

  // Cambiar sufijo % o $
  $("#tipoDescuento").addEventListener("change", () => {
    $("#suffixDescuento").textContent =
      $("#tipoDescuento").value === "PORCENTAJE" ? "%" : "$";
  });

  // Filtros
  $("#btnActualizar").addEventListener("click", refresh);
  $("#fEstado").addEventListener("change", refresh);
  $("#fTipo").addEventListener("change", refresh);
  $("#fAplicacion").addEventListener("change", refresh);

  // Crear cupón (mock)
  $("#formCreateCoupon").addEventListener("submit", (ev) => {
    ev.preventDefault();

    const codigo = $("#codigo").value.trim() || genCode(8);
    const estado = $("#estado").value === "true";
    const tipo = $("#tipoDescuento").value;
    const valor = Number($("#valorDescuento").value);
    const usoPermitido = Number($("#usoPermitido").value || 0);

    // Formato simple para fechas en modo mock
    const ini = $("#fechaInicio").value ? new Date($("#fechaInicio").value) : new Date();
    const ter = $("#fechaTermino").value ? new Date($("#fechaTermino").value) : new Date();

    const fmt = (d) =>
      new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);

    state.coupons.unshift({
      id: codigo,
      codigo,
      estado,
      descuento: { tipo, valor },
      vigencia: { inicio: fmt(ini), termino: fmt(ter) },
      usos: 0,
      aplicacion: $("#aplicaTodos").checked ? "TODOS" : "ESPECIFICOS",
      servicios: $("#aplicaTodos").checked ? "Todos los servicios" : "—",
      usoPermitido,
    });

    $("#createMsg").textContent = "Cupón creado (mock) ✅";
    setTimeout(() => ($("#createMsg").textContent = ""), 1500);

    ev.target.reset();
    $("#suffixDescuento").textContent = "%";
    $("#estado").value = "true";
    $("#aplicaTodos").checked = true;

    refresh();
  });

  // Acciones tabla (mock)
  $("#tbodyCoupons").addEventListener("click", (ev) => {
    const btn = ev.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    const idx = state.coupons.findIndex((c) => c.id === id);
    if (idx === -1) return;

    // Toggle habilitar/deshabilitar
    if (action === "toggle") {
      state.coupons[idx].estado = !state.coupons[idx].estado;
      refresh();
      return;
    }

    // Ver detalles (abre modal)
    if (action === "details") {
      openDetailsModal(state.coupons[idx]);
      return;
    }
  });
}

// -------------------------
// 7) Init
// -------------------------
(function init() {
  bindEvents();
  refresh();
})();
