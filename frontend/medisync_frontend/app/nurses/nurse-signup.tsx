import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  Modal,
  ImageBackground,
  Image,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIMARY_COLOR = "#286660";

function NurseSignupScreen() {
  const params = useLocalSearchParams();
  const termsAccepted = params.termsAccepted;
  const hasSetAgree = useRef(false);

  // UI state for pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initial form values for nurse - aligned with backend models
  const initialValues = {
    email: "",
    full_name: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
    address: "",
    password: "",
    password2: "",
    agree: false,
    // NurseProfile fields
    license_number: "",
    availability: {},
  };

  // Load saved form data when component mounts
  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('nurseSignupFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Restore form data if it exists
        if (parsedData.timestamp && Date.now() - parsedData.timestamp < 300000) { // 5 minutes
          return parsedData.formData;
        }
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
    return initialValues;
  };

  const saveFormData = async (formData: any) => {
    try {
      await AsyncStorage.setItem('nurseSignupFormData', JSON.stringify({
        formData,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const clearFormData = async () => {
    try {
      await AsyncStorage.removeItem('nurseSignupFormData');
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  };

  // --- Date Picker Handlers ---
  const onChangeDate = (formik: any, event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      formik.setFieldValue(
        "date_of_birth",
        selectedDate.toISOString().split("T")[0]
      );
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setLoading(true);

    // Basic frontend validation
    if (
      !values.email ||
      !values.full_name ||
      !values.password ||
      !values.password2 ||
      !values.gender ||
      !values.date_of_birth ||
      !values.license_number ||
      !values.specialization
    ) {
      Alert.alert(
        "Error",
        "Please fill in all required fields: Email, Full Name, Password, Gender, Date of Birth, License Number, Specialization"
      );
      setLoading(false);
      setSubmitting(false);
      return;
    }

    if (!values.agree) {
      Toast.show({
        text1: "Please agree to the terms and service.",
        type: "error",
      });
      setLoading(false);
      setSubmitting(false);
      return;
    }

    const payload = {
      email: values.email,
      password: values.password,
      password2: values.password2,
      role: "nurse",
      full_name: values.full_name,
      phone_number: values.phone_number,
      date_of_birth: values.date_of_birth,
      gender: values.gender,
      address: values.address,
      specialization: values.specialization,
      license_number: values.license_number,
      availability: values.availability,
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
        Alert.alert("Success", "Registration successful! Please verify your account.");
        console.log("Registration data:", data);
        router.replace("/auth/verification" as any);
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
    <View style={styles.container}>
      {/* Top Section - Background Image */}
      <View style={styles.topSection}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} />
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Bottom Section - Form */}
      <View style={styles.bottomSection}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ handleChange, handleBlur, values, setFieldValue }) => {
            // Handle terms acceptance - only set once when terms are accepted
            if (termsAccepted === "true" && !hasSetAgree.current) {
              setFieldValue("agree", true);
              hasSetAgree.current = true;
            }
            
            return (
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity style={styles.backButton} onPress={() => router.push('/auth/role-selection')}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>Create Nurse Account</Text>
                </View>
                
                {/* Input Fields */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>FULL NAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#000000"
                    value={values.full_name}
                    onChangeText={handleChange("full_name")}
                    onBlur={handleBlur("full_name")}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>EMAIL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#000000"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#000000"
                    value={values.phone_number}
                    onChangeText={handleChange("phone_number")}
                    onBlur={handleBlur("phone_number")}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Gender and Date of Birth side by side */}
                <View style={styles.rowInputs}>
                  {/* Gender Picker */}
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>GENDER</Text>
                    <TouchableOpacity
                      style={styles.pickerTrigger}
                      onPress={() => setShowGenderPicker(true)}
                    >
                      <Text style={styles.pickerText}>
                        {values.gender || "Select Gender"}
                      </Text>
                      <Feather
                        name="chevron-down"
                        size={20}
                        color="#000000"
                      />
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
                            selectedValue={values.gender}
                            onValueChange={(itemValue) => {
                              setFieldValue("gender", itemValue);
                              if (
                                Platform.OS === "android" ||
                                Platform.OS === "web"
                              ) {
                                setShowGenderPicker(false);
                              }
                            }}
                            itemStyle={styles.pickerItem}
                          >
                            <Picker.Item
                              label="Select Gender"
                              value=""
                              enabled={false}
                            />
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                            <Picker.Item
                              label="Non-binary"
                              value="non-binary"
                            />
                          </Picker>
                          {(Platform.OS === "ios" || Platform.OS === "web") && (
                            <TouchableOpacity
                              style={styles.pickerDoneButton}
                              onPress={() => setShowGenderPicker(false)}
                            >
                              <Text style={styles.pickerDoneButtonText}>
                                Done
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </Modal>
                  </View>

                  {/* Date of Birth */}
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>DATE OF BIRTH</Text>
                    {Platform.OS === "web" ? (
                      <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#000000"
                        value={values.date_of_birth}
                        onChangeText={handleChange("date_of_birth")}
                        onBlur={handleBlur("date_of_birth")}
                      />
                    ) : (
                      <TouchableOpacity
                        style={styles.pickerTrigger}
                        onPress={showDatepicker}
                      >
                        <Text style={styles.pickerText}>
                          {values.date_of_birth || "Select Date"}
                        </Text>
                        <Feather
                          name="calendar"
                          size={20}
                          color="#000000"
                        />
                      </TouchableOpacity>
                    )}
                    {showDatePicker && (
                      <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedDate) =>
                          onChangeDate({ setFieldValue }, event, selectedDate)
                        }
                      />
                    )}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>LICENSE NUMBER</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your license number"
                    placeholderTextColor="#000000"
                    value={values.license_number}
                    onChangeText={handleChange("license_number")}
                    onBlur={handleBlur("license_number")}
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>ADDRESS</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your address"
                    placeholderTextColor="#000000"
                    value={values.address}
                    onChangeText={handleChange("address")}
                    onBlur={handleBlur("address")}
                    autoCapitalize="words"
                    multiline
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      placeholderTextColor="#000000"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
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

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Confirm your password"
                      placeholderTextColor="#000000"
                      value={values.password2}
                      onChangeText={handleChange("password2")}
                      onBlur={handleBlur("password2")}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      textContentType="password"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Feather
                        name={showConfirmPassword ? "eye" : "eye-off"}
                        size={20}
                        color="#000"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={async () => {
                    // Save current form data before navigating to terms
                    await saveFormData(values);
                    router.push('/auth/terms');
                  }}
                >
                  <View
                    style={[
                      styles.checkbox,
                      values.agree && styles.checkboxChecked,
                    ]}
                  >
                    {values.agree && (
                      <Feather name="check" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    I agree to the terms and service
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.signupButton,
                    loading && styles.signupButtonDisabled,
                  ]}
                  onPress={async () => {
                    // Clear saved form data on successful submission
                    await clearFormData();
                    handleSubmit(values, { setSubmitting: () => {} });
                  }}
                  disabled={loading}
                >
                  <Text style={styles.signupButtonText}>
                    {loading ? "Signing up..." : "Sign up"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            );
          }}
        </Formik>
      </View>
    </View>
  );
}

export default NurseSignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 0.5, 
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '60%',
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
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  bottomSection: {
    flex: 0.5, // Adjusted from 0.6 to match the top section
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#bed2d0',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#bed2d0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#bed2d0',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInputContainer: {
    flex: 0.48,
  },
  pickerTrigger: {
    backgroundColor: '#bed2d0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bed2d0',
  },
  pickerText: {
    color: '#000',
    fontSize: 16,
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#bed2d0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerItem: {
    color: '#000',
  },
  pickerDoneButton: {
    backgroundColor: PRIMARY_COLOR,
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerDoneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bed2d0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bed2d0',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#bed2d0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#bed2d0',
    borderColor: '#bed2d0',
  },
  checkboxLabel: {
    color: '#bed2d0',
    fontSize: 14,
    flex: 1,
  },
  signupButton: {
    backgroundColor: '#bed2d0',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
