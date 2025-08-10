import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

export default function DoctorDashboard() {
  const navigation = useNavigation();
  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Ionicons name="menu" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.screenText}>Dashboard Screen</Text>
    </View>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7F9",
  },
  menuButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  screenText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
