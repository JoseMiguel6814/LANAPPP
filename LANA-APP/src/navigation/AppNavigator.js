import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import CrearTransaccion from "../screens/CrearTransaccion";
import EditarTransaccion from "../screens/EditarTransaccion";
import CrearCategoria from "../screens/CrearCategoria";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Stack.Screen name="CrearTransaccion" component={CrearTransaccion} options={{ title: "Nueva Transacción" }} />
      <Stack.Screen name="EditarTransaccion" component={EditarTransaccion} options={{ title: "Editar Transacción" }} />
      <Stack.Screen name="CrearCategoria" component={CrearCategoria} options={{ title: "Nueva Categoría" }} />
    </Stack.Navigator>
  );
}
