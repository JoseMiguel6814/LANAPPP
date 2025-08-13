// 📂 src/api/transaccionesApi.js
const API_URL = "https://api-lana-production.up.railway.app";

// Helper robusto de fetch con buen manejo de errores
const fetchJson = async (input, init) => {
  const r = await fetch(input, init);
  if (!r.ok) {
    let msg = `Error ${r.status} ${r.statusText}`;
    try {
      const j = await r.json();
      msg = j?.detail || JSON.stringify(j);
    } catch {
      const t = await r.text();
      if (t) msg = t;
    }
    const e = new Error(msg);
    e.status = r.status;
    throw e;
  }
  return r.json();
};

// Normaliza payloads: ids a número, monto a número, fecha a YYYY-MM-DD
const toYYYYMMDD = (d = new Date()) => {
  const iso = new Date(d).toISOString();
  return iso.slice(0, 10); // "YYYY-MM-DD"
};

const buildTransaccionPayload = (tx = {}) => {
  return {
    usuario_id: tx.usuario_id != null ? Number(tx.usuario_id) : undefined, // lo pones tú en la vista
    cuenta_id: tx.cuenta_id != null ? Number(tx.cuenta_id) : null,         // la vista envía null
    categoria_id: tx.categoria_id != null ? Number(tx.categoria_id) : undefined,
    monto: tx.monto != null ? Number(tx.monto) : undefined,
    tipo: tx.tipo, // "ingreso" | "egreso"
    descripcion: tx.descripcion ?? null,
    // Si te mandan "fecha" la respeto; si no, pongo hoy en formato DATE
    fecha: tx.fecha ? toYYYYMMDD(tx.fecha) : toYYYYMMDD(),
  };
};

// 🔹 Obtener todas las transacciones
export const obtenerTransacciones = async () => {
  return fetchJson(`${API_URL}/transacciones`);
};

// 🔹 Obtener transacción por ID
export const obtenerTransaccionPorId = async (id) => {
  return fetchJson(`${API_URL}/transacciones/${Number(id)}`);
};

// 🔹 Crear nueva transacción
export const crearTransaccion = async (transaccion) => {
  const payload = buildTransaccionPayload(transaccion);
  return fetchJson(`${API_URL}/transacciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

// 🔹 Actualizar transacción
export const actualizarTransaccion = async (id, transaccion) => {
  const payload = buildTransaccionPayload(transaccion);
  return fetchJson(`${API_URL}/transacciones/${Number(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

// 🔹 Eliminar transacción
export const eliminarTransaccion = async (id) => {
  return fetchJson(`${API_URL}/transacciones/${Number(id)}`, {
    method: "DELETE",
  });
};
