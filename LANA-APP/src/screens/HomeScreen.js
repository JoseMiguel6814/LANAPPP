import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
<<<<<<< HEAD
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";

import { obtenerTransacciones, eliminarTransaccion } from "../api/transaccionesApi";
import { obtenerGraficaPorCategoria } from "../api/graficaApi";
import { verificarExcesoPresupuesto } from "../api/presupuestosApi";
=======
import { obtenerTransacciones, eliminarTransaccion } from "../api/transaccionesApi";
>>>>>>> parent of 9fbe0795 (cambios)

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
<<<<<<< HEAD
  const usuarioId = 1; // TODO: cambiar por el ID real del login
  const [transacciones, setTransacciones] = useState([]);
  const [saldoDisponible, setSaldoDisponible] = useState(0);
  const [modalSaldoVisible, setModalSaldoVisible] = useState(false);
  const [saldoTmp, setSaldoTmp] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [resumen, setResumen] = useState({ ingresos: 0, egresos: 0 });
  const [graficosData, setGraficosData] = useState({ ingresos: [], egresos: [] });
  const [alertasPresu, setAlertasPresu] = useState([]);

  // 📌 Cargar saldo
  const cargarSaldo = useCallback(async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_SALDO_KEY);
      if (s !== null) setSaldoDisponible(Number(s));
    } catch {}
  }, []);

  const guardarSaldo = async (valor) => {
    try {
      await AsyncStorage.setItem(STORAGE_SALDO_KEY, String(valor));
    } catch {}
  };

  const abrirModalSaldo = () => {
    setSaldoTmp(String(saldoDisponible || ""));
    setModalSaldoVisible(true);
  };

  const confirmarSaldo = () => {
    const valor = Number(saldoTmp);
    if (Number.isNaN(valor)) {
      Alert.alert("Saldo inválido", "Ingresa un número válido.");
      return;
    }
    setSaldoDisponible(valor);
    guardarSaldo(valor);
    setModalSaldoVisible(false);
  };

  // 📌 Cargar transacciones + gráfica
  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);

      const dataTransacciones = await obtenerTransacciones();
      setTransacciones(dataTransacciones);

      let ingresos = 0;
      let egresos = 0;
      dataTransacciones.forEach(({ monto, tipo }) => {
        if (tipo === "ingreso") ingresos += Number(monto);
        if (tipo === "egreso") egresos += Number(monto);
      });
      setResumen({ ingresos, egresos });

      const dataGraficas = await obtenerGraficaPorCategoria(usuarioId);
      setGraficosData(dataGraficas);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  // 📌 Alertas de presupuesto
  const cargarAlertasPresupuesto = useCallback(async () => {
    try {
      const res = await verificarExcesoPresupuesto(usuarioId);
      setAlertasPresu(res.alertas_exceso || []);
    } catch {}
  }, [usuarioId]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([cargarDatos(), cargarAlertasPresupuesto()]);
    setRefreshing(false);
  }, [cargarDatos, cargarAlertasPresupuesto]);
=======
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
>>>>>>> parent of 9fbe0795 (cambios)

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
<<<<<<< HEAD
    cargarSaldo();
    cargarDatos();
    cargarAlertasPresupuesto();
  }, [cargarSaldo, cargarDatos, cargarAlertasPresupuesto]);

  // 📌 Datos para gráfica
  const dataPie = graficosData.egresos.map((item) => ({
    x: item.categoria.length > 14 ? item.categoria.slice(0, 12) + "…" : item.categoria,
    y: item.total,
    label: `${item.categoria}\n$${Number(item.total).toFixed(2)}`,
  }));

  const saldoCalculado = resumen.ingresos - resumen.egresos;
  const saldoMostrado = saldoDisponible || saldoCalculado;
=======
    cargarTransacciones();
  }, []);
>>>>>>> parent of 9fbe0795 (cambios)

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
<<<<<<< HEAD
              <View style={styles.saldoRow}>
                <Text style={styles.saldoTotal}>${saldoMostrado.toFixed(2)}</Text>
                <TouchableOpacity style={styles.btnEditarSaldo} onPress={abrirModalSaldo}>
                  <Text style={styles.btnEditarSaldoText}>Editar saldo</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.saldoHint}>
                *Si no editas el saldo, se muestra (Ingresos − Egresos)
              </Text>
            </View>

            {/* Resumen */}
