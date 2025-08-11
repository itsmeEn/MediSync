import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIMARY_COLOR = "#286660";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const API_URL =
        Platform.OS === "ios"
          ? "http://localhost:8000/api"
          : "http://10.0.2.2:8000/api";
      
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user data and token
        try {
          const userDataToSave = {
            full_name: data.profile?.full_name || "User",
            role: data.profile?.role || "patient",
            email: email,
            token: data.token,
            uid: data.uid,
          };
          await AsyncStorage.setItem('userData', JSON.stringify(userDataToSave));
          console.log('User data saved on login:', userDataToSave);
        } catch (error) {
          console.error('Error saving user data:', error);
        }

        // Redirect based on role
        const userRole = data.profile?.role || "patient";
        if (userRole === "doctor") {
          router.replace("/doctor/sidenav/doctor-dashboard");
        } else if (userRole === "nurse") {
          router.replace("/nurses/nurses-dashboard");
        } else {
          router.replace("/(tabs)/dashboard");
        }
      } else {
        let errorMessage = "Login failed. Please try again.";
        if (data && data.error) {
          errorMessage = data.error;
        }
        Alert.alert("Login Error", errorMessage);
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Network error during login:", error);
      Alert.alert(
        "Error",
        "Could not connect to the server. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Section - Background Image acting as Card.Img */}
      <ImageBackground
        source={require("../../assets/images/background.png")}
        style={styles.topSectionBackground}
        resizeMode="cover"
      >
        {/* Logo - position this over the background image if desired */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logoImage}
            />
          </View>
        </View>
      </ImageBackground>

      {/* Bottom Section - Form acting as Card.Body */}
      <View style={styles.bottomSection}>
        {/* Header (adjust positioning based on desired card-like effect) */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/auth/options')}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your registered email address"
            placeholderTextColor="#000000"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#000000"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              textContentType="password"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#000"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password</Text>
        </TouchableOpacity>

        {/* --- REMOVED TERMS AND SERVICE CHECKBOX HERE --- */}

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don&apos;t have an account? </Text>
          <TouchableOpacity
            onPress={() => router.replace("/auth/role-selection")}
          >
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSectionBackground: {
    flex: 1.5, // Increased significantly to give more space for the full image
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  bottomSection: {
    flex: 1, // Adjusted to work with the larger top section
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#bed2d0",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#bed2d0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#bed2d0",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#bed2d0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bed2d0",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#000",
  },
  eyeIcon: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#bed2d0",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#bed2d0",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20, // Adjusted margin since checkbox is gone
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: "bold",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "#bed2d0",
    fontSize: 14,
  },
  signupLink: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
