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
  Switch,
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
  const [usuarioId, setUsuarioId] = useState("");
  const [categoriaPadreId, setCategoriaPadreId] = useState("");
  const [esSistema, setEsSistema] = useState(false);

  // Listado / filtros
  const [filtroUsuarioId, setFiltroUsuarioId] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(false);

  const limpiarCampos = () => {
    setId("");
    setNombre("");
    setTipo("egreso");
    setUsuarioId("");
    setCategoriaPadreId("");
    setEsSistema(false);
  };

  // ------ Crear ------
  const handleCrear = async () => {
    if (!nombre.trim()) {
      Alert.alert("Campos requeridos", "El nombre es obligatorio.");
      return;
    }
    try {
      const payload = {
        nombre: nombre.trim(),
        tipo,
        usuario_id: usuarioId ? Number(usuarioId) : null,
        categoria_padre_id: categoriaPadreId ? Number(categoriaPadreId) : null,
        es_sistema: esSistema,
      };
      await crearCategoria(payload);
      Alert.alert("Éxito", "Categoría creada correctamente.");
      limpiarCampos();
    } catch (e) {
      Alert.alert("Error", e?.detail || "No se pudo crear la categoría.");
    }
  };

  // ------ Listar ------
  const handleListar = async () => {
    try {
      setCargando(true);
      const filtros = {
        usuario_id: filtroUsuarioId || undefined,
        tipo: filtroTipo || undefined,
      };
      const data = await listarCategorias(filtros);
      setLista(data);
    } catch (e) {
      Alert.alert("Error", e?.detail || "No se pudieron listar las categorías.");
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
      setUsuarioId(c.usuario_id ? String(c.usuario_id) : "");
      setCategoriaPadreId(c.categoria_padre_id ? String(c.categoria_padre_id) : "");
      setEsSistema(Boolean(c.es_sistema));
      Alert.alert("Listo", "Datos cargados. Edita y guarda.");
    } catch (e) {
      Alert.alert("Error", e?.detail || "No se pudo cargar la categoría.");
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
      const payload = {
        nombre: nombre.trim(),
        tipo,
        usuario_id: usuarioId ? Number(usuarioId) : null,
        categoria_padre_id: categoriaPadreId ? Number(categoriaPadreId) : null,
        es_sistema: esSistema,
      };
      await actualizarCategoria(Number(id), payload);
      Alert.alert("Éxito", "Categoría actualizada.");
      limpiarCampos();
    } catch (e) {
      Alert.alert("Error", e?.detail || "No se pudo actualizar la categoría.");
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
    } catch (e) {
      Alert.alert("Error", e?.detail || "No se pudo eliminar la categoría.");
    }
  };

  const Tab = ({ value, label }) => (
    <TouchableOpacity
      onPress={() => {
        setModo(value);
      }}
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

          <Text style={styles.label}>Usuario ID (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 1"
            keyboardType="numeric"
            value={usuarioId}
            onChangeText={setUsuarioId}
          />

          <Text style={styles.label}>Categoría padre ID (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 3"
            keyboardType="numeric"
            value={categoriaPadreId}
            onChangeText={setCategoriaPadreId}
          />

          <View style={styles.row}>
            <Text style={styles.labelInline}>¿Es del sistema?</Text>
            <Switch value={esSistema} onValueChange={setEsSistema} />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCrear}>
            <Text style={styles.buttonText}>Crear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Listar */}
      {modo === "listar" && (
        <View>
          <Text style={styles.label}>Filtro usuario_id (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 1"
            keyboardType="numeric"
            value={filtroUsuarioId}
            onChangeText={setFiltroUsuarioId}
          />

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

          <TouchableOpacity style={styles.button} onPress={handleListar}>
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
                      usuario_id: {item.usuario_id ?? "—"} • padre: {item.categoria_padre_id ?? "—"} • sistema:{" "}
                      {item.es_sistema ? "sí" : "no"}
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

          <TouchableOpacity style={styles.buttonGhost} onPress={cargarParaEditar}>
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

          <Text style={styles.label}>Usuario ID (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 1"
            keyboardType="numeric"
            value={usuarioId}
            onChangeText={setUsuarioId}
          />

          <Text style={styles.label}>Categoría padre ID (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 3"
            keyboardType="numeric"
            value={categoriaPadreId}
            onChangeText={setCategoriaPadreId}
          />

          <View style={styles.row}>
            <Text style={styles.labelInline}>¿Es del sistema?</Text>
            <Switch value={esSistema} onValueChange={setEsSistema} />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleEditar}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
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
          >
            <Text style={styles.buttonText}>Eliminar</Text>
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
  labelInline: { color: "#ccc", marginRight: 10 },
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

  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },

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
