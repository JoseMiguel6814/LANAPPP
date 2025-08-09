const API_URL = "https://api-lana-production.up.railway.app";

export const obtenerTransacciones = async () => {
  const response = await fetch(`${API_URL}/transacciones`);
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

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
