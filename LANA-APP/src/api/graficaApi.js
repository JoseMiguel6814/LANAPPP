// 📂 src/api/graficasApi.js
const API_URL = "https://api-lana-production.up.railway.app";

/**
 * Obtiene datos de ingresos y egresos por categoría para un usuario específico.
 * @param {number|string} usuarioId - ID del usuario
 * @returns {Promise<{ingresos: Array<{categoria: string, total: number}>, egresos: Array<{categoria: string, total: number}>}>}
 */
export const obtenerGraficaPorCategoria = async (usuarioId) => {
  try {
    const response = await fetch(`${API_URL}/grafica/${usuarioId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener datos de gráfica:", error);
    throw error;
  }
};
