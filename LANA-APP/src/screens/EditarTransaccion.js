import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { obtenerTransaccionPorId, actualizarTransaccion } from "../api/transaccionesApi";

export default function EditarTransaccion({ route, navigation }) {
  const { id } = route.params;
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("ingreso");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [cuentaId, setCuentaId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString());

  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerTransaccionPorId(id);
        setMonto(data.monto.toString());
        setTipo(data.tipo);
        setDescripcion(data.descripcion || "");
        setCategoriaId(data.categoria_id ? data.categoria_id.toString() : "");
        setCuentaId(data.cuenta_id ? data.cuenta_id.toString() : "");
        setUsuarioId(data.usuario_id ? data.usuario_id.toString() : "");
        setFecha(data.fecha);
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar la transacción");
        navigation.goBack();
      }
    }
    cargarDatos();
  }, [id]);

  const handleActualizar = async () => {
    if (!monto || !tipo) {
      Alert.alert("Error", "Por favor llena monto y tipo");
      return;
    }

    try {
      await actualizarTransaccion(id, {
        monto: parseFloat(monto),
        tipo,
        descripcion,
        categoria_id: parseInt(categoriaId) || null,
        cuenta_id: parseInt(cuentaId) || null,
        usuario_id: parseInt(usuarioId) || null,
        fecha,
      });
      Alert.alert("Éxito", "Transacción actualizada");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la transacción");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Transacción</Text>
      <TextInput
        style={styles.input}
        placeholder="Monto"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo (ingreso/egreso)"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        style={styles.input}
        placeholder="ID Categoría"
        keyboardType="numeric"
        value={categoriaId}
        onChangeText={setCategoriaId}
      />
      <TextInput
        style={styles.input}
        placeholder="ID Cuenta"
        keyboardType="numeric"
        value={cuentaId}
        onChangeText={setCuentaId}
      />
      <TextInput
        style={styles.input}
        placeholder="ID Usuario"
        keyboardType="numeric"
        value={usuarioId}
        onChangeText={setUsuarioId}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha (YYYY-MM-DD)"
        value={fecha.substring(0, 10)}
        onChangeText={(text) => setFecha(text + "T00:00:00.000Z")}
      />

      <TouchableOpacity style={styles.button} onPress={handleActualizar}>
        <Text style={styles.buttonText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20, justifyContent: "center" },
  title: { fontSize: 26, color: "#fff", fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "#0a1f44",
    color: "#fff",
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#0af",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center", fontSize: 18 },
});
