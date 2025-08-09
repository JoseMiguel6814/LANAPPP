import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { crearCategoria } from "../api/categoriasApi";

export default function CrearCategoria({ navigation }) {
  const [nombre, setNombre] = useState("");

  const handleCrear = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }
    try {
      await crearCategoria({ nombre: nombre.trim() });
      Alert.alert("Éxito", "Categoría creada");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la categoría");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Categoría</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la categoría"
        value={nombre}
        onChangeText={setNombre}
      />
      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear</Text>
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
