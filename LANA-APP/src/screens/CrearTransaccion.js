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

  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("ingreso");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState(null);
  const [categorias, setCategorias] = useState([]);

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
      return;
    }

    try {
      await crearTransaccion({
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
    }
  };

  return (
    <View style={styles.container}>
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
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20, justifyContent: "center" },
  title: { fontSize: 26, color: "#fff", fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { color: "#ccc", fontSize: 16, marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#0a1f44",
    color: "#fff",
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  picker: {
    backgroundColor: "#0a1f44",
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#0af",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center", fontSize: 18 },
});
