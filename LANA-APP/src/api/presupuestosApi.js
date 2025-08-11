// 📂 src/api/presupuestosApi.js
const API_URL = "https://api-lana-production.up.railway.app";

// Lista todos (si prefieres agregar endpoint /presupuestos/usuario/{id}, luego cambiamos aquí)
export const obtenerPresupuestos = async () => {
  const r = await fetch(`${API_URL}/presupuestos`);
  if (!r.ok) throw await r.json();
  return r.json();
};

export const crearPresupuesto = async (payload) => {
  const r = await fetch(`${API_URL}/presupuestos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw await r.json();
  return r.json();
};

export const actualizarPresupuesto = async (id, payload) => {
  const r = await fetch(`${API_URL}/presupuestos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw await r.json();
  return r.json();
};

export const verificarExcesoPresupuesto = async (usuarioId) => {
  const r = await fetch(`${API_URL}/presupuesto-alerta/${usuarioId}`);
  if (!r.ok) throw await r.json();
  return r.json();
};

/**
 * UPSERT de presupuesto mensual por (usuario, categoría, mes, año)
 * - Si existe → PUT
 * - Si no → POST
 */
export const upsertPresupuestoMensual = async ({
  usuario_id,
  categoria_id,
  monto,         // límite mensual que quieres establecer
  mes,
  anio,
}) => {
  // 1) Trae todos y busca si existe uno para este usuario/categoría/mes/año
  const todos = await obtenerPresupuestos();
  const existente = todos.find(
    p =>
      Number(p.usuario_id) === Number(usuario_id) &&
      Number(p.categoria_id) === Number(categoria_id) &&
      Number(p.mes) === Number(mes) &&
      Number(p.anio) === Number(anio)
  );

  const base = {
    usuario_id,
    categoria_id,
    mes,
    anio,
    monto,
    monto_actual: existente ? existente.monto_actual ?? 0 : 0, // conservamos acumulado si hay
  };

  if (existente) {
    return actualizarPresupuesto(existente.id, base);
  } else {
    return crearPresupuesto(base);
  }
};
