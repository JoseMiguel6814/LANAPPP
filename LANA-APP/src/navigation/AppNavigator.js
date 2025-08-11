import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";   // <-- usa tu pantalla real
import HomeScreen from "../screens/HomeScreen";
import Register from "../screens/RegisterScreen"; // Asegúrate de que esta pantalla exist
import CrearTransaccion from "../screens/CrearTransaccion";
import EditarTransaccion from "../screens/EditarTransaccion";
import CrearCategoria from "../screens/CrearCategoria";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Iniciar Sesión", headerShown: false }}
      />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Stack.Screen name="Register" component={Register} options={{ title: "Registrarse" }} />
      <Stack.Screen name="CrearTransaccion" component={CrearTransaccion} options={{ title: "Nueva Transacción" }} />
      <Stack.Screen name="EditarTransaccion" component={EditarTransaccion} options={{ title: "Editar Transacción" }} />
      <Stack.Screen name="CrearCategoria" component={CrearCategoria} options={{ title: "Nueva Categoría" }} />
    </Stack.Navigator>
  );
}
