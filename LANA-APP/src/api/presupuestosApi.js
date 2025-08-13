// 📂 src/api/presupuestoApi.js
const API_URL = "https://api-lana-production.up.railway.app";

/**
 * Guarda o actualiza el presupuesto de un usuario.
 * @param {number|string} usuarioId - ID del usuario
 * @param {number} monto - Monto del presupuesto
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const guardarPresupuesto = async (usuarioId, monto) => {
  try {
    const response = await fetch(`${API_URL}/presupuesto/${usuarioId}`, {
      method: "POST", // O "PUT" según tu backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ monto }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al guardar presupuesto:", error);
    throw error;
  }
};

/**
 * Obtiene el presupuesto de un usuario.
 * @param {number|string} usuarioId - ID del usuario
 * @returns {Promise<{monto: number}>}
 */
export const obtenerPresupuesto = async (usuarioId) => {
  try {
    const response = await fetch(`${API_URL}/presupuesto/${usuarioId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener presupuesto:", error);
    throw error;
  }
};
