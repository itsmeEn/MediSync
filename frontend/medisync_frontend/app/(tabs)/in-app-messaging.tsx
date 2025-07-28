// app/(main)/(tabs)/in-app-messaging.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InAppMessagingScreen() {
  // Changed component name
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Messages</Text> {/* Changed text */}
      {/* Your messaging content will go here */}
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
