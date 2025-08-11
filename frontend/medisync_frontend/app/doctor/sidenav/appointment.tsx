import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const PRIMARY_COLOR = "#286660";

export default function AppointmentScreen() {
  const appointments = [
    { id: 1, patient: "John Doe", time: "09:00 AM", date: "Today", status: "Confirmed", type: "Consultation" },
    { id: 2, patient: "Jane Smith", time: "10:30 AM", date: "Today", status: "Pending", type: "Follow-up" },
    { id: 3, patient: "Mike Johnson", time: "02:00 PM", date: "Today", status: "Confirmed", type: "Emergency" },
    { id: 4, patient: "Sarah Wilson", time: "09:00 AM", date: "Tomorrow", status: "Confirmed", type: "Consultation" },
    { id: 5, patient: "David Brown", time: "11:00 AM", date: "Tomorrow", status: "Pending", type: "Follow-up" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.patientName}>{appointment.patient}</Text>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: appointment.status === "Confirmed" ? "#4CAF50" : "#FF9800" }
              ]}>
                <Text style={styles.statusText}>{appointment.status}</Text>
              </View>
            </View>
            
            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <Feather name="calendar" size={16} color="#666" />
                <Text style={styles.detailText}>{appointment.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Feather name="clock" size={16} color="#666" />
                <Text style={styles.detailText}>{appointment.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <Feather name="file-text" size={16} color="#666" />
                <Text style={styles.detailText}>{appointment.type}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="phone" size={16} color={PRIMARY_COLOR} />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="message-circle" size={16} color={PRIMARY_COLOR} />
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="edit" size={16} color={PRIMARY_COLOR} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: PRIMARY_COLOR,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  appointmentDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  actionButtonText: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    marginLeft: 4,
    fontWeight: "500",
  },
});


