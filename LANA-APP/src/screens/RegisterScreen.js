// 📂 src/screens/RegisterScreen.js
import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { registrarUsuario } from "../api/authApi";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleRegister = async () => {
  try {
    const response = await registrarUsuario(nombre, correo, telefono, contrasena);

    // Registro exitoso: mostrar mensaje fijo
    Alert.alert("Registro", "Usuario registrado correctamente");

  } catch (error) {
  console.log("ERROR COMPLETO:", error);

  // Función para parsear mensajes de error Pydantic
  const parseErrorMessages = (errorDetail) => {
    if (Array.isArray(errorDetail)) {
      return errorDetail
        .map(err => (typeof err === 'object' && err.msg ? err.msg : JSON.stringify(err)))
        .join('\n');
    }
    if (typeof errorDetail === 'string') {
      return errorDetail;
    }
    return JSON.stringify(errorDetail);
  };

  // Aquí extraemos detalle directamente desde error (no error.response)
  const errorData = error.detail || error.mensaje || error;

  let mensaje = "Error desconocido";

  if (errorData) {
    mensaje = parseErrorMessages(errorData);
  }

  Alert.alert("Error", mensaje);
}

};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Registro en LANA APP 📝</Text>
      <CustomInput placeholder="Nombre completo" value={nombre} onChangeText={setNombre} />
      <CustomInput placeholder="Correo electrónico" value={correo} onChangeText={setCorreo} />
      <CustomInput placeholder="Teléfono" value={telefono} onChangeText={setTelefono} />
      <CustomInput placeholder="Contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry />
      <CustomButton title="Registrarme" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#121212" },
  title: { fontSize: 22, color: "#fff", fontWeight: "bold", marginBottom: 20, textAlign: "center" }
});
