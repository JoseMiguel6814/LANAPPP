// 📂 src/components/CustomInput.js
import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function CustomInput({ placeholder, secureTextEntry, value, onChangeText }) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#ccc"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ff5c5c"
  }
});
