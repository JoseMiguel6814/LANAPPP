// 📂 src/screens/CrearTransaccion.js
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { crearTransaccion } from "../api/transaccionesApi";
import { obtenerCategorias } from "../api/categoriasApi";

export default function CrearTransaccion({ navigation }) {
  const usuarioId = 1; // TODO: Reemplazar cuando tengas login real
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("egreso");
  const [descripcion, setDescripcion] = useState("");

  const cargarCategorias = useCallback(async () => {
    try {
      const cats = await obtenerCategorias();
      setCategorias(cats);
      if (cats.length > 0) setCategoriaId(cats[0].id);
    } catch (e) {
      Alert.alert("Error", e?.message || e?.detail || "No se pudieron cargar las categorías.");
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const onCrear = async () => {
    const nMonto = Number(monto);
    if (!categoriaId || Number.isNaN(nMonto) || !tipo) {
      Alert.alert("Campos requeridos", "Selecciona categoría, tipo y un monto válido.");
      return;
    }
    try {
      await crearTransaccion({
        usuario_id: usuarioId,
        cuenta_id: null,
        categoria_id: categoriaId,
        monto: nMonto,
        tipo,
        descripcion,
        // fecha se pone hoy en la API si no la enviamos
      });
      Alert.alert("Éxito", "Transacción creada correctamente.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", e?.message || e?.detail || "No se pudo crear la transacción.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categoría</Text>
      <View style={styles.pickerBox}>
        <RNPicker selectedValue={categoriaId} onValueChange={setCategoriaId} style={styles.picker}>
          {categorias.map((c) => (
            <RNPicker.Item key={c.id} label={`${c.nombre} (${c.tipo})`} value={c.id} />
          ))}
        </RNPicker>
      </View>

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.pickerBox}>
        <RNPicker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
          <RNPicker.Item label="Egreso" value="egreso" />
          <RNPicker.Item label="Ingreso" value="ingreso" />
        </RNPicker>
      </View>

      <Text style={styles.label}>Monto</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={monto}
        onChangeText={setMonto}
      />

      <Text style={styles.label}>Descripción (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TouchableOpacity style={styles.button} onPress={onCrear}>
        <Text style={styles.buttonText}>Crear transacción</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  label: { color: "#ccc", marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#0a1f44",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pickerBox: { backgroundColor: "#0a1f44", borderRadius: 8 },
  picker: { color: "#fff" },
  button: {
    backgroundColor: "#0af",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 24,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});
