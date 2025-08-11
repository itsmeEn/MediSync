import React from "react";
import { View, Text, StyleSheet } from "react-native";

function Analytics() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Analytics</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 24, fontWeight: "bold" },
});


export default Analytics;