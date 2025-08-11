import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type DrawerParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  PatientManagement: undefined;
  Messages: undefined;
  Reports: undefined;
  Settings: undefined;
  Logout: undefined;
};

const PRIMARY_COLOR = "#286660";

function HomeScreen() {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: "Total Patients", value: "0", icon: "users", color: "#4CAF50" },
    { title: "Today's Appointments", value: "0", icon: "calendar", color: "#2196F3" },
    { title: "Pending Reports", value: "0", icon: "file-text", color: "#FF9800" },
    { title: "Messages", value: "0", icon: "message-circle", color: "#9C27B0" },
  ]);

  const fetchTotalPatients = async () => {
    try {
      const API_URL = Platform.OS === "ios" ? "http://localhost:8000/api" : "http://10.0.2.2:8000/api";
      const response = await fetch(`${API_URL}/operations/queue/total/`);
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error("Error fetching total patients:", error);
      return 0;
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      const API_URL = Platform.OS === "ios" ? "http://localhost:8000/api" : "http://10.0.2.2:8000/api";
      const response = await fetch(`${API_URL}/operations/appointments/today/`);
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
      return 0;
    }
  };

  const fetchTotalQueues = async () => {
    try {
      const API_URL = Platform.OS === "ios" ? "http://localhost:8000/api" : "http://10.0.2.2:8000/api";
      const response = await fetch(`${API_URL}/operations/queue/total/`);
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error("Error fetching total queues:", error);
      return 0;
    }
  };

  const fetchMessages = async () => {
    try {
      const API_URL = Platform.OS === "ios" ? "http://localhost:8000/api" : "http://10.0.2.2:8000/api";
      const response = await fetch(`${API_URL}/communications/messages/total/`);
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return 0;
    }
  };

    const fetchRecentAppointments = async () => {
    try {
      // Use the correct backend URL based on platform
      const API_URL = Platform.OS === "ios" ? "http://localhost:8000/api" : "http://10.0.2.2:8000/api";
      const response = await fetch(`${API_URL}/operations/appointments/recent/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching recent appointments:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [appointments, totalPatients, todayAppointments, totalQueues, messages] = await Promise.all([
          fetchRecentAppointments(),
          fetchTotalPatients(),
          fetchTodayAppointments(),
          fetchTotalQueues(),
          fetchMessages()
        ]);

        setRecentAppointments(appointments);
        
        // Update stats with real data
        setStats([
          { title: "Total Patients", value: totalPatients.toString(), icon: "users", color: "#4CAF50" },
          { title: "Today's Appointments", value: todayAppointments.toString(), icon: "calendar", color: "#2196F3" },
          { title: "Pending Reports", value: totalQueues.toString(), icon: "file-text", color: "#FF9800" },
          { title: "Messages", value: messages.toString(), icon: "message-circle", color: "#9C27B0" },
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Fallback to mock data if API fails
        setRecentAppointments([
          { id: 1, patient: "John Doe", time: "09:00 AM", status: "Confirmed" },
          { id: 2, patient: "Jane Smith", time: "10:30 AM", status: "Pending" },
          { id: 3, patient: "Mike Johnson", time: "02:00 PM", status: "Confirmed" },
        ]);
        setStats([
          { title: "Total Patients", value: "156", icon: "users", color: "#4CAF50" },
          { title: "Today's Appointments", value: "8", icon: "calendar", color: "#2196F3" },
          { title: "Pending Reports", value: "12", icon: "file-text", color: "#FF9800" },
          { title: "Messages", value: "5", icon: "message-circle", color: "#9C27B0" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Dashboard</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Feather name="user" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <Feather name={stat.icon as any} size={24} color="#fff" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        {/* Recent Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Appointments</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Appointments' as never)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <Text style={styles.loadingText}>Loading appointments...</Text>
          ) : (
            recentAppointments.map((appointment: any) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.patientName}>{appointment.patient}</Text>
                  <Text style={styles.appointmentTime}>{appointment.time}</Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: appointment.status === "Confirmed" ? "#4CAF50" : "#FF9800" }
                ]}>
                  <Text style={styles.statusText}>{appointment.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Appointments' as never)}
            >
              <Feather name="calendar" size={24} color={PRIMARY_COLOR} />
              <Text style={styles.actionText}>Schedule Appointment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PatientManagement' as never)}
            >
              <Feather name="users" size={24} color={PRIMARY_COLOR} />
              <Text style={styles.actionText}>Manage Patients</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Messages' as never)}
            >
              <Feather name="message-circle" size={24} color={PRIMARY_COLOR} />
              <Text style={styles.actionText}>Messages</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Reports' as never)}
            >
              <Feather name="bar-chart-2" size={24} color={PRIMARY_COLOR} />
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function AppointmentsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.centerContent}>
        <Text style={styles.centerText}>Appointments Screen</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go back home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PatientManagementScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Management</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Feather name="user" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.centerContent}>
        <Text style={styles.centerText}>Patient Management Screen</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go back home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MessagesScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Feather name="user" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.centerContent}>
        <Text style={styles.centerText}>Messages Screen</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go back home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ReportsScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Feather name="user" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.centerContent}>
        <Text style={styles.centerText}>Reports Screen</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go back home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SettingsScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Feather name="user" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.centerContent}>
        <Text style={styles.centerText}>Settings Screen</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go back home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function LogoutScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Logout</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Feather name="user" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.centerContent}>
        <Text style={styles.centerText}>Logout Screen</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go back home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Export the main dashboard component that will be used by the drawer
export default function DoctorDashboard() {
  return <HomeScreen />;
}

// Export individual screen components for the drawer
export { 
  HomeScreen, 
  AppointmentsScreen, 
  PatientManagementScreen, 
  MessagesScreen, 
  ReportsScreen, 
  SettingsScreen, 
  LogoutScreen 
};

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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileButton: {
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
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  centerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  appointmentTime: {
    fontSize: 14,
    color: "#666",
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
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "500",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingVertical: 20,
  },
});