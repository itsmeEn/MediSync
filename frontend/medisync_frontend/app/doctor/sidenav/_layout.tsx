import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform, Alert } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screen components
import { 
  HomeScreen, 
  AppointmentsScreen, 
  PatientManagementScreen, 
  MessagesScreen, 
  ReportsScreen, 
  SettingsScreen, 
  LogoutScreen 
} from './doctor-dashboard';

const Drawer = createDrawerNavigator();

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    fullName: "Full Name",
    role: "User Role"
  });

  // Load user data and profile image on component mount
  useEffect(() => {
    loadUserData();
    loadProfileImage();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        setUserData({
          fullName: parsedData.full_name || "Full Name",
          role: parsedData.role || "User Role"
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        setProfileImage(image.uri);
        
        // Save profile image to AsyncStorage
        try {
          await AsyncStorage.setItem('profileImage', image.uri);
        } catch (error) {
          console.error('Error saving profile image:', error);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image picker error:', error);
    }
  };

  return (
    <View style={styles.sidebar}>
      {/* Logo positioned at upper left corner */}
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
      </View>

      {/* Profile section below logo */}
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Feather name="user" size={30} color="#666" />
            </View>
          )}
          <View style={styles.editIconContainer}>
            <Feather name="camera" size={12} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.profileName}>{userData.fullName}</Text>
        <Text style={styles.profileRole}>{userData.role}</Text>
      </View>

      {/* Navigation items */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Sign out button at bottom */}
      <View style={styles.signoutContainer}>
        <TouchableOpacity 
          style={styles.signoutButton}
          onPress={async () => {
            try {
              // Clear user data and profile image on sign out
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('profileImage');
              console.log('User data cleared on sign out');
            } catch (error) {
              console.error('Error clearing user data:', error);
            }
            router.replace("/auth/options");
          }}
        >
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
    <NavigationIndependentTree>
      <NavigationContainer>
        <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
          headerShown: false,
          drawerStyle: { 
            width: dimensions.width >= 768 ? 250 : "80%",
            backgroundColor: "#FFFFFF",
            borderRightWidth: 1,
            borderRightColor: "#EBEBEB",
          },
          drawerActiveBackgroundColor: "#007AFF",
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#666",
        }}
      >
        <Drawer.Screen 
          name="Dashboard" 
          component={HomeScreen}
          options={{ 
            title: "Dashboard",
            drawerIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Appointments" 
          component={AppointmentsScreen}
          options={{ 
            title: "Appointments",
            drawerIcon: ({ color, size }) => (
              <Feather name="calendar" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="PatientManagement" 
          component={PatientManagementScreen}
          options={{ 
            title: "Patient Management",
            drawerIcon: ({ color, size }) => (
              <Feather name="users" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Messages" 
          component={MessagesScreen}
          options={{ 
            title: "Messages",
            drawerIcon: ({ color, size }) => (
              <Feather name="message-circle" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Reports" 
          component={ReportsScreen}
          options={{ 
            title: "Reports",
            drawerIcon: ({ color, size }) => (
              <Feather name="bar-chart-2" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ 
            title: "Settings",
            drawerIcon: ({ color, size }) => (
              <Feather name="settings" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Logout" 
          component={LogoutScreen}
          options={{ 
            title: "Logout",
            drawerIcon: ({ color, size }) => (
              <Feather name="log-out" size={size} color={color} />
            ),
          }} 
        />
      </Drawer.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRightWidth: 1,
    borderRightColor: "#EBEBEB",
    paddingVertical: 20,
  },
  logoContainer: { 
    marginBottom: 20, 
    paddingHorizontal: 20,
    alignItems: "flex-start" 
  },
  logo: { 
    width: 120, 
    height: 24, 
    resizeMode: "contain" 
  },
  profileContainer: {
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    width: "100%",
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 30,
  },
  profileImagePlaceholder: {
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: "#eee",
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  profileRole: { 
    fontSize: 14, 
    color: "#666",
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  drawerScroll: { 
    alignSelf: "stretch", 
    paddingHorizontal: 8 
  },
  navText: { 
    fontSize: 16, 
    marginLeft: 15, 
    color: "#666" 
  },
  signoutContainer: {
    width: "100%",
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#EBEBEB",
    paddingTop: 10,
  },
  signoutButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 15, 
    borderRadius: 8 
  },
});

