import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from "react-native";
import { Drawer } from "expo-router/drawer";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  return (
    <View style={styles.sidebar}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: "https://via.placeholder.com/150x30" }} style={styles.logo} />
      </View>

      <View style={styles.profileContainer}>
        <Image source={{ uri: "https://via.placeholder.com/60" }} style={styles.profileImage} />
        <Text style={styles.profileName}>User Name</Text>
        <Text style={styles.profileRole}>User Role</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.signoutContainer}>
        <TouchableOpacity style={styles.signoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#666" />
          <Text style={styles.navText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Layout() {
  const dimensions = useWindowDimensions();
  return (
    <Drawer
      defaultStatus={Platform.OS === "web" ? "open" : undefined}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType:
          Platform.OS === "web"
            ? "permanent"
            : dimensions.width >= 768
            ? "permanent"
            : "front",
        headerShown: false,
        drawerStyle: { width: dimensions.width >= 768 ? 250 : "80%" },
        drawerActiveBackgroundColor: "#007AFF",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#666",
      }}
    />
  );
}

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRightWidth: 1,
    borderRightColor: "#EBEBEB",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: { marginBottom: 20, alignItems: "center" },
  logo: { width: 150, height: 30, resizeMode: "contain" },
  profileContainer: {
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    width: "100%",
  },
  profileImage: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#eee" },
  profileName: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  profileRole: { fontSize: 14, color: "#666" },
  drawerScroll: { alignSelf: "stretch", paddingHorizontal: 8 },
  navText: { fontSize: 16, marginLeft: 15, color: "#666" },
  signoutContainer: {
    width: "100%",
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#EBEBEB",
    paddingTop: 10,
  },
  signoutButton: { flexDirection: "row", alignItems: "center", padding: 15, borderRadius: 8 },
});

