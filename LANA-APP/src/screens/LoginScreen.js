// 📂 src/screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { loginUsuario } from "../api/authApi";

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

 const handleLogin = async () => {
  try {
    const data = await loginUsuario(correo, contrasena);
    Alert.alert("Bienvenido", `Hola ${data.nombre_completo}`);

    // Navegar a Home (confirma que el nombre de pantalla es "Home")
    navigation.navigate("Home");

  } catch (error) {
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
      <Text style={styles.title}>🔥 LANA APP - LOGIN 🔥</Text>
      <CustomInput placeholder="Correo electrónico" value={correo} onChangeText={setCorreo} />
      <CustomInput placeholder="Contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry />
      <CustomButton title="Iniciar Sesión" onPress={handleLogin} />
      <CustomButton title="Registrarme" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#121212" },
  title: { fontSize: 22, color: "#fff", fontWeight: "bold", marginBottom: 20, textAlign: "center" }
});
