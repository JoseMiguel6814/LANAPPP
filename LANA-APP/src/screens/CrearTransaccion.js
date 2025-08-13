<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Picker, // si usas @react-native-picker/picker, instala y importa así
} from "react-native";
import { crearTransaccion, obtenerCategorias } from "../api/transaccionesApi";

// Recuerda instalar: npm install @react-native-picker/picker
import { Picker as RNPicker } from '@react-native-picker/picker';

export default function CrearTransaccion({ navigation, route }) {
  // Supongamos que el usuario logueado está en route.params.userId
  const usuarioId = route.params?.userId || 1; // por default 1 si no tienes auth aún

>>>>>>> parent of 9fbe0795 (cambios)
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("egreso");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState(null);
  const [categorias, setCategorias] = useState([]);

<<<<<<< HEAD
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
=======
  useEffect(() => {
    async function cargarCategorias() {
      try {
        const cats = await obtenerCategorias();
        setCategorias(cats);
        if (cats.length > 0) setCategoriaId(cats[0].id);
      } catch {
        Alert.alert("Error", "No se pudieron cargar las categorías");
      }
    }
    cargarCategorias();
  }, []);

  const handleCrear = async () => {
    if (!monto || !tipo || !categoriaId) {
      Alert.alert("Error", "Por favor llena todos los campos");
>>>>>>> parent of 9fbe0795 (cambios)
      return;
    }

    try {
      await crearTransaccion({
<<<<<<< HEAD
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
=======
        monto: parseFloat(monto),
        tipo,
        descripcion,
        categoria_id: categoriaId,
        cuenta_id: null, // si quieres agregar cuentas, debes manejar esto
        usuario_id: usuarioId,
        // fecha no se envía, el backend lo pone automático
      });
      Alert.alert("Éxito", "Transacción creada");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la transacción");
>>>>>>> parent of 9fbe0795 (cambios)
    }
  };

  return (
    <View style={styles.container}>
<<<<<<< HEAD
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
=======
      <Text style={styles.title}>Crear Transacción</Text>

      <TextInput
        style={styles.input}
        placeholder="Monto"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
      />

      <Text style={styles.label}>Tipo</Text>
      <RNPicker
        selectedValue={tipo}
        onValueChange={(itemValue) => setTipo(itemValue)}
        style={styles.picker}
      >
        <RNPicker.Item label="Ingreso" value="ingreso" />
        <RNPicker.Item label="Egreso" value="egreso" />
      </RNPicker>

      <Text style={styles.label}>Categoría</Text>
      <RNPicker
        selectedValue={categoriaId}
        onValueChange={(itemValue) => setCategoriaId(itemValue)}
        style={styles.picker}
      >
        {categorias.map((cat) => (
          <RNPicker.Item key={cat.id} label={cat.nombre} value={cat.id} />
        ))}
      </RNPicker>

      <TextInput
        style={styles.input}
        placeholder="Descripción (opcional)"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {/* Fecha y usuario no se muestran ni editan */}

      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear</Text>
>>>>>>> parent of 9fbe0795 (cambios)
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  label: { color: "#ccc", marginTop: 12, marginBottom: 6 },
=======
  container: { flex: 1, backgroundColor: "#121212", padding: 20, justifyContent: "center" },
  title: { fontSize: 26, color: "#fff", fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { color: "#ccc", fontSize: 16, marginTop: 12, marginBottom: 6 },
>>>>>>> parent of 9fbe0795 (cambios)
  input: {
    backgroundColor: "#0a1f44",
    color: "#fff",
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
<<<<<<< HEAD
  pickerBox: { backgroundColor: "#0a1f44", borderRadius: 8 },
  picker: { color: "#fff" },
=======
  picker: {
    backgroundColor: "#0a1f44",
    color: "#fff",
    marginBottom: 15,
  },
>>>>>>> parent of 9fbe0795 (cambios)
  button: {
    backgroundColor: "#0af",
    paddingVertical: 15,
    borderRadius: 10,
<<<<<<< HEAD
    paddingVertical: 14,
    marginTop: 24,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
=======
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center", fontSize: 18 },
>>>>>>> parent of 9fbe0795 (cambios)
});
