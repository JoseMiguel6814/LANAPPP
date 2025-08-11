// 📂 src/api/transaccionesApi.js
const API_URL = "https://api-lana-production.up.railway.app"; // Cambia si tu backend está en otra URL

// 🔹 Obtener todas las transacciones
export const obtenerTransacciones = async () => {
  const response = await fetch(`${API_URL}/transacciones`);
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// 🔹 Obtener transacción por ID
export const obtenerTransaccionPorId = async (id) => {
  const response = await fetch(`${API_URL}/transacciones/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// 🔹 Crear nueva transacción
export const crearTransaccion = async (transaccion) => {
  const response = await fetch(`${API_URL}/transacciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaccion),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// 🔹 Actualizar transacción
export const actualizarTransaccion = async (id, transaccion) => {
  const response = await fetch(`${API_URL}/transacciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaccion),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// 🔹 Eliminar transacción
export const eliminarTransaccion = async (id) => {
  const response = await fetch(`${API_URL}/transacciones/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};
