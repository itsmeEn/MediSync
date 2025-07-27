import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const PRIMARY_COLOR = "#286660";
const ACCENT_COLOR = "#bed2d0";
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Add your login logic here
    alert('Login pressed!');
  };

  return (
    <View style={styles.bg}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerDots}>•••</Text>
        <Text style={styles.headerTitle}>Welcome{"\n"}Back</Text>
        <TouchableOpacity style={styles.closeIcon}>
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
        <Text style={styles.cardTitle}>Log in to your account to continue</Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Enter your registered email address"
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
            placeholder="Enter your password"
            placeholderTextColor="#28666099"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            textContentType="password"
          />
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowPassword((s) => !s)}
            accessibilityLabel="Show password"
          >
            <Feather name={showPassword ? "eye" : "eye-off"} size={24} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgree((a) => !a)}>
          <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
            {agree && <Feather name="check" size={16} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>I agree to the terms and service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginBtnText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/auth/role-selection')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    width: '100%',
    backgroundColor: PRIMARY_COLOR,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    minHeight: 120,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 24,
    paddingBottom: 18,
    paddingHorizontal: 28,
    marginBottom: -40,
    position: 'relative',
  },
  headerDots: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    marginLeft: 2,
    letterSpacing: 6,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 40,
    marginBottom: 0,
  },
  closeIcon: {
    position: 'absolute',
    right: 24,
    top: 28,
    zIndex: 2,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
    paddingVertical: 32,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginTop: 100,
    backgroundColor: 'transparent',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 22,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 16,
    height: 54,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: PRIMARY_COLOR,
    backgroundColor: 'transparent',
    fontWeight: '500',
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontFamily: Platform.OS === 'web' ? undefined : 'System',
  },
  iconBtn: {
    backgroundColor: 'transparent',
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginRight: 2,
  },
  forgotText: {
    color: PRIMARY_COLOR,
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  checkboxLabel: {
    fontWeight: '500',
    fontSize: 15,
    color: PRIMARY_COLOR,
  },
  loginBtn: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
    letterSpacing: 1,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 4,
  },
  signupText: {
    color: PRIMARY_COLOR,
    fontSize: 15,
    fontWeight: '500',
  },
  signupLink: {
    color: PRIMARY_COLOR,
    fontWeight: '700',
    marginLeft: 5,
    textDecorationLine: 'underline',
    fontSize: 15,
  },
});
