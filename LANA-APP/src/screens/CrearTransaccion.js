// 📂 src/screens/CrudTransaccionesScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
} from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import {
  crearTransaccion,
  obtenerTransaccionPorId,
  actualizarTransaccion,
  eliminarTransaccion,
  obtenerTransacciones, // lo usamos para listar rápido después de crear/editar/eliminar si quieres
} from "../api/transaccionesApi";

export default function CrudTransaccionesScreen() {
  // Modos: crear | buscar | editar | eliminar
  const [modo, setModo] = useState("crear");

  // Campos comunes
  const [idTransaccion, setIdTransaccion] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [cuentaId, setCuentaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("ingreso");
  const [descripcion, setDescripcion] = useState("");

  // Resultados y ayuda
  const [resultado, setResultado] = useState(null);
  const [lista, setLista] = useState([]);

  const limpiarCampos = () => {
    setIdTransaccion("");
    setUsuarioId("");
    setCuentaId("");
    setCategoriaId("");
    setMonto("");
    setTipo("ingreso");
    setDescripcion("");
    setResultado(null);
  };

  // ---- Crear ----
  const handleCrear = async () => {
    if (!usuarioId || !categoriaId || !monto || !tipo) {
      Alert.alert("Campos requeridos", "Usuario, categoría, monto y tipo son obligatorios.");
      return;
    }
    try {
      const payload = {
        usuario_id: Number(usuarioId),
        cuenta_id: cuentaId ? Number(cuentaId) : null,
        categoria_id: Number(categoriaId),
        monto: parseFloat(monto),
        tipo,
        descripcion,
        fecha: new Date().toISOString(),
      };
      const resp = await crearTransaccion(payload);
      setResultado(resp);
      Alert.alert("Éxito", "Transacción creada correctamente.");
      // Opcional: refrescar una lista rápida para visualizar cambios
      const todas = await obtenerTransacciones();
      setLista(todas);
      limpiarCampos();
    } catch (err) {
      Alert.alert("Error", err?.detail || "No se pudo crear la transacción.");
    }
  };

  // ---- Buscar por ID ----
  const handleBuscar = async () => {
    if (!idTransaccion) {
      Alert.alert("Falta ID", "Ingresa el ID de la transacción a buscar.");
      return;
    }
    try {
      const data = await obtenerTransaccionPorId(Number(idTransaccion));
      setResultado(data);
    } catch (err) {
      setResultado(null);
      Alert.alert("Sin resultados", err?.detail || "Transacción no encontrada.");
    }
  };

  // ---- Editar ----
  const cargarParaEditar = async () => {
    if (!idTransaccion) {
      Alert.alert("Falta ID", "Ingresa el ID de la transacción a cargar.");
      return;
    }
    try {
      const t = await obtenerTransaccionPorId(Number(idTransaccion));
      // Prefill
      setUsuarioId(String(t.usuario_id ?? ""));
      setCuentaId(String(t.cuenta_id ?? ""));
      setCategoriaId(String(t.categoria_id ?? ""));
      setMonto(String(t.monto ?? ""));
      setTipo(t.tipo ?? "ingreso");
      setDescripcion(String(t.descripcion ?? ""));
      setResultado(t);
    } catch (err) {
      Alert.alert("Error", err?.detail || "No se pudo cargar la transacción.");
    }
  };

  const handleEditar = async () => {
    if (!idTransaccion) {
      Alert.alert("Falta ID", "Ingresa el ID de la transacción a editar.");
      return;
    }
    if (!usuarioId || !categoriaId || !monto || !tipo) {
      Alert.alert("Campos requeridos", "Usuario, categoría, monto y tipo son obligatorios.");
      return;
    }
    try {
      const payload = {
        usuario_id: Number(usuarioId),
        cuenta_id: cuentaId ? Number(cuentaId) : null,
        categoria_id: Number(categoriaId),
        monto: parseFloat(monto),
        tipo,
        descripcion,
        fecha: new Date().toISOString(), // si tu backend usa la que envías
      };
      const resp = await actualizarTransaccion(Number(idTransaccion), payload);
      setResultado(resp);
      Alert.alert("Éxito", "Transacción actualizada.");
      const todas = await obtenerTransacciones();
      setLista(todas);
      limpiarCampos();
    } catch (err) {
      Alert.alert("Error", err?.detail || "No se pudo actualizar la transacción.");
    }
  };

  // ---- Eliminar ----
  const handleEliminar = async () => {
    if (!idTransaccion) {
      Alert.alert("Falta ID", "Ingresa el ID de la transacción a eliminar.");
      return;
    }
    try {
      const resp = await eliminarTransaccion(Number(idTransaccion));
      Alert.alert("Éxito", resp?.message || "Transacción eliminada.");
      const todas = await obtenerTransacciones();
      setLista(todas);
      limpiarCampos();
    } catch (err) {
      Alert.alert("Error", err?.detail || "No se pudo eliminar la transacción.");
    }
  };

  // --- UI helpers ---
  const Tab = ({ value, label }) => (
    <TouchableOpacity
      onPress={() => {
        setModo(value);
        setResultado(null);
      }}
      style={[styles.tab, modo === value && styles.tabActive]}
    >
      <Text style={[styles.tabText, modo === value && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderResultado = () => {
    if (!resultado) return null;
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resultado</Text>
        <Text style={styles.cardText}>ID: {resultado.id}</Text>
        <Text style={styles.cardText}>Usuario: {resultado.usuario_id}</Text>
        <Text style={styles.cardText}>Cuenta: {resultado.cuenta_id ?? "—"}</Text>
        <Text style={styles.cardText}>Categoría: {resultado.categoria_id}</Text>
        <Text style={styles.cardText}>Tipo: {resultado.tipo}</Text>
        <Text style={styles.cardText}>Monto: ${Number(resultado.monto).toFixed(2)}</Text>
        <Text style={styles.cardText}>Desc: {resultado.descripcion || "—"}</Text>
        <Text style={styles.cardText}>Fecha: {new Date(resultado.fecha).toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <Tab value="crear" label="Crear" />
        <Tab value="buscar" label="Buscar por ID" />
        <Tab value="editar" label="Editar" />
        <Tab value="eliminar" label="Eliminar" />
      </View>

      {/* Formulario según modo */}
      {modo === "crear" && (
        <View>
          <Text style={styles.label}>Usuario ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 1"
            keyboardType="numeric"
            value={usuarioId}
            onChangeText={setUsuarioId}
          />

          <Text style={styles.label}>Cuenta ID (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 2"
            keyboardType="numeric"
            value={cuentaId}
            onChangeText={setCuentaId}
          />

          <Text style={styles.label}>Categoría ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 3"
            keyboardType="numeric"
            value={categoriaId}
            onChangeText={setCategoriaId}
          />

          <Text style={styles.label}>Monto *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={monto}
            onChangeText={setMonto}
          />

          <Text style={styles.label}>Tipo *</Text>
          <RNPicker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
            <RNPicker.Item label="Ingreso" value="ingreso" />
            <RNPicker.Item label="Egreso" value="egreso" />
          </RNPicker>

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input}
            placeholder="(opcional)"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <TouchableOpacity style={styles.button} onPress={handleCrear}>
            <Text style={styles.buttonText}>Crear</Text>
          </TouchableOpacity>
        </View>
      )}

      {modo === "buscar" && (
        <View>
          <Text style={styles.label}>ID de transacción</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 10"
            keyboardType="numeric"
            value={idTransaccion}
            onChangeText={setIdTransaccion}
          />
          <TouchableOpacity style={styles.button} onPress={handleBuscar}>
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>

          {renderResultado()}
        </View>
      )}

      {modo === "editar" && (
        <View>
          <Text style={styles.label}>ID de transacción *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 10"
            keyboardType="numeric"
            value={idTransaccion}
            onChangeText={setIdTransaccion}
          />
          <TouchableOpacity style={styles.buttonGhost} onPress={cargarParaEditar}>
            <Text style={styles.buttonGhostText}>Cargar datos</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Usuario ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 1"
            keyboardType="numeric"
            value={usuarioId}
            onChangeText={setUsuarioId}
          />

          <Text style={styles.label}>Cuenta ID (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 2"
            keyboardType="numeric"
            value={cuentaId}
            onChangeText={setCuentaId}
          />

          <Text style={styles.label}>Categoría ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 3"
            keyboardType="numeric"
            value={categoriaId}
            onChangeText={setCategoriaId}
          />

          <Text style={styles.label}>Monto *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={monto}
            onChangeText={setMonto}
          />

          <Text style={styles.label}>Tipo *</Text>
          <RNPicker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
            <RNPicker.Item label="Ingreso" value="ingreso" />
            <RNPicker.Item label="Egreso" value="egreso" />
          </RNPicker>

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input}
            placeholder="(opcional)"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <TouchableOpacity style={styles.button} onPress={handleEditar}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
          </TouchableOpacity>
        </View>
      )}

      {modo === "eliminar" && (
        <View>
          <Text style={styles.label}>ID de transacción *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 10"
            keyboardType="numeric"
            value={idTransaccion}
            onChangeText={setIdTransaccion}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#c82333" }]}
            onPress={handleEliminar}
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista rápida opcional para visualizar cambios */}
      {lista.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subTitle}>Transacciones (última carga)</Text>
          <FlatList
            data={lista}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>
                  #{item.id} • {item.tipo} • ${Number(item.monto).toFixed(2)}
                </Text>
                <Text style={styles.itemSub}>
                  Cat: {item.categoria_id} • User: {item.usuario_id}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  tabs: { flexDirection: "row", marginBottom: 16, gap: 8 },
  tab: { flex: 1, backgroundColor: "#1f1f1f", padding: 10, borderRadius: 8 },
  tabActive: { backgroundColor: "#0a5aa8" },
  tabText: { color: "#bbb", textAlign: "center", fontWeight: "600" },
  tabTextActive: { color: "#fff" },

  label: { color: "#ccc", marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#0a1f44",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  picker: {
    backgroundColor: "#0a1f44",
    color: "#fff",
    borderRadius: 8,
    marginBottom: 4,
  },

  button: {
    backgroundColor: "#0af",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 16,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },

  buttonGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0af",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
  },
  buttonGhostText: { color: "#0af", textAlign: "center", fontWeight: "bold" },

  subTitle: { color: "#eee", fontSize: 18, fontWeight: "bold", marginBottom: 8 },

  card: { backgroundColor: "#1b1b1b", padding: 12, borderRadius: 10, marginTop: 12 },
  cardTitle: { color: "#fff", fontWeight: "bold", marginBottom: 6 },
  cardText: { color: "#ddd", marginTop: 2 },

  item: { backgroundColor: "#1b1b1b", padding: 12, borderRadius: 8, marginBottom: 8 },
  itemText: { color: "#fff", fontWeight: "600" },
  itemSub: { color: "#aaa", marginTop: 2 },
});
