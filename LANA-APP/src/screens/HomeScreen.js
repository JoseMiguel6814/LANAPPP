// 📂 src/screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { VictoryPie } from "victory-native";

import { obtenerTransacciones, eliminarTransaccion } from "../api/transaccionesApi";
import { obtenerGraficaPorCategoria } from "../api/graficaApi"; // tu archivo actual
import { obtenerCategorias } from "../api/categoriasApi";
import {
  upsertPresupuestoMensual,
  verificarExcesoPresupuesto,
} from "../api/presupuestosApi";

const STORAGE_SALDO_KEY = "@lanaapp_saldo_disponible";

export default function HomeScreen({ navigation }) {
  const usuarioId = 1; // 🔹 TODO: usar el ID real del login
  const [transacciones, setTransacciones] = useState([]);
  const [saldoDisponible, setSaldoDisponible] = useState(0);
  const [modalSaldoVisible, setModalSaldoVisible] = useState(false);
  const [saldoTmp, setSaldoTmp] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [resumen, setResumen] = useState({ ingresos: 0, egresos: 0 });
  const [graficosData, setGraficosData] = useState({ ingresos: [], egresos: [] });

  // Presupuestos
  const [modalPresuVisible, setModalPresuVisible] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSel, setCategoriaSel] = useState(null);
  const [montoPresu, setMontoPresu] = useState("");
  const [alertasPresu, setAlertasPresu] = useState([]);

  // 📌 Cargar saldo guardado en AsyncStorage
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

      // Transacciones
      const dataTransacciones = await obtenerTransacciones();
      setTransacciones(dataTransacciones);

      // Resumen
      let ingresos = 0;
      let egresos = 0;
      dataTransacciones.forEach(({ monto, tipo }) => {
        if (tipo === "ingreso") ingresos += Number(monto);
        if (tipo === "egreso") egresos += Number(monto);
      });
      setResumen({ ingresos, egresos });

      // Gráfica por categoría (API)
      const dataGraficas = await obtenerGraficaPorCategoria(usuarioId);
      setGraficosData(dataGraficas);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  // 📌 Cargar categorías (para el modal de presupuesto)
  const cargarCategorias = useCallback(async () => {
    try {
      const cats = await obtenerCategorias();
      setCategorias(cats);
      if (cats.length > 0) setCategoriaSel(cats[0].id);
    } catch {}
  }, []);

  // 📌 Alertas de presupuesto excedido
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
            cargarDatos();
            cargarAlertasPresupuesto();
          } catch {
            Alert.alert("Error", "No se pudo eliminar la transacción");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    cargarSaldo();
    cargarDatos();
    cargarCategorias();
    cargarAlertasPresupuesto();
  }, [cargarSaldo, cargarDatos, cargarCategorias, cargarAlertasPresupuesto]);

  // 📌 Datos para gráfica (solo egresos)
  const dataPie = graficosData.egresos.map((item) => ({
    x: item.categoria.length > 14 ? item.categoria.slice(0, 12) + "…" : item.categoria,
    y: item.total,
    label: `${item.categoria}\n$${Number(item.total).toFixed(2)}`,
  }));

  const saldoCalculado = resumen.ingresos - resumen.egresos;
  const saldoMostrado = saldoDisponible || saldoCalculado;

  return (
    <View style={styles.container}>
      <FlatList
        data={transacciones}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0af" />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Hola, bienvenido a Lana App</Text>
              <Text style={styles.saldoLabel}>Saldo total disponible</Text>

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

            {/* Resumen ingresos/egresos */}
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

            {/* Alertas de presupuesto */}
            {alertasPresu.length > 0 && (
              <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: "#c82333" }]}>
                <Text style={styles.subTitle}>⚠️ Presupuestos excedidos</Text>
                {alertasPresu.map((a, i) => (
                  <Text key={i} style={{ color: "#eee", marginTop: 4 }}>
                    • {a.categoria}: gastado ${a.gastado.toFixed(2)} / límite $
                    {a.presupuesto.toFixed(2)} (exceso ${a.exceso.toFixed(2)})
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
            </View>
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
              <Text style={styles.descripcion}>
                {item.descripcion || "Sin descripción"}
              </Text>
              <Text style={styles.fecha}>
                {new Date(item.fecha).toLocaleDateString()}
              </Text>
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
                marginBottom: 12,
              }}
              onPress={() => navigation.navigate("CrearCategoria")}
            >
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                + Crear Categoría
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#9159c1",
                padding: 12,
                borderRadius: 8,
                marginBottom: 40,
              }}
              onPress={() => setModalPresuVisible(true)}
            >
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                ⚙️ Configurar presupuesto
              </Text>
            </TouchableOpacity>
          </>
        }
      />

      {/* Modal para editar saldo */}
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

      {/* Modal para presupuesto por categoría */}
      <Modal
        transparent
        visible={modalPresuVisible}
        animationType="fade"
        onRequestClose={() => setModalPresuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Presupuesto mensual por categoría</Text>

            <View style={{ backgroundColor: "#2a2a2a", borderRadius: 8, marginBottom: 10 }}>
              <RNPicker
                selectedValue={categoriaSel}
                onValueChange={setCategoriaSel}
                style={{ color: "#fff" }}
              >
                {categorias.map((c) => (
                  <RNPicker.Item key={c.id} label={c.nombre} value={c.id} />
                ))}
              </RNPicker>
            </View>

            <TextInput
              style={styles.inputSaldo}
              keyboardType="decimal-pad"
              placeholder="Monto límite mensual"
              placeholderTextColor="#777"
              value={montoPresu}
              onChangeText={setMontoPresu}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setModalPresuVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnOk]}
                onPress={async () => {
                  const n = Number(montoPresu);
                  if (!categoriaSel || Number.isNaN(n)) {
                    Alert.alert("Datos inválidos", "Elige categoría y un monto válido.");
                    return;
                  }
                  const now = new Date();
                  const mes = now.getMonth() + 1;
                  const anio = now.getFullYear();

                  try {
                    await upsertPresupuestoMensual({
                      usuario_id: usuarioId,
                      categoria_id: categoriaSel,
                      monto: n,
                      mes,
                      anio,
                    });
                    setModalPresuVisible(false);
                    setMontoPresu("");
                    Alert.alert("Presupuesto", "Presupuesto guardado correctamente.");
                    cargarAlertasPresupuesto();
                  } catch (e) {
                    Alert.alert("Error", e?.detail || "No fue posible guardar el presupuesto.");
                  }
                }}
              >
                <Text style={styles.modalBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading && <Text style={styles.cargandoTexto}>Cargando…</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  header: { marginBottom: 20, alignItems: "center" },
  title: { color: "#eee", fontSize: 28, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
  saldoLabel: { color: "#aaa", fontSize: 16 },
  saldoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6 },
  saldoTotal: { fontSize: 36, fontWeight: "900", color: "#0af" },
  btnEditarSaldo: { backgroundColor: "#0af", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnEditarSaldoText: { color: "#fff", fontWeight: "bold" },
  saldoHint: { color: "#777", fontSize: 12, marginTop: 6 },

  resumenContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  resumenBox: { flex: 1, marginHorizontal: 5, padding: 15, borderRadius: 10 },
  resumenLabel: { color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  resumenMonto: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 5, textAlign: "center" },

  card: { backgroundColor: "#1b1b1b", borderRadius: 12, padding: 14, marginBottom: 20 },

  noTransacciones: { color: "#666", fontStyle: "italic", textAlign: "center", marginVertical: 8 },

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

  transaccionAcciones: { flex: 1, justifyContent: "space-around", alignItems: "flex-end" },
  botonEditar: { backgroundColor: "#0af", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginBottom: 6 },
  botonEliminar: { backgroundColor: "#dc3545", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  textoBoton: { color: "#fff", fontWeight: "bold" },

  botonAgregar: { backgroundColor: "#0af", borderRadius: 30, paddingVertical: 15, marginBottom: 12 },
  textoBotonAgregar: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 18 },

  // Modal base
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
});
