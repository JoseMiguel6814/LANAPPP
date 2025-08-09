// 📂 src/api/authApi.js
import axios from "axios";

// URL base de tu API FastAPI en Railway
const API_URL = "https://api-lana-production.up.railway.app";

export const loginUsuario = async (correo, contrasena) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      correo_electronico: correo,
      contrasena_hash: contrasena
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Error en login" };
  }
};

export const registrarUsuario = async (nombre, correo, telefono, contrasena) => {
  const data = {
    nombre_completo: nombre,
    correo_electronico: correo,
    telefono: telefono || null,
    contrasena_hash: contrasena,
    verificado: false,
    creado_en: new Date().toISOString(),
    actualizado_en: new Date().toISOString(),
  };

  const response = await fetch("https://api-lana-production.up.railway.app/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return await response.json();
};