=======
              <Text style={styles.saldoTotal}>
                ${(resumen.ingresos - resumen.egresos).toFixed(2)}
              </Text>
            </View>

>>>>>>> parent of 9fbe0795 (cambios)
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

<<<<<<< HEAD
            {/* Alertas */}
            {alertasPresu.length > 0 && (
              <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: "#c82333" }]}>
                <Text style={styles.subTitle}>⚠️ Presupuestos excedidos</Text>
                {alertasPresu.map((a, i) => (
                  <Text key={i} style={{ color: "#eee", marginTop: 4 }}>
                    • {a.categoria}: gastado ${a.gastado.toFixed(2)} / límite ${a.presupuesto.toFixed(2)}
                  </Text>
                ))}
              </View>
            )}

            {/* Gráfica */}
            <View style={styles.card}>
              <Text style={styles.subTitle}>Gastos por categoría</Text>
              {dataPie.length > 0 ? (
                <VictoryPie
                  data={dataPie}
                  innerRadius={60}
                  padAngle={2}
                  animate={{ duration: 800 }}
                  style={{ labels: { fill: "#eee", fontSize: 12 } }}
                  height={260}
                />
              ) : (
                <Text style={styles.noTransacciones}>Aún no hay egresos para graficar</Text>
              )}
=======
            <View style={styles.categoriasContainer}>
              <Text style={styles.subTitle}>Resumen por categoría</Text>
              {Object.entries(resumen.categorias).map(([categoria, monto]) => (
                <View key={categoria} style={styles.categoriaRow}>
                  <Text style={styles.categoriaNombre}>{categoria}</Text>
                  <Text style={styles.categoriaMonto}>${monto.toFixed(2)}</Text>
                </View>
              ))}
>>>>>>> parent of 9fbe0795 (cambios)
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
<<<<<<< HEAD
          <>
            <TouchableOpacity
              style={styles.botonAgregar}
              onPress={() => navigation.navigate("CrearTransaccion")}
            >
              <Text style={styles.textoBotonAgregar}>+ Nueva transacción</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#28a745",
                padding: 12,
                borderRadius: 8,
                marginBottom: 40,
              }}
              onPress={() => navigation.navigate("CrearCategoria")}
            >
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                + Crear Categoría
              </Text>
            </TouchableOpacity>
          </>
        }
      />

      {/* Modal saldo */}
      <Modal
        transparent
        visible={modalSaldoVisible}
        animationType="fade"
        onRequestClose={() => setModalSaldoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar saldo disponible</Text>
            <TextInput
              style={styles.inputSaldo}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#777"
              value={saldoTmp}
              onChangeText={setSaldoTmp}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setModalSaldoVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnOk]}
                onPress={confirmarSaldo}
              >
                <Text style={styles.modalBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading && <Text style={styles.cargandoTexto}>Cargando…</Text>}
=======
          <TouchableOpacity
            style={styles.botonAgregar}
            onPress={() => navigation.navigate("CrearTransaccion")}
          >
            <Text style={styles.textoBotonAgregar}>+ Nueva transacción</Text>
          </TouchableOpacity>
        }
      />
>>>>>>> parent of 9fbe0795 (cambios)
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

<<<<<<< HEAD
  botonAgregar: { backgroundColor: "#0af", borderRadius: 30, paddingVertical: 15, marginBottom: 12 },
  textoBotonAgregar: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 18 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalCard: { width: "88%", backgroundColor: "#1f1f1f", borderRadius: 12, padding: 16 },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  inputSaldo: { backgroundColor: "#2a2a2a", borderRadius: 8, padding: 12, color: "#fff", fontSize: 16 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12, gap: 10 },
  modalBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  modalBtnCancel: { backgroundColor: "#444" },
  modalBtnOk: { backgroundColor: "#0af" },
  modalBtnText: { color: "#fff", fontWeight: "bold" },

  cargandoTexto: { position: "absolute", bottom: 12, alignSelf: "center", color: "#aaa" },
=======
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
>>>>>>> parent of 9fbe0795 (cambios)
});

