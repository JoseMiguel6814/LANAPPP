import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { obtenerTransacciones, eliminarTransaccion } from "../api/transaccionesApi";

const calcularResumen = (transacciones) => {
  let ingresos = 0;
  let egresos = 0;
  const categorias = {};

  transacciones.forEach(({ monto, tipo, categoria }) => {
    if (tipo === "ingreso") ingresos += Number(monto);
    else if (tipo === "egreso") egresos += Number(monto);

    if (categoria?.nombre) {
      categorias[categoria.nombre] = (categorias[categoria.nombre] || 0) + Number(monto);
    }
  });

  return { ingresos, egresos, categorias };
};

export default function HomeScreen({ navigation }) {
  const [transacciones, setTransacciones] = useState([]);
  const [resumen, setResumen] = useState({ ingresos: 0, egresos: 0, categorias: {} });

  const cargarTransacciones = async () => {
    try {
      const data = await obtenerTransacciones();
      setTransacciones(data);
      setResumen(calcularResumen(data));
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las transacciones");
    }
  };

  const confirmarEliminar = (id) => {
    Alert.alert("Confirmar", "¿Eliminar esta transacción?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await eliminarTransaccion(id);
            Alert.alert("Éxito", "Transacción eliminada");
            cargarTransacciones();
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar la transacción");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    cargarTransacciones();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={transacciones}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Hola, bienvenido a Lana App</Text>
              <Text style={styles.saldoLabel}>Saldo total disponible</Text>
              <Text style={styles.saldoTotal}>
                ${(resumen.ingresos - resumen.egresos).toFixed(2)}
              </Text>
            </View>

            <View style={styles.resumenContainer}>
              <View style={[styles.resumenBox, { backgroundColor: "#1e7e34" }]}>
                <Text style={styles.resumenLabel}>Ingresos</Text>
                <Text style={styles.resumenMonto}>${resumen.ingresos.toFixed(2)}</Text>
              </View>
              <View style={[styles.resumenBox, { backgroundColor: "#c82333" }]}>
                <Text style={styles.resumenLabel}>Egresos</Text>
                <Text style={styles.resumenMonto}>${resumen.egresos.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.categoriasContainer}>
              <Text style={styles.subTitle}>Resumen por categoría</Text>
              {Object.entries(resumen.categorias).map(([categoria, monto]) => (
                <View key={categoria} style={styles.categoriaRow}>
                  <Text style={styles.categoriaNombre}>{categoria}</Text>
                  <Text style={styles.categoriaMonto}>${monto.toFixed(2)}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.subTitle, { textAlign: "center", marginBottom: 12 }]}>
              Últimas transacciones
            </Text>

            {transacciones.length === 0 && (
              <Text style={styles.noTransacciones}>No hay transacciones aún</Text>
            )}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.transaccionCard}>
            <View style={styles.transaccionInfo}>
              <Text
                style={[
                  styles.monto,
                  item.tipo === "ingreso" ? styles.ingreso : styles.egreso,
                ]}
              >
                {item.tipo === "ingreso" ? "+" : "-"}${Number(item.monto).toFixed(2)}
              </Text>
              <Text style={styles.descripcion}>{item.descripcion || "Sin descripción"}</Text>
              <Text style={styles.fecha}>{new Date(item.fecha).toLocaleDateString()}</Text>
            </View>
            <View style={styles.transaccionAcciones}>
              <TouchableOpacity
                style={styles.botonEditar}
                onPress={() => navigation.navigate("EditarTransaccion", { id: item.id })}
              >
                <Text style={styles.textoBoton}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => confirmarEliminar(item.id)}
              >
                <Text style={styles.textoBoton}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.botonAgregar}
            onPress={() => navigation.navigate("CrearTransaccion")}
          >
            <Text style={styles.textoBotonAgregar}>+ Nueva transacción</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  header: { marginBottom: 30, alignItems: "center" },
  title: { color: "#eee", fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  saldoLabel: { color: "#aaa", fontSize: 16 },
  saldoTotal: { fontSize: 36, fontWeight: "900", color: "#0af" },

  resumenContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  resumenBox: { flex: 1, marginHorizontal: 5, padding: 15, borderRadius: 10 },
  resumenLabel: { color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  resumenMonto: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 5, textAlign: "center" },

  categoriasContainer: { marginBottom: 30 },
  subTitle: { color: "#eee", fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  categoriaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  categoriaNombre: { color: "#ccc", fontSize: 16 },
  categoriaMonto: { color: "#0af", fontWeight: "900", fontSize: 16 },

  noTransacciones: {
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 20,
  },

  transaccionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  transaccionInfo: { flex: 3 },
  monto: { fontSize: 18, fontWeight: "bold" },
  ingreso: { color: "#28a745" },
  egreso: { color: "#dc3545" },
  descripcion: { color: "#ddd", fontSize: 14, marginTop: 4 },
  fecha: { color: "#aaa", fontSize: 12, marginTop: 4 },

  transaccionAcciones: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  botonEditar: {
    backgroundColor: "#0af",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
  botonEliminar: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  textoBoton: { color: "#fff", fontWeight: "bold" },

  botonAgregar: {
    backgroundColor: "#0af",
    borderRadius: 30,
    paddingVertical: 15,
    marginBottom: 40,
  },
  textoBotonAgregar: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});

