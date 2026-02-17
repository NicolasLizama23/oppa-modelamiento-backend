// ------------------------------------------------------------
// servicesSelector.js
// ------------------------------------------------------------
// Este módulo SOLO maneja la UI del selector de servicios.
// Actualmente NO carga servicios desde backend.
// El equipo backend deberá implementar un endpoint que devuelva:
// GET /api/services  -> [{ id, nombre }]
// Luego aquí se deberá reemplazar el mock vacío por un fetch real.
// ------------------------------------------------------------

const state = {
  allServices: [],       // Actualmente vacío (mock temporal)
  selectedIds: new Set()
};

function $(id) {
  return document.getElementById(id);
}

function renderSelect(selectEl, items) {
  selectEl.innerHTML = "";
  for (const s of items) {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.nombre;
    selectEl.appendChild(opt);
  }
}

function render() {
  const disponibles = state.allServices.filter(s => !state.selectedIds.has(s.id));
  const seleccionados = state.allServices.filter(s => state.selectedIds.has(s.id));

  renderSelect($("serviciosDisponibles"), disponibles);
  renderSelect($("serviciosSeleccionados"), seleccionados);
}

function syncVisibility() {
  const aplicaTodos = $("aplicaTodos").checked;
  $("serviciosSection").style.display = aplicaTodos ? "none" : "block";

  if (aplicaTodos) {
    state.selectedIds.clear();
    render();
  }
}

function moveSelected(fromId, action) {
  const select = $(fromId);
  if (!select) return;

  const ids = Array.from(select.selectedOptions).map(o => o.value);
  ids.forEach(id => action(id));
  render();
}

// ------------------------------------------------------------
// 🔌 INTEGRACIÓN BACKEND COMPLETA
// ------------------------------------------------------------
// Carga servicios reales desde Firestore vía API REST
// ------------------------------------------------------------

export async function initServicesSelector(apiGet) {
  try {
    // Cargar servicios desde el backend
    state.allServices = await apiGet("/services");
    render();
  } catch (error) {
    console.error("Error cargando servicios:", error);
    // Si falla, mantener array vacío
    state.allServices = [];
    render();
  }

  $("aplicaTodos")?.addEventListener("change", syncVisibility);
  syncVisibility();

  $("btnAddServicio")?.addEventListener("click", () => {
    moveSelected("serviciosDisponibles", (id) => state.selectedIds.add(id));
  });

  $("btnRemoveServicio")?.addEventListener("click", () => {
    moveSelected("serviciosSeleccionados", (id) => state.selectedIds.delete(id));
  });
}

export function getSelectedServiceIds() {
  return Array.from(state.selectedIds);
}
