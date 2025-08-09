// 📂 src/components/CustomButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff5c5c",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
