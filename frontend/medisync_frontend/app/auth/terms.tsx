import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const PRIMARY_COLOR = "#286660";

export default function TermsScreen() {
  return (
    //katumabas neto sa html div
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        {/* katumbas neto sa html parahgraph, h1 and h2*/}
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Terms and Conditions</Text>
        
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing and using MediSync, you accept and agree to be bound by the terms and provision of this agreement.
        </Text>

        <Text style={styles.sectionTitle}>2. Use License</Text>
        <Text style={styles.paragraph}>
          Permission is granted to temporarily download one copy of the app for personal, non-commercial transitory viewing only.
        </Text>

        <Text style={styles.sectionTitle}>3. Privacy Policy</Text>
        <Text style={styles.paragraph}>
          Your privacy is important to us. Our privacy policy explains how we collect, use, and protect your information.
        </Text>

        <Text style={styles.sectionTitle}>4. Medical Disclaimer</Text>
        <Text style={styles.paragraph}>
          MediSync is not a substitute for professional medical advice. Always consult with qualified healthcare providers.
        </Text>

        <Text style={styles.sectionTitle}>5. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
        </Text>

        <Text style={styles.sectionTitle}>6. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate security measures to protect your personal and medical information.
        </Text>

        <Text style={styles.sectionTitle}>7. Modifications</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. Continued use of the app constitutes acceptance of changes.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact Information</Text>
        <Text style={styles.paragraph}>
          For questions about these terms, please contact us at support@medisync.com
        </Text>
      </ScrollView>

      {/* Accept Button */}
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => {
          // Navigate to signup with terms accepted parameter so the checkbox auto-checks
          router.replace({
            pathname: "/auth/signup",
            params: { termsAccepted: "true" },
          } as any);
        }}
      >
        <Text style={styles.acceptButtonText}>I Accept Terms</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 15,
  },
  acceptButton: {
    backgroundColor: PRIMARY_COLOR,
    margin: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});