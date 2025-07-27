import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
  Alert,
  Modal, // Import Modal for iOS date picker
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker"; // Import date picker
import { Picker } from "@react-native-picker/picker"; // Import picker for dropdown

const PRIMARY_COLOR = "#286660";
const ACCENT_COLOR = "#bed2d0"; // Not directly used in styling but kept for reference
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SignupScreen() {
  const { role = "patient" } = useLocalSearchParams(); // Default to 'patient' in lowercase
  const selectedRole = String(role).toLowerCase(); // Ensure role is lowercase for comparisons

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined); // Store as Date object
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility
  const [gender, setGender] = useState(""); // Default gender for picker
  const [showGenderPicker, setShowGenderPicker] = useState(false); // State to control gender picker visibility

  const [address, setAddress] = useState("");
  const [password, setPassword] = useState(""); // Changed password1 to password
  const [password2, setPassword2] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // New states for conditional fields (e.g., for 'doctor' or 'nurse')
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");
  const [specialty, setSpecialty] = useState("");

  // --- Date Picker Handlers ---
  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === "ios"); // On iOS, keep true to show modal
    setDateOfBirth(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const getFormattedDate = (date?: Date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // --- Signup Handler ---
  const handleSignup = async () => {
    setLoading(true);

    // Basic frontend validation
    if (
      !email ||
      !firstName ||
      !lastName ||
      !password ||
      !password2 ||
      !gender ||
      !dateOfBirth
    ) {
      Alert.alert(
        "Error",
        "Please fill in all required fields: Email, Name, Password, Gender, Date of Birth."
      );
      setLoading(false);
      return;
    }
    if (password !== password2) {
      Alert.alert("Error", "Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!agree) {
      Alert.alert("Error", "Please agree to the terms and service.");
      setLoading(false);
      return;
    }

    const payload = {
      username: email.split("@")[0], // Using email prefix as username for simplicity, adjust as needed
      email: email,
      password: password,
      password2: password2, // Backend expects this for confirmation
      role: selectedRole,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      date_of_birth: getFormattedDate(dateOfBirth), // Send formatted date
      gender: gender,
      address: address,
      // Include conditional fields if applicable
      ...((selectedRole === "doctor" || selectedRole === "nurse") && {
        medical_license_number: medicalLicenseNumber,
      }),
      ...(selectedRole === "doctor" && {
        specialty: specialty,
      }),
    };

    try {
      const API_URL =
        Platform.OS === "ios"
          ? "http://localhost:8000/api"
          : "http://10.0.2.2:8000/api";
      const response = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Registration successful! Please log in.");
        console.log("Registration data:", data);
        // Redirect based on role
        if (selectedRole === "doctor") {
          router.replace("/doctor-dashboard" as any); // Or '/(tabs)/doctor-dashboard' depending on your file structure
        } else if (selectedRole === "nurse") {
          router.replace("/nurse-dashboard" as any); // Or '/(tabs)/nurse-dashboard'
        } else {
          router.replace("/(tabs)/home" as any); // Default patient dashboard/home after login
        }
      } else {
        let errorMessage = "Registration failed. Please try again.";
        if (data && data.error) {
          errorMessage = data.error;
        } else if (data && typeof data === "object") {
          errorMessage = Object.entries(data)
            .map(([key, value]) => {
              return `${key}: ${(value as string[]).join(", ")}`;
            })
            .join("\n");
        }
        Alert.alert("Registration Error", errorMessage);
        console.error("Registration failed:", data);
      }
    } catch (error) {
      console.error("Network error or unexpected error during signup:", error);
      Alert.alert(
        "Error",
        "Could not connect to the server. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.bg}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerDots}>•••</Text>
        <Text style={styles.headerTitle}>Sign Up</Text>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => router.replace("/auth/login")}
        >
          <Feather name="x" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Card */}
      <LinearGradient
        colors={["#e6f2ef", "#f8fbfa"]}
        start={[0, 0]}
        end={[0, 1]}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>Create your account</Text>
        {/* Role label */}
        <View style={styles.labelGroup}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.roleLabel}>
            {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
          </Text>
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#28666099"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#28666099"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#28666099"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#28666099"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Gender and Date of Birth side by side */}
        <View style={styles.rowInputs}>
          {/* Gender Picker */}
          <TouchableOpacity
            style={[
              styles.inputGroup,
              styles.pickerTrigger,
              { flex: 1, marginRight: 8 },
            ]}
            onPress={() => setShowGenderPicker(true)}
          >
            <Text
              style={[
                styles.input,
                { color: gender ? PRIMARY_COLOR : "#28666099" },
              ]}
            >
              {gender || "Select Gender"}
            </Text>
            <Feather name="chevron-down" size={20} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Modal
            transparent={true}
            visible={showGenderPicker}
            animationType="slide"
            onRequestClose={() => setShowGenderPicker(false)}
          >
            <View style={styles.pickerModalOverlay}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => {
                    setGender(itemValue);
                    if (Platform.OS === "android") setShowGenderPicker(false); // Close immediately on Android
                  }}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item
                    label="Select Gender"
                    value=""
                    enabled={false}
                    style={styles.placeholderItem}
                  />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Non-binary" value="non-binary" />
                </Picker>
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    onPress={() => setShowGenderPicker(false)}
                    style={styles.pickerDoneButton}
                  >
                    <Text style={styles.pickerDoneButtonText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Modal>

          {/* Date of Birth Picker */}
          <TouchableOpacity
            style={[
              styles.inputGroup,
              styles.pickerTrigger,
              { flex: 1, marginLeft: 8 },
            ]}
            onPress={showDatepicker}
          >
            <Text
              style={[
                styles.input,
                { color: dateOfBirth ? PRIMARY_COLOR : "#28666099" },
              ]}
            >
              {getFormattedDate(dateOfBirth) || "Date of Birth (YYYY-MM-DD)"}
            </Text>
            <Feather name="calendar" size={20} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={dateOfBirth || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"} // 'spinner' for iOS, 'default' for Android
              onChange={onChangeDate}
              maximumDate={new Date()} // Cannot select future dates
            />
          )}
          {/* For iOS, you typically wrap DateTimePicker in a Modal */}
          {Platform.OS === "ios" && showDatePicker && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.pickerModalOverlay}>
                <View style={styles.iosDatePickerContainer}>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.pickerDoneButton}
                  >
                    <Text style={styles.pickerDoneButtonText}>Done</Text>
                  </TouchableOpacity>
                  <DateTimePicker
                    testID="dateTimePickeriOS"
                    value={dateOfBirth || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                  />
                </View>
              </View>
            </Modal>
          )}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#28666099"
            value={address}
            onChangeText={setAddress}
            autoCapitalize="words"
          />
        </View>

        {/* Conditional fields for Doctor/Nurse */}
        {(selectedRole === "doctor" || selectedRole === "nurse") && (
          <>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Medical License Number"
                placeholderTextColor="#28666099"
                value={medicalLicenseNumber}
                onChangeText={setMedicalLicenseNumber}
                autoCapitalize="words"
              />
            </View>
            {selectedRole === "doctor" && (
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Specialty (e.g., Cardiology)"
                  placeholderTextColor="#28666099"
                  value={specialty}
                  onChangeText={setSpecialty}
                  autoCapitalize="words"
                />
              </View>
            )}
            {/* Add more specific fields for doctors/nurses here */}
          </>
        )}

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#28666099"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            textContentType="newPassword"
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#28666099"
            value={password2}
            onChangeText={setPassword2}
            secureTextEntry={true}
            autoCapitalize="none"
            textContentType="newPassword"
          />
        </View>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAgree((a) => !a)}
        >
          <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
            {agree && <Feather name="check" size={16} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree to the terms and service
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.signupBtnText}>
            {loading ? "Signing up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/auth/login")}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 160,
    minHeight: "100%",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: PRIMARY_COLOR,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    minHeight: 120,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 24,
    paddingBottom: 18,
    paddingHorizontal: 28,
    zIndex: 10,
  },
  headerDots: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    marginLeft: 2,
    letterSpacing: 6,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 40,
    marginBottom: 0,
  },
  closeIcon: {
    position: "absolute",
    right: 24,
    top: 28,
    zIndex: 2,
  },
  card: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
    paddingVertical: 32,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 24,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 22,
    textAlign: "center",
  },
  labelGroup: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
    marginLeft: 2,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: PRIMARY_COLOR,
    marginRight: 8,
  },
  roleLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#18304a",
    backgroundColor: "#e6f2ef",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  inputGroup: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 16,
    height: 54,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: PRIMARY_COLOR,
    backgroundColor: "transparent",
    fontWeight: "500",
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontFamily: Platform.OS === "web" ? undefined : "System",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    alignSelf: "flex-start",
    marginLeft: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  checkboxLabel: {
    fontWeight: "500",
    fontSize: 15,
    color: PRIMARY_COLOR,
  },
  signupBtn: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 8,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  signupBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 19,
    letterSpacing: 1,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 4,
  },
  loginText: {
    color: PRIMARY_COLOR,
    fontSize: 15,
    fontWeight: "500",
  },
  loginLink: {
    color: PRIMARY_COLOR,
    fontWeight: "700",
    marginLeft: 5,
    textDecorationLine: "underline",
    fontSize: 15,
  },
  rowInputs: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 18,
  },
  pickerTrigger: {
    justifyContent: "space-between",
  },
  pickerModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  iosDatePickerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 0, // Extra padding for iOS
  },
  pickerDoneButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pickerDoneButtonText: {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
    fontSize: 18,
  },
  pickerItem: {
    // Style for Picker.Item
    color: PRIMARY_COLOR,
    fontSize: 18,
  },
  placeholderItem: {
    color: "#28666099", // Placeholder color
  },
});