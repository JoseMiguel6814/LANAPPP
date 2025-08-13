// 📂 src/api/categoriasApi.js
<<<<<<< HEAD
const API_ORIGIN = "https://api-lana-production.up.railway.app"; // <-- tu host
const API_PREFIX = ""; // ej. "/api" si en main.py usaste include_router(..., prefix="/api")
const API_URL = `${API_ORIGIN}${API_PREFIX}`;

// (Opcional) headers con token
const authHeaders = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

// Formatea errores de FastAPI (string | {detail} | [{loc,msg,type}])
const toNiceMessage = (payload, r) => {
  if (!payload) return `Error ${r.status} ${r.statusText}`;
  if (typeof payload === "string") return payload;

  if (payload.detail) {
    if (typeof payload.detail === "string") return payload.detail;
    if (Array.isArray(payload.detail)) {
      return payload.detail
        .map((e, i) => {
          const where = Array.isArray(e.loc) ? e.loc.join(".") : e.loc;
          return `${i + 1}. ${where}: ${e.msg}`;
        })
        .join("\n");
    }
  }

  if (Array.isArray(payload)) {
    return payload
      .map((e, i) => {
        const where = Array.isArray(e.loc) ? e.loc.join(".") : e.loc;
        return `${i + 1}. ${where}: ${e.msg || JSON.stringify(e)}`;
      })
      .join("\n");
  }

  try {
    return JSON.stringify(payload);
  } catch {
    return `Error ${r.status} ${r.statusText}`;
  }
};

// Helper robusto de fetch
const fetchJson = async (input, init) => {
  const r = await fetch(input, init);
  if (!r.ok) {
    let payload;
    try {
      payload = await r.json();
    } catch {
      payload = await r.text();
    }
    const e = new Error(toNiceMessage(payload, r));
    e.status = r.status;
    e.payload = payload;
    throw e;
  }
  return r.json();
};

// Helper query
const withQuery = (base, params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, v);
  });
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
};

const safeNumber = (v) => (v !== "" && v != null ? Number(v) : undefined);

// 🔹 Listar categorías (filtros: tipo; soporta usuario_id si decides usarlo)
export const listarCategorias = async (filtros = {}, token) => {
  const url = withQuery(`${API_URL}/categorias`, {
    usuario_id: filtros.usuario_id, // puedes quitarlo del UI si no lo usas
    tipo: filtros.tipo, // "ingreso" | "egreso"
  });
  return fetchJson(url, { headers: { ...authHeaders(token) } });
};

// Alias
export const obtenerCategorias = async (token) => listarCategorias({}, token);

// 🔹 Obtener categoría por ID
export const obtenerCategoriaPorId = async (id, token) =>
  fetchJson(`${API_URL}/categorias/${id}`, { headers: { ...authHeaders(token) } });

// 🔹 Crear categoría (solo lo que el usuario conoce)
export const crearCategoria = async (categoria = {}, token) => {
  const payload = {
    nombre: categoria.nombre?.trim(),
    tipo: (categoria.tipo || "egreso").toLowerCase(),
    ...(safeNumber(categoria.categoria_padre_id) !== undefined && {
      categoria_padre_id: safeNumber(categoria.categoria_padre_id),
    }),
  };

  return fetchJson(`${API_URL}/categorias`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
};

// 🔹 Actualizar categoría (parcial)
export const actualizarCategoria = async (id, categoria = {}, token) => {
  const payload = {
    ...(categoria.nombre != null && { nombre: categoria.nombre.trim() }),
    ...(categoria.tipo != null && { tipo: String(categoria.tipo).toLowerCase() }),
    ...(safeNumber(categoria.categoria_padre_id) !== undefined && {
      categoria_padre_id: safeNumber(categoria.categoria_padre_id),
    }),
  };

  return fetchJson(`${API_URL}/categorias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
};

// 🔹 Eliminar categoría
export const eliminarCategoria = async (id, token) =>
  fetchJson(`${API_URL}/categorias/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders(token) },
  });
=======
const BASE_URL = "https://tu-api-url.com"; // Cambia por tu URL

export async function obtenerCategorias() {
  const response = await fetch(`${BASE_URL}/categorias`);
  if (!response.ok) throw new Error("Error al obtener categorías");
  return await response.json();
}

export async function crearCategoria(nombre) {
  const response = await fetch(`${BASE_URL}/categorias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre }),
  });
  if (!response.ok) throw new Error("Error al crear categoría");
  return await response.json();
}
>>>>>>> parent of 9fbe0795 (cambios)
