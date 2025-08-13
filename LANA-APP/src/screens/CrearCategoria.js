// 📂 src/screens/CrudCategoriasScreen.js
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
  listarCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../api/categoriasApi";

export default function CrudCategoriasScreen() {
  const [modo, setModo] = useState("crear"); // crear | listar | editar | eliminar

  // Campos comunes
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("egreso");
  const [categoriaPadreId, setCategoriaPadreId] = useState("");

  // Listado / filtros (solo tipo)
  const [filtroTipo, setFiltroTipo] = useState("");
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(false);

  const limpiarCampos = () => {
    setId("");
    setNombre("");
    setTipo("egreso");
    setCategoriaPadreId("");
  };

  const safeNumber = (v) => (v !== "" && v != null ? Number(v) : undefined);

  // ------ Crear ------
  const handleCrear = async () => {
    if (!nombre.trim()) {
      Alert.alert("Campos requeridos", "El nombre es obligatorio.");
      return;
    }
    try {
      await crearCategoria({
        nombre: nombre.trim(),
        tipo: String(tipo).toLowerCase(),
        categoria_padre_id: safeNumber(categoriaPadreId),
      });
      Alert.alert("Éxito", "Categoría creada correctamente.");
      limpiarCampos();
      if (modo === "listar") handleListar(); // refresca si estás en listar
    } catch (e) {
      Alert.alert("Error", e?.message || "No se pudo crear la categoría.");
    }
  };

  // ------ Listar ------
  const handleListar = async () => {
    try {
      setCargando(true);
      const filtros = {
        tipo: filtroTipo || undefined, // "ingreso" | "egreso"
      };
      const data = await listarCategorias(filtros);
      setLista(data);
    } catch (e) {
      Alert.alert("Error", e?.message || "No se pudieron listar las categorías.");
    } finally {
      setCargando(false);
    }
  };

  // ------ Cargar para editar ------
  const cargarParaEditar = async () => {
    if (!id) {
      Alert.alert("Falta ID", "Ingresa el ID a editar.");
      return;
    }
    try {
      const c = await obtenerCategoriaPorId(Number(id));
      setNombre(c.nombre || "");
      setTipo((c.tipo || "egreso").toLowerCase());
      setCategoriaPadreId(c.categoria_padre_id ? String(c.categoria_padre_id) : "");
      Alert.alert("Listo", "Datos cargados. Edita y guarda.");
    } catch (e) {
      Alert.alert("Error", e?.message || "No se pudo cargar la categoría.");
    }
  };

  // ------ Editar ------
  const handleEditar = async () => {
    if (!id) {
      Alert.alert("Falta ID", "Ingresa el ID a editar.");
      return;
    }
    if (!nombre.trim()) {
      Alert.alert("Campos requeridos", "El nombre es obligatorio.");
      return;
    }
    try {
      await actualizarCategoria(Number(id), {
        nombre: nombre.trim(),
        tipo: String(tipo).toLowerCase(),
        categoria_padre_id: safeNumber(categoriaPadreId),
      });
      Alert.alert("Éxito", "Categoría actualizada.");
      limpiarCampos();
      if (modo === "listar") handleListar();
    } catch (e) {
      Alert.alert("Error", e?.message || "No se pudo actualizar la categoría.");
    }
  };

  // ------ Eliminar ------
  const handleEliminar = async () => {
    if (!id) {
      Alert.alert("Falta ID", "Ingresa el ID a eliminar.");
      return;
    }
    try {
      await eliminarCategoria(Number(id));
      Alert.alert("Éxito", "Categoría eliminada.");
      setId("");
      if (modo === "listar") handleListar();
    } catch (e) {
      Alert.alert("Error", e?.message || "No se pudo eliminar la categoría.");
    }
  };

  const Tab = ({ value, label }) => (
    <TouchableOpacity
      onPress={() => setModo(value)}
      style={[styles.tab, modo === value && styles.tabActive]}
    >
      <Text style={[styles.tabText, modo === value && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <Tab value="crear" label="Crear" />
        <Tab value="listar" label="Listar" />
        <Tab value="editar" label="Editar" />
        <Tab value="eliminar" label="Eliminar" />
      </View>

      {/* Crear */}
      {modo === "crear" && (
        <View>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Comida"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Tipo *</Text>
          <RNPicker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
            <RNPicker.Item label="Egreso" value="egreso" />
            <RNPicker.Item label="Ingreso" value="ingreso" />
          </RNPicker>

          <Text style={styles.label}>Categoría padre ID (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 3"
            keyboardType="numeric"
            value={categoriaPadreId}
            onChangeText={setCategoriaPadreId}
          />

          <TouchableOpacity style={styles.button} onPress={handleCrear} disabled={cargando}>
            <Text style={styles.buttonText}>{cargando ? "Procesando…" : "Crear"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Listar */}
      {modo === "listar" && (
        <View>
          <Text style={styles.label}>Filtro tipo (opcional)</Text>
          <RNPicker
            selectedValue={filtroTipo}
            onValueChange={setFiltroTipo}
            style={styles.picker}
          >
            <RNPicker.Item label="Todos" value="" />
            <RNPicker.Item label="Egreso" value="egreso" />
            <RNPicker.Item label="Ingreso" value="ingreso" />
          </RNPicker>

          <TouchableOpacity style={styles.button} onPress={handleListar} disabled={cargando}>
            <Text style={styles.buttonText}>{cargando ? "Cargando…" : "Listar"}</Text>
          </TouchableOpacity>

          {lista.length > 0 && (
            <View style={{ marginTop: 14 }}>
              <Text style={styles.subTitle}>Resultados</Text>
              <FlatList
                data={lista}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text style={styles.itemText}>
                      #{item.id} • {item.nombre} ({item.tipo})
                    </Text>
                    <Text style={styles.itemSub}>
                      padre: {item.categoria_padre_id ?? "—"}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      )}

      {/* Editar */}
      {modo === "editar" && (
        <View>
          <Text style={styles.label}>ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 10"
            keyboardType="numeric"
            value={id}
            onChangeText={setId}
          />

          <TouchableOpacity style={styles.buttonGhost} onPress={cargarParaEditar} disabled={cargando}>
            <Text style={styles.buttonGhostText}>Cargar datos</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Alimentos"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Tipo *</Text>
          <RNPicker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
            <RNPicker.Item label="Egreso" value="egreso" />
            <RNPicker.Item label="Ingreso" value="ingreso" />
          </RNPicker>

          <Text style={styles.label}>Categoría padre ID (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 3"
            keyboardType="numeric"
            value={categoriaPadreId}
            onChangeText={setCategoriaPadreId}
          />

          <TouchableOpacity style={styles.button} onPress={handleEditar} disabled={cargando}>
            <Text style={styles.buttonText}>{cargando ? "Guardando…" : "Guardar cambios"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Eliminar */}
      {modo === "eliminar" && (
        <View>
          <Text style={styles.label}>ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 10"
            keyboardType="numeric"
            value={id}
            onChangeText={setId}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#c82333" }]}
            onPress={handleEliminar}
            disabled={cargando}
          >
            <Text style={styles.buttonText}>{cargando ? "Eliminando…" : "Eliminar"}</Text>
          </TouchableOpacity>
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

  subTitle: { color: "#eee", fontSize: 18, fontWeight: "bold", marginTop: 12, marginBottom: 8 },

  item: { backgroundColor: "#1b1b1b", padding: 12, borderRadius: 8, marginBottom: 8 },
  itemText: { color: "#fff", fontWeight: "600" },
  itemSub: { color: "#aaa", marginTop: 2 },
});
