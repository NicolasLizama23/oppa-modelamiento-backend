// ui/assets/js/coupons.js
// Front real: consume endpoints del backend + muestra datos en la UI.

const $ = (sel) => document.querySelector(sel);

// Como la UI se sirve desde el mismo backend (http://localhost:3000/admin),
// usamos rutas relativas:
const API = ""; // "" => same-origin

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

function labelEstado(estado) {
  return estado ? "Activo" : "Inactivo";
}

// ---------- API ----------
async function apiGet(path) {
  const res = await fetch(`${API}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Error GET ${path}`);
  return data;
}

async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Error POST ${path}`);
  return data;
}

async function apiDelete(path) {
  const res = await fetch(`${API}${path}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Error DELETE ${path}`);
  return data;
}

// ---------- UI RENDER ----------
function renderTable(items) {
  const tbody = $("#tbodyCoupons");
  tbody.innerHTML = "";

  for (const c of items) {
    const row = document.createElement("tr");

    // tu endpoint GET /coupons ya trae fecha_inicio y fecha_termino formateadas (string)
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

          <button class="btn btn-outline-danger btn-sm"
                  data-action="delete"
                  data-id="${c.id}">
            Eliminar
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  }

  $("#kpiTotal").textContent = String(items.length);
  $("#listMsg").textContent = items.length ? "" : "Sin resultados para los filtros seleccionados.";
}

function openDetailsModal(details) {
  // Estos IDs existen en el modal del HTML:
  $("#dCodigo").textContent = details.codigo ?? "—";
  $("#dEstado").textContent = labelEstado(details.estado ?? false);
  $("#dDescuento").textContent = renderDiscount(details.descuento);
  $("#dUsos").textContent = String(details.usos?.total ?? 0);

  $("#dAplicacion").textContent = details.aplicacion ?? "—";

  // servicios en details viene como array [{id_servicio, nombre_servicio}]
  const serviciosTxt = Array.isArray(details.servicios) && details.servicios.length
    ? details.servicios.map(s => s.nombre_servicio).join(", ")
    : (details.aplicacion?.includes("Todos") ? "Todos los servicios" : "—");

  $("#dServicios").textContent = serviciosTxt;

  $("#dVigencia").textContent = `${details.fecha_inicio ?? "—"} al ${details.fecha_termino ?? "—"}`;

  const modalEl = document.getElementById("couponDetailModal");
  const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

// ---------- FLOW ----------
async function loadCoupons() {
  $("#listMsg").textContent = "Cargando...";
  try {
    const fEstado = $("#fEstado").value;
    const fTipo = $("#fTipo").value;
    const fAplicacion = $("#fAplicacion").value;

    // Backend soporta query params: estado, tipo, aplicacion
    // OJO: "aplicacion" en backend hoy está medio inconsistente (te lo dejo abajo como fix recomendado).
    const params = new URLSearchParams();
    if (fEstado !== "todos") params.set("estado", fEstado);
    if (fTipo !== "todos") params.set("tipo", fTipo);
    if (fAplicacion !== "todos") params.set("aplicacion", fAplicacion);

    const data = await apiGet(`/coupons${params.toString() ? `?${params}` : ""}`);
    renderTable(Array.isArray(data) ? data : []);
  } catch (e) {
    $("#listMsg").textContent = e.message;
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

    // Tu validator exige uso_permitido > 0 (aunque el UI dice 0=sin límite).
    // Solución rápida para que NO falle: si el usuario puso 0, enviamos 999999 (sin límite práctico).
    const uso_permitido = usoPermitidoRaw <= 0 ? 999999 : usoPermitidoRaw;

    const aplicaTodos = $("#aplicaTodos").checked;
    const fecha_inicio = $("#fechaInicio").value;    // datetime-local => string
    const fecha_termino = $("#fechaTermino").value;  // datetime-local => string

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

    await apiPost("/coupons", payload);

    $("#createMsg").textContent = "Cupón creado ✅";
    setTimeout(() => ($("#createMsg").textContent = ""), 1500);

    ev.target.reset();
    $("#suffixDescuento").textContent = "%";
    $("#estado").value = "true";
    $("#aplicaTodos").checked = true;

    await loadCoupons();
  } catch (e) {
    $("#createMsg").textContent = e.message;
    setTimeout(() => ($("#createMsg").textContent = ""), 2500);
  }
}

async function onTableClick(ev) {
  const btn = ev.target.closest("button[data-action]");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  try {
    if (action === "details") {
      const details = await apiGet(`/coupons/details/${id}`);
      openDetailsModal(details);
      return;
    }

    if (action === "delete") {
      await apiDelete(`/coupons/${id}`);
      await loadCoupons();
      return;
    }
  } catch (e) {
    alert(e.message);
  }
}

function bindEvents() {
  $("#btnGenerar").addEventListener("click", () => {
    $("#codigo").value = genCode(8);
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
