// app/(main)/(tabs)/account-settings.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AccountSettingsScreen() {
  // Changed component name
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Settings</Text> {/* Changed text */}
      {/* Your account settings content will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
