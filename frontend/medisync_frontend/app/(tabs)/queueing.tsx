// app/(main)/(tabs)/queueing.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const QueueingScreen = () => {
  // Changed component name
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Queueing</Text> {/* Changed text */}
      {/* Your queueing content will go here */}
    </View>
  );
}

export default QueueingScreen;

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
