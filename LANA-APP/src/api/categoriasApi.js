// 📂 src/api/categoriasApi.js
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
