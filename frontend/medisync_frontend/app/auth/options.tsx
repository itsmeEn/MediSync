import React from "react";
import { LinearGradient } from "expo-linear-gradient"; // Make sure you've run 'npx expo install expo-linear-gradient'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { router } from "expo-router"; //using Expo Router for navigation
import { SafeAreaView } from "react-native-safe-area-context";

// Google logo URL (from your original code)
const googleLogo = require("../../assets/images/google.png");

// Get screen dimensions for potential responsive sizing if needed later
const { width, height } = Dimensions.get("window");

const OptionsScreen: React.FC = () => {
  // Handler for Login button press
  const handleLogin = () => {
    // Navigate to the 'login' route
    router.push("/auth/login" as any); 
  };

  // Handler for Create an account button press
  const handleSignup = () => {
    // Navigate to the 'signup' route
    router.push("/auth/role-selection" as any); // 'as any' might be needed
  };

  // Handler for Continue using Google button press
  const handleGoogleLogin = () => {
    // Implement Google login authentication logic here.
    // This will typically involve using a library like 'expo-auth-session'
    // or 'expo-google-sign-in' and connecting to your Django backend.
    console.log("Google login pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top section wrapper with a SOLID WHITE background */}
      <View style={styles.circleWrapper}>
        {/* The Circle component, now with the LinearGradient applied directly to it */}
        <LinearGradient
          // These colors define the gradient that will appear INSIDE the circle
          colors={["rgba(190,210,208,0.87)", "rgba(254,255,255,0.87)"]} // Light green/blue to almost white
          start={[0.5, 0]} // Gradient starts at the top-center of the circle
          end={[0.5, 1]} // Gradient ends at the bottom-center of the circle
          style={styles.circle} // Apply the styles for size, shape, and shadow to the LinearGradient component itself
        >
          {/* Logo positioned inside the circle */}
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </LinearGradient>
      </View>

      {/* Bottom Sheet containing login options */}
      <View style={styles.bottomSheet}>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or</Text>
        <TouchableOpacity style={styles.createBtn} onPress={handleSignup}>
          <Text style={styles.createBtnText}>Create an account</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or Continue with</Text>
        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
          {/* Image source from local assets */}
          <Image source={googleLogo} style={styles.googleIcon} />
          <Text style={styles.googleBtnText}>Continue using Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// StyleSheet for the component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full height of the screen
    backgroundColor: "#ffffff", // Main background color for the whole screen
  },
  circleWrapper: {
    flex: 1.2, // This section takes 1.2 parts of the available vertical space
    alignItems: "center", // Center content horizontally
    justifyContent: "flex-end", // Push content to the bottom of this wrapper
    width: "100%", // Take full width
    backgroundColor: "#FFFFFF", // Solid white background for the area above the bottom sheet
  },
  circle: {
    width: 240, // Reduced width for the circle
    height: 240, // Reduced height for the circle
    marginTop: 50,
    borderRadius: 120, // Makes it a perfect circle (half of width/height)
    // backgroundColor is now controlled by LinearGradient's 'colors' prop
    marginBottom: 24, // Space below the circle before the bottom sheet
    shadowColor: "#000", // iOS shadow color
    shadowOffset: {
      width: 0,
      height: 8,
    }, // iOS shadow offset
    shadowOpacity: 0.1, // iOS shadow opacity
    shadowRadius: 32, // iOS shadow blur radius
    elevation: 5, // Android shadow
  },
  bottomSheet: {
    flex: 1, // Takes 1 part of the available vertical space
    backgroundColor: "#286660", // Dark green background for the bottom sheet
    width: "100%", // Take full width
    borderTopLeftRadius: 48, // Rounded top-left corner
    borderTopRightRadius: 48, // Rounded top-right corner
    padding: 32, // Internal padding
    minHeight: 350, // Minimum height for the bottom sheet
    alignItems: "center", // Center content horizontally within the sheet
  },
  loginBtn: {
    width: "100%",
    maxWidth: 320, // Max width for responsiveness on larger screens/tablets
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#bed2d0",
    backgroundColor: "#4c8479",
    marginTop: 30,
    marginBottom: 4,
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "400", // Font weight as a string in RN
  },
  orText: {
    color: "#fff",
    marginVertical: 4, // Vertical margin
    fontSize: 16,
    fontWeight: "300",
  },
  createBtn: {
    width: "100%",
    maxWidth: 320,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#bed2d0",
    marginBottom: 4,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  createBtnText: {
    color: "#286660",
    fontSize: 19,
    fontWeight: "400",
  },
  googleBtn: {
    width: "100%",
    maxWidth: 320,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#bed2d0",
    flexDirection: "row", // Arrange children (icon and text) in a row
    alignItems: "center", // Align items vertically in the center
    justifyContent: "center", // Center items horizontally
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  googleBtnText: {
    color: "#286660",
    fontSize: 18,
    fontWeight: "400",
    marginLeft: 14, // Space between icon and text
  },
  googleIcon: {
    width: 26,
    height: 26,
    backgroundColor: "#fff",
    borderRadius: 13, // Makes it circular
    // Note: 'padding' on Image might not work as expected to add space around the image within its bounds.
    // If you need space around the icon, consider wrapping the Image in a View and applying padding to the View.
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 20, // Adjusted to better center the logo in the smaller circle
  },
});

export default OptionsScreen;