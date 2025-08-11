// 📂 src/api/categoriasApi.js
const API_URL = "https://api-lana-production.up.railway.app";

// Helper para armar query strings
const withQuery = (base, params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, v);
  });
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
};

// 🔹 Listar categorías (con filtros opcionales: { usuario_id, tipo })
export const listarCategorias = async (filtros = {}) => {
  const url = withQuery(`${API_URL}/categorias`, filtros);
  const r = await fetch(url);
  if (!r.ok) throw await r.json();
  return r.json();
};

// (Alias cómodo) Obtener todas sin filtros
export const obtenerCategorias = async () => listarCategorias();

// 🔹 Obtener categoría por ID
export const obtenerCategoriaPorId = async (id) => {
  const r = await fetch(`${API_URL}/categorias/${id}`);
  if (!r.ok) throw await r.json();
  return r.json();
};

// 🔹 Crear categoría
// IMPORTANTE: tu backend exige "tipo". Si no lo mandas, ponemos "egreso" por defecto.
export const crearCategoria = async (categoria = {}) => {
  const payload = {
    nombre: categoria.nombre?.trim(),
    tipo: categoria.tipo ?? "egreso",               // default para que no truene
    usuario_id: categoria.usuario_id ?? null,       // opcional
    categoria_padre_id: categoria.categoria_padre_id ?? null, // opcional
    es_sistema: categoria.es_sistema ?? false,      // opcional
  };

  const r = await fetch(`${API_URL}/categorias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw await r.json();
  return r.json();
};

// 🔹 Actualizar categoría
export const actualizarCategoria = async (id, categoria = {}) => {
  const payload = {
    // mandamos solo lo que tengas; tu backend ignora None si no quieres cambiar algo
    id,
    nombre: categoria.nombre?.trim() ?? null,
    tipo: categoria.tipo ?? null,
    usuario_id: categoria.usuario_id ?? null,
    categoria_padre_id: categoria.categoria_padre_id ?? null,
    es_sistema: categoria.es_sistema ?? null,
    creado_en: categoria.creado_en ?? null, // el schema lo trae opcional; no afecta
  };

  const r = await fetch(`${API_URL}/categorias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw await r.json();
  return r.json();
};

// 🔹 Eliminar categoría
export const eliminarCategoria = async (id) => {
  const r = await fetch(`${API_URL}/categorias/${id}`, { method: "DELETE" });
  if (!r.ok) throw await r.json();
  return r.json();
};
